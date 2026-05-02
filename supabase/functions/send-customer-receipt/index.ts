import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (step: string, details?: unknown) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[SEND-CUSTOMER-RECEIPT] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    // ---- Auth: only allow service_role (called from stripe-webhook) ----
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || claimsData?.claims?.role !== "service_role") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId krävs" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    log("Sending receipt for session", { sessionId });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: transaction, error: dbError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (dbError || !transaction) {
      log("Transaction not found", { dbError });
      return new Response(JSON.stringify({ error: "Transaktion hittades inte" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerEmail = transaction.customer_email;
    if (!customerEmail || customerEmail === "unknown@email.com") {
      log("No valid customer email", { customerEmail });
      return new Response(JSON.stringify({ error: "Ingen giltig e-post" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalAmount = Number(transaction.total_amount);
    const basePriceInclVat = totalAmount / 1.06;
    const serviceFee = totalAmount - basePriceInclVat;
    const basePriceExclVat = basePriceInclVat / 1.12;
    const vatAmount = basePriceInclVat - basePriceExclVat;

    const orderRef = String(transaction.id).slice(0, 8).toUpperCase();
    const dateStr = new Date(transaction.created_at).toLocaleDateString("sv-SE", {
      year: "numeric", month: "long", day: "numeric"
    });

    const escapeHtml = (s: string) =>
      String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    const dishName = escapeHtml(transaction.dish_name || "Beställning");

    const html = `
<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><title>Orderbekräftelse - Homechef</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
      <div style="background:linear-gradient(135deg,#EA580C 0%,#FB923C 100%);color:white;padding:32px 32px;text-align:center;">
        <h1 style="margin:0;font-size:26px;font-weight:700;">Tack för din beställning!</h1>
        <p style="margin:8px 0 0;font-size:15px;opacity:0.95;">Din betalning är genomförd</p>
      </div>
      <div style="padding:28px 32px;">
        <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">
          Hej! Vi har tagit emot din beställning och kocken har fått en notis. Nedan finns ditt kvitto.
        </p>

        <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
          <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Orderreferens</div>
          <div style="font-size:16px;font-weight:600;">#${orderRef}</div>
          <div style="font-size:13px;color:#6b7280;margin-top:4px;">${dateStr}</div>
        </div>

        <div style="margin-bottom:24px;">
          <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Beställning</div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;border-bottom:1px solid #e5e7eb;">
            <span>${dishName} × ${transaction.quantity}</span>
            <span style="font-weight:500;">${basePriceExclVat.toFixed(2)} kr</span>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Prisspecifikation</div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#6b7280;">
            <span>Rättpris</span><span>${basePriceExclVat.toFixed(2)} kr</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#6b7280;">
            <span>Moms (12%)</span><span>+${vatAmount.toFixed(2)} kr</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#EA580C;">
            <span>Serviceavgift (6%)</span><span>+${serviceFee.toFixed(2)} kr</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:14px 0 0;margin-top:8px;border-top:2px solid #1a1a1a;font-size:17px;font-weight:700;">
            <span>Totalt betalt</span><span>${totalAmount.toFixed(2)} kr</span>
          </div>
        </div>

        <div style="background:#ECFDF5;border-left:4px solid #10B981;padding:14px 18px;border-radius:6px;margin-bottom:20px;">
          <div style="font-size:14px;font-weight:600;color:#065F46;margin-bottom:4px;">✓ Betalning bekräftad</div>
          <div style="font-size:13px;color:#047857;">Du får besked från kocken när maten är klar för upphämtning eller leverans.</div>
        </div>

        <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0;">
          Du kan följa din beställning i appen under "Mina beställningar".
        </p>
      </div>
      <div style="background:#f9fafb;padding:20px 32px;text-align:center;font-size:12px;color:#6b7280;">
        <p style="margin:2px 0;"><strong>Homechef AB</strong></p>
        <p style="margin:2px 0;">Org.nr: 559547-7026</p>
        <p style="margin:2px 0;">Kiselvägen 15a, 269 41 Östra Karup</p>
        <p style="margin:12px 0 0;font-size:11px;color:#9ca3af;">Detta är ett automatiskt mejl. Vid frågor, kontakta info@homechef.nu</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Homechef <noreply@homechef.nu>",
        to: [customerEmail],
        subject: `Orderbekräftelse #${orderRef} – Homechef`,
        html,
      }),
    });

    const emailData = await emailRes.json();
    if (!emailRes.ok) {
      log("Resend error", emailData);
      return new Response(JSON.stringify({ error: "Kunde inte skicka mejl", details: emailData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    log("Email sent", { id: emailData?.id, to: customerEmail });

    return new Response(JSON.stringify({ success: true, emailId: emailData?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log("ERROR", { msg });
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
