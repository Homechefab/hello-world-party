// Stripe Connect (Express) — onboarding + automatiska utbetalningar till kockar.
// Homechef behåller sin provision på plattformskontot och kockens andel överförs
// automatiskt till kockens egna Stripe-konto när beställningen är slutförd.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SELLER_COMMISSION_RATE = 0.19;

const log = (step: string, details?: unknown) => {
  console.log(`[CHEF-PAYOUTS] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type SupabaseClient = ReturnType<typeof createClient>;

function isTrustedUrl(url: string, origin: string | null): boolean {
  const allowed = [origin, "https://homechef.nu", "https://www.homechef.nu", "https://hello-world-party.lovable.app"].filter(
    Boolean,
  ) as string[];
  try {
    return allowed.some((o) => new URL(url).origin === o);
  } catch {
    return false;
  }
}

async function syncAccount(stripe: Stripe, supabase: SupabaseClient, chefId: string, accountId: string) {
  const account = await stripe.accounts.retrieve(accountId);
  const requirements = [
    ...(account.requirements?.currently_due ?? []),
    ...(account.requirements?.past_due ?? []),
  ];
  const row = {
    chef_id: chefId,
    stripe_account_id: account.id,
    charges_enabled: !!account.charges_enabled,
    payouts_enabled: !!account.payouts_enabled,
    details_submitted: !!account.details_submitted,
    requirements_due: requirements.length > 0 ? requirements.join(", ") : null,
  };
  await supabase.from("chef_payout_accounts").upsert(row, { onConflict: "chef_id" });
  return row;
}

/** Överför kockens andel för en slutförd, betald beställning. Idempotent. */
async function releaseOrder(stripe: Stripe, supabase: SupabaseClient, orderId: string) {
  const { data: order } = await supabase
    .from("orders")
    .select("id, chef_id, status, total_amount, stripe_session_id, payout_status, stripe_transfer_id")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return { ok: false, reason: "order_not_found" };
  if (order.stripe_transfer_id || order.payout_status === "paid") return { ok: true, reason: "already_paid" };
  if (!["completed", "delivered"].includes(String(order.status))) return { ok: false, reason: "not_completed" };

  const { data: payoutAccount } = await supabase
    .from("chef_payout_accounts")
    .select("stripe_account_id, payouts_enabled")
    .eq("chef_id", order.chef_id)
    .maybeSingle();

  if (!payoutAccount?.stripe_account_id || !payoutAccount.payouts_enabled) {
    await supabase
      .from("orders")
      .update({ payout_status: "manual", payout_error: "Kocken har inget aktivt Stripe-utbetalningskonto" })
      .eq("id", orderId);
    return { ok: false, reason: "no_connected_account" };
  }

  let chargeId: string | null = null;
  if (order.stripe_session_id) {
    const { data: tx } = await supabase
      .from("payment_transactions")
      .select("stripe_charge_id, payment_status")
      .eq("stripe_session_id", order.stripe_session_id)
      .maybeSingle();
    if (tx && tx.payment_status && !["paid", "succeeded", "complete"].includes(String(tx.payment_status))) {
      return { ok: false, reason: "payment_not_settled" };
    }
    chargeId = (tx?.stripe_charge_id as string | null) ?? null;
  }

  const chefEarnings = Number(order.total_amount) * (1 - SELLER_COMMISSION_RATE);
  const amountInOre = Math.round(chefEarnings * 100);
  if (amountInOre <= 0) return { ok: false, reason: "zero_amount" };

  try {
    const transfer = await stripe.transfers.create(
      {
        amount: amountInOre,
        currency: "sek",
        destination: payoutAccount.stripe_account_id as string,
        description: `Homechef order ${orderId}`,
        ...(chargeId ? { source_transaction: chargeId } : {}),
        ...(order.stripe_session_id ? { transfer_group: String(order.stripe_session_id) } : {}),
        metadata: { order_id: orderId, chef_id: String(order.chef_id) },
      },
      { idempotencyKey: `payout_order_${orderId}` },
    );

    await supabase
      .from("orders")
      .update({
        chef_earnings: chefEarnings,
        payout_status: "paid",
        stripe_transfer_id: transfer.id,
        paid_out_at: new Date().toISOString(),
        payout_error: null,
      })
      .eq("id", orderId);

    log("Transfer created", { orderId, transferId: transfer.id, amountInOre });
    return { ok: true, transferId: transfer.id, amount: chefEarnings };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log("Transfer failed", { orderId, message });
    await supabase.from("orders").update({ payout_status: "failed", payout_error: message }).eq("id", orderId);
    return { ok: false, reason: "transfer_failed", message };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const supabaseAuth = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const { data: authData, error: authError } = await supabaseAuth.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !authData.user) return json({ error: "Unauthorized" }, 401);
    const userId = authData.user.id;

    const { data: isAdminData } = await supabaseService.rpc("has_role", { _user_id: userId, _role: "admin" });
    const isAdmin = isAdminData === true;

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "status");

    // --- Utbetalning för en beställning -------------------------------------
    if (action === "release") {
      const orderId = String(body.orderId || "");
      if (!orderId) return json({ error: "orderId krävs" }, 400);

      const { data: order } = await supabaseService
        .from("orders")
        .select("id, chef_id, customer_id")
        .eq("id", orderId)
        .maybeSingle();
      if (!order) return json({ error: "Beställning hittades inte" }, 404);

      if (!isAdmin) {
        const { data: chefRow } = await supabaseService
          .from("chefs")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
        if (!chefRow || chefRow.id !== order.chef_id) return json({ error: "Forbidden" }, 403);
      }

      const result = await releaseOrder(stripe, supabaseService, orderId);
      return json(result);
    }

    // --- Batch: alla slutförda beställningar som väntar på utbetalning -------
    if (action === "release_due") {
      if (!isAdmin) return json({ error: "Forbidden" }, 403);
      const { data: due } = await supabaseService
        .from("orders")
        .select("id")
        .in("status", ["completed", "delivered"])
        .is("stripe_transfer_id", null)
        .neq("payout_status", "paid")
        .limit(100);

      const results = [];
      for (const o of due ?? []) {
        results.push({ orderId: o.id, ...(await releaseOrder(stripe, supabaseService, String(o.id))) });
      }
      return json({ processed: results.length, results });
    }

    // --- Onboarding / status för kockens utbetalningskonto -------------------
    let chefId: string | null = null;
    if (body.chefId && isAdmin) {
      chefId = String(body.chefId);
    } else {
      const { data: chefRow } = await supabaseService.from("chefs").select("id").eq("user_id", userId).maybeSingle();
      chefId = (chefRow?.id as string) ?? null;
    }
    if (!chefId) return json({ error: "Ingen kockprofil hittades" }, 404);

    const { data: existing } = await supabaseService
      .from("chef_payout_accounts")
      .select("stripe_account_id")
      .eq("chef_id", chefId)
      .maybeSingle();

    if (action === "status") {
      if (!existing?.stripe_account_id) return json({ connected: false });
      const synced = await syncAccount(stripe, supabaseService, chefId, String(existing.stripe_account_id));
      return json({ connected: true, ...synced });
    }

    if (action === "onboard") {
      const origin = req.headers.get("origin");
      const returnUrl = typeof body.returnUrl === "string" && isTrustedUrl(body.returnUrl, origin)
        ? body.returnUrl
        : `${origin ?? "https://homechef.nu"}/chef/dashboard`;

      let accountId = existing?.stripe_account_id as string | undefined;

      if (!accountId) {
        const { data: chef } = await supabaseService
          .from("chefs")
          .select("contact_email, business_name")
          .eq("id", chefId)
          .maybeSingle();

        const account = await stripe.accounts.create({
          type: "express",
          country: "SE",
          email: (chef?.contact_email as string) || undefined,
          business_profile: {
            name: (chef?.business_name as string) || undefined,
            product_description: "Hemlagad mat via Homechef",
          },
          capabilities: { transfers: { requested: true } },
          metadata: { chef_id: chefId },
        });
        accountId = account.id;
        await supabaseService
          .from("chef_payout_accounts")
          .upsert({ chef_id: chefId, stripe_account_id: accountId }, { onConflict: "chef_id" });
        log("Express account created", { chefId, accountId });
      }

      const link = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: returnUrl,
        return_url: returnUrl,
        type: "account_onboarding",
      });

      return json({ url: link.url, accountId });
    }

    if (action === "dashboard") {
      if (!existing?.stripe_account_id) return json({ error: "Inget konto kopplat" }, 400);
      const link = await stripe.accounts.createLoginLink(String(existing.stripe_account_id));
      return json({ url: link.url });
    }

    return json({ error: "Okänd åtgärd" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", { message });
    return json({ error: message }, 500);
  }
});
