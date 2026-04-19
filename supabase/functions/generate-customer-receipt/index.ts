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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAnon.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId är obligatoriskt" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("[CUSTOMER-RECEIPT] Generating receipt for session:", sessionId);

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
      console.error("[CUSTOMER-RECEIPT] Transaction not found:", dbError);
      return new Response(
        JSON.stringify({ error: "Transaktion hittades inte i databasen" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Verify the transaction belongs to the authenticated user
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    const { data: isAdmin } = await supabaseClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    const isOwner = profile?.email === transaction.customer_email;

    if (!isAdmin && !isOwner) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Calculate amounts
    // total_amount includes the 6% service fee, so base price (incl VAT) = total / 1.06
    const totalAmount = transaction.total_amount;
    const basePriceInclVat = totalAmount / 1.06;
    const serviceFee = totalAmount - basePriceInclVat;
    
    // VAT is 12% included in the base price
    const basePriceExclVat = basePriceInclVat / 1.12;
    const vatAmount = basePriceInclVat - basePriceExclVat;
    
    // Provision från säljare (19% av baspriset)
    const sellerCommission = basePriceInclVat * 0.19;
    const sellerEarnings = basePriceInclVat * 0.81;
    const totalToHomechef = serviceFee + sellerCommission;

    console.log("[CUSTOMER-RECEIPT] Calculated amounts:", {
      totalAmount, basePriceExclVat, vatAmount, serviceFee, sellerCommission, sellerEarnings, totalToHomechef
    });

    // Generate clean customer receipt HTML
    const htmlReceipt = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Kvitto - Homechef</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6; color: #1a1a1a; background: #f5f5f5; padding: 40px 20px;
    }
    .receipt {
      max-width: 500px; margin: 0 auto; background: white;
      border: 1px solid #e1e4e8; border-radius: 12px; overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #EA580C 0%, #FB923C 100%);
      color: white; padding: 32px 40px; text-align: center;
    }
    .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
    .header .subtitle { font-size: 16px; opacity: 0.95; }
    .content { padding: 32px 40px; }
    .section {
      margin-bottom: 28px; padding-bottom: 24px;
      border-bottom: 1px solid #e1e4e8;
    }
    .section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .section-title {
      font-size: 11px; font-weight: 600; color: #6b7280;
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
    }
    .row {
      display: flex; justify-content: space-between;
      padding: 8px 0; font-size: 14px;
    }
    .row .label { color: #6b7280; }
    .row .value { color: #1a1a1a; font-weight: 500; }
    .row.service-fee { color: #EA580C; font-weight: 500; }
    .row.total {
      border-top: 2px solid #1a1a1a; padding-top: 16px; margin-top: 12px;
      font-size: 18px; font-weight: 700;
    }
    .commission-box {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border-left: 4px solid #F59E0B; padding: 20px; border-radius: 8px;
      margin-top: 4px;
    }
    .commission-box .title { font-size: 14px; font-weight: 700; color: #92400E; margin-bottom: 12px; }
    .commission-box .crow { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #78350F; }
    .commission-box .crow.border-top { border-top: 2px solid #F59E0B; padding-top: 12px; margin-top: 8px; }
    .commission-box .crow strong { font-weight: 700; }
    .platform-fee { color: #EA580C; }
    .chef-earnings { color: #16A34A; }
    .footer {
      background: #f9fafb; padding: 24px 40px; text-align: center;
      font-size: 12px; color: #6b7280;
    }
    .footer p { margin: 4px 0; }
    @media print {
      body { background: white; padding: 0; }
      .receipt { border: none; box-shadow: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>Homechef</h1>
      <div class="subtitle">Kvitto</div>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title">Beställning</div>
        <div class="row">
          <span class="label">${transaction.dish_name} × ${transaction.quantity}</span>
          <span class="value">${basePriceExclVat.toFixed(2)} kr</span>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Prisspecifikation</div>
        <div class="row">
          <span>Rättpris</span>
          <span>${basePriceExclVat.toFixed(2)} kr</span>
        </div>
        <div class="row">
          <span>Moms (12%)</span>
          <span>+${vatAmount.toFixed(2)} kr</span>
        </div>
        <div class="row service-fee">
          <span>Serviceavgift (6%)</span>
          <span>+${serviceFee.toFixed(2)} kr</span>
        </div>
        <div class="row total">
          <span>Totalt</span>
          <span>${totalAmount.toFixed(2)} kr</span>
        </div>
      </div>
      <div class="section">
        <div class="commission-box">
          <div class="title">📊 Avgiftsfördelning (Hybridmodell)</div>
          <div class="crow">
            <span>Serviceavgift från kund (6%)</span>
            <span class="platform-fee"><strong>+${serviceFee.toFixed(2)} SEK</strong></span>
          </div>
          <div class="crow">
            <span>Provision från säljare (19%)</span>
            <span class="platform-fee"><strong>+${sellerCommission.toFixed(2)} SEK</strong></span>
          </div>
          <div class="crow border-top">
            <span><strong>💰 Totalt till Homechef (inkl. moms)</strong></span>
            <span><strong>${totalToHomechef.toFixed(2)} SEK</strong></span>
          </div>
          <div class="crow border-top">
            <span><strong>🍳 Utbetalning till säljare (81%)</strong></span>
            <span class="chef-earnings"><strong>${sellerEarnings.toFixed(2)} SEK</strong></span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p><strong>Homechef AB</strong></p>
      <p>Org.nr: 559547-7026</p>
      <p>Kiselvägen 15a, 269 41 Östra Karup</p>
      <p style="margin-top: 12px; font-size: 11px; color: #9ca3af;">
        ${new Date(transaction.created_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  </div>
</body>
</html>
    `;

    console.log("[CUSTOMER-RECEIPT] Receipt generated successfully");

    return new Response(htmlReceipt, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/html; charset=utf-8"
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[CUSTOMER-RECEIPT] Error generating receipt:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
