import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { calculatePaymentBreakdown } from "../_shared/payment-breakdown.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    logStep("ERROR: STRIPE_WEBHOOK_SECRET not configured");
    return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    logStep("ERROR: Missing stripe-signature header");
    return new Response(JSON.stringify({ error: "Missing signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logStep("Signature verification failed", { message });
    return new Response(JSON.stringify({ error: `Invalid signature: ${message}` }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  logStep("Event received", { type: event.type, id: event.id });

  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSession(stripe, supabaseService, session);
    } else if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntent(stripe, supabaseService, paymentIntent);
    } else {
      logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logStep("ERROR processing event", { message });
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleCheckoutSession(
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  session: Stripe.Checkout.Session
) {
  logStep("Processing checkout session", { sessionId: session.id, paymentStatus: session.payment_status });

  let paymentIntentId: string | undefined;
  let chargeId: string | undefined;
  let receiptUrl: string | undefined;

  if (session.payment_intent) {
    paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id;

    try {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      const latestChargeId = typeof pi.latest_charge === "string" ? pi.latest_charge : undefined;
      if (latestChargeId) {
        const charge = await stripe.charges.retrieve(latestChargeId);
        chargeId = charge.id;
        receiptUrl = charge.receipt_url || undefined;
      }
    } catch (err) {
      logStep("Could not fetch payment intent/charge", { error: String(err) });
    }
  }

  const totalAmount = (session.amount_total || 0) / 100;
  const breakdown = calculatePaymentBreakdown(totalAmount);

  let dishName = session.metadata?.dish_name || session.metadata?.dishName || "Okänd rätt";
  let transactionChefId: string | undefined;
  let quantityTotal = 1;

  if (session.metadata?.order_items) {
    try {
      const orderItemsData = JSON.parse(session.metadata.order_items) as Array<{
        chefId?: string;
        quantity?: number;
        name?: string;
      }>;
      const chefIds = [...new Set(orderItemsData.map((i) => i.chefId).filter(Boolean))];
      if (chefIds.length === 1 && chefIds[0]) transactionChefId = chefIds[0];
      const derivedQty = orderItemsData.reduce((s, i) => s + (i.quantity || 0), 0);
      if (derivedQty > 0) quantityTotal = derivedQty;
      if (orderItemsData.length === 1 && orderItemsData[0].name) dishName = orderItemsData[0].name;
    } catch {
      // ignore
    }
  }

  if (dishName === "Okänd rätt") {
    try {
      const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
      const firstNonFee = items.data.find((i) => !/serviceavgift/i.test(i.description || ""));
      if (firstNonFee?.description) dishName = firstNonFee.description;
      if (firstNonFee?.quantity) quantityTotal = firstNonFee.quantity;
    } catch (err) {
      logStep("Could not fetch line items", { error: String(err) });
    }
  }

  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    "unknown@email.com";

  const userId = session.metadata?.userId || null;

  const insertData: Record<string, unknown> = {
    stripe_session_id: session.id,
    stripe_payment_intent_id: paymentIntentId,
    stripe_charge_id: chargeId,
    customer_email: customerEmail,
    user_id: userId,
    dish_name: dishName,
    quantity: quantityTotal,
    total_amount: breakdown.totalAmount,
    platform_fee: breakdown.platformFee,
    chef_earnings: breakdown.chefEarnings,
    currency: (session.currency || "sek").toUpperCase(),
    payment_status: session.payment_status || "unknown",
    receipt_url: receiptUrl,
  };

  if (transactionChefId) insertData.chef_id = transactionChefId;

  const { error } = await supabase
    .from("payment_transactions")
    .upsert(insertData, { onConflict: "stripe_session_id" });

  if (error) {
    logStep("ERROR upserting transaction from session", { error: error.message });
    throw error;
  }

  logStep("Transaction saved from checkout session", { sessionId: session.id, totalAmount });
}

async function handlePaymentIntent(
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  paymentIntent: Stripe.PaymentIntent
) {
  logStep("Processing payment intent", { id: paymentIntent.id });

  try {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    });
    if (sessions.data.length > 0) {
      logStep("Found associated session, delegating", { sessionId: sessions.data[0].id });
      await handleCheckoutSession(stripe, supabase, sessions.data[0]);
      return;
    }
  } catch (err) {
    logStep("Could not list sessions for payment intent", { error: String(err) });
  }

  const totalAmount = (paymentIntent.amount_received || paymentIntent.amount || 0) / 100;
  const breakdown = calculatePaymentBreakdown(totalAmount);

  let chargeId: string | undefined;
  let receiptUrl: string | undefined;
  let customerEmail = "unknown@email.com";

  const latestChargeId =
    typeof paymentIntent.latest_charge === "string" ? paymentIntent.latest_charge : undefined;
  if (latestChargeId) {
    try {
      const charge = await stripe.charges.retrieve(latestChargeId);
      chargeId = charge.id;
      receiptUrl = charge.receipt_url || undefined;
      customerEmail = charge.billing_details?.email || charge.receipt_email || customerEmail;
    } catch (err) {
      logStep("Could not fetch charge for PI", { error: String(err) });
    }
  }

  if (customerEmail === "unknown@email.com" && paymentIntent.receipt_email) {
    customerEmail = paymentIntent.receipt_email;
  }

  const userId = paymentIntent.metadata?.userId || null;
  const dishName =
    paymentIntent.metadata?.dish_name ||
    paymentIntent.metadata?.dishName ||
    paymentIntent.description ||
    "Direktbetalning (utan checkout)";

  const insertData: Record<string, unknown> = {
    stripe_session_id: `pi_${paymentIntent.id}`,
    stripe_payment_intent_id: paymentIntent.id,
    stripe_charge_id: chargeId,
    customer_email: customerEmail,
    user_id: userId,
    dish_name: dishName,
    quantity: 1,
    total_amount: breakdown.totalAmount,
    platform_fee: breakdown.platformFee,
    chef_earnings: breakdown.chefEarnings,
    currency: (paymentIntent.currency || "sek").toUpperCase(),
    payment_status: "paid",
    receipt_url: receiptUrl,
  };

  const { error } = await supabase
    .from("payment_transactions")
    .upsert(insertData, { onConflict: "stripe_session_id" });

  if (error) {
    logStep("ERROR upserting transaction from PI", { error: error.message });
    throw error;
  }

  logStep("Transaction saved from payment intent (fallback)", { piId: paymentIntent.id, totalAmount });
}
