import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId är obligatoriskt" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch transaction from database
    const { data: transaction, error: dbError } = await supabaseClient
      .from("payment_transactions")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (dbError || !transaction) {
      return new Response(
        JSON.stringify({ error: "Transaktion hittades inte i databasen" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Generate HTML report for commission breakdown
    const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
    .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .row:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #374151; }
    .value { color: #111827; }
    .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .total { font-size: 18px; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🏠 HOMECHEF</div>
    <h1>Provisionsunderlag</h1>
    <p>Datum: ${new Date(transaction.created_at).toLocaleDateString('sv-SE')}</p>
  </div>

  <div class="section">
    <h2>Transaktionsdetaljer</h2>
    <div class="row">
      <span class="label">Transaktions-ID:</span>
      <span class="value">${transaction.id}</span>
    </div>
    <div class="row">
      <span class="label">Stripe Session:</span>
      <span class="value">${transaction.stripe_session_id}</span>
    </div>
    <div class="row">
      <span class="label">Kund:</span>
      <span class="value">${transaction.customer_email}</span>
    </div>
    <div class="row">
      <span class="label">Rätt:</span>
      <span class="value">${transaction.dish_name}</span>
    </div>
    <div class="row">
      <span class="label">Antal:</span>
      <span class="value">${transaction.quantity} st</span>
    </div>
  </div>

  <div class="highlight">
    <h2>Provisionsfördelning</h2>
    <div class="row">
      <span class="label">Totalt belopp (inkl. moms):</span>
      <span class="value total">${transaction.total_amount.toFixed(2)} ${transaction.currency}</span>
    </div>
    <div class="row">
      <span class="label">Homechef provision (20%):</span>
      <span class="value" style="color: #2563eb; font-weight: bold;">${transaction.platform_fee.toFixed(2)} ${transaction.currency}</span>
    </div>
    <div class="row">
      <span class="label">Kockens intäkt (80%):</span>
      <span class="value" style="color: #059669; font-weight: bold;">${transaction.chef_earnings.toFixed(2)} ${transaction.currency}</span>
    </div>
  </div>

  <div class="section">
    <h2>Bokföringsinformation</h2>
    <p><strong>Betalningsstatus:</strong> ${transaction.payment_status}</p>
    <p><strong>Valuta:</strong> ${transaction.currency}</p>
    <p><strong>Datum:</strong> ${new Date(transaction.created_at).toLocaleString('sv-SE')}</p>
  </div>

  <div class="footer">
    <p>Detta underlag är genererat för bokföring och ska användas som grund för provisionsutbetalning.</p>
    <p>Homechef AB | Org.nr: XXX XXX-XXXX | info@homechef.se</p>
  </div>
</body>
</html>
    `;

    return new Response(reportHTML, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error generating report:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
