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

    // Hybridmodell beräkningar
    // total_amount inkluderar 6% serviceavgift, så baspris = total / 1.06
    const totalAmount = transaction.total_amount;
    const basePrice = totalAmount / 1.06;
    const serviceFee = totalAmount - basePrice;
    
    // VAT beräkning på baspris (12% för mat i Sverige)
    const vatRate = 0.12;
    const basePriceExclVat = basePrice / (1 + vatRate);
    const vatAmount = basePrice - basePriceExclVat;
    
    // Provision från säljare (19% av baspriset)
    const sellerCommission = basePrice * 0.19;
    const sellerEarnings = basePrice * 0.81;
    const totalToHomechef = serviceFee + sellerCommission;
    
    // Homechefs moms (25% på tjänster)
    const homechefVatRate = 0.25;
    const homechefIncomeExclVat = totalToHomechef / (1 + homechefVatRate);
    const homechefVatAmount = totalToHomechef - homechefIncomeExclVat;
    const homechefNetIncome = homechefIncomeExclVat;
    
    // Uppdelning av moms per intäktskälla
    const serviceFeeExclVat = serviceFee / (1 + homechefVatRate);
    const serviceFeeVat = serviceFee - serviceFeeExclVat;
    const commissionExclVat = sellerCommission / (1 + homechefVatRate);
    const commissionVat = sellerCommission - commissionExclVat;
    
    const serviceFeePercentage = 6;
    const sellerCommissionPercentage = 19;

    console.log("[COMMISSION-REPORT] Calculated amounts:", {
      totalAmount,
      basePrice,
      serviceFee,
      sellerCommission,
      sellerEarnings,
      totalToHomechef,
      homechefVatAmount,
      homechefNetIncome
    });

    // Generate HTML that looks like a professional receipt
    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Provisionsunderlag - ${transaction.stripe_session_id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #f5f5f5;
      padding: 40px 20px;
    }
    
    .receipt {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border: 1px solid #e1e4e8;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #EA580C 0%, #FB923C 100%);
      color: white;
      padding: 32px 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .header .subtitle {
      font-size: 14px;
      opacity: 0.95;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid #e1e4e8;
    }
    
    .section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 14px;
    }
    
    .info-label {
      color: #6b7280;
      font-weight: 500;
    }
    
    .info-value {
      color: #1a1a1a;
      font-weight: 500;
      text-align: right;
    }
    
    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 16px 20px;
      background: #f9fafb;
      border-radius: 6px;
      margin-bottom: 16px;
    }
    
    .item-details {
      flex: 1;
    }
    
    .item-name {
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    
    .item-quantity {
      font-size: 13px;
      color: #6b7280;
    }
    
    .item-price {
      font-weight: 600;
      color: #1a1a1a;
      font-size: 16px;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
    }
    
    .summary-row.total {
      border-top: 2px solid #e1e4e8;
      padding-top: 16px;
      margin-top: 8px;
      font-size: 18px;
      font-weight: 700;
    }
    
    .commission-box {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border-left: 4px solid #F59E0B;
      padding: 24px;
      border-radius: 8px;
      margin: 24px 0;
    }
    
    .commission-title {
      font-size: 16px;
      font-weight: 700;
      color: #92400E;
      margin-bottom: 16px;
    }
    
    .commission-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 15px;
    }
    
    .commission-row .label {
      color: #78350F;
      font-weight: 500;
    }
    
    .commission-row .value {
      font-weight: 700;
      color: #78350F;
    }
    
    .platform-fee {
      color: #EA580C !important;
    }
    
    .chef-earnings {
      color: #16A34A !important;
    }
    
    .payment-method {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #f9fafb;
      border-radius: 6px;
    }
    
    .payment-icon {
      width: 40px;
      height: 40px;
      background: #EA580C;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 18px;
    }
    
    .footer {
      background: #f9fafb;
      padding: 24px 40px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    
    .footer p {
      margin: 4px 0;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #DEF7EC;
      color: #03543F;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .receipt {
        border: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>Homechef AB</h1>
      <div class="subtitle">Provisionsunderlag</div>
    </div>
    
    <div class="content">
      <!-- Transaction Details -->
      <div class="section">
        <div class="section-title">Transaktionsdetaljer</div>
        <div class="info-row">
          <span class="info-label">Transaktion</span>
          <span class="info-value">#${transaction.id.slice(0, 8)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Datum</span>
          <span class="info-value">${new Date(transaction.created_at).toLocaleDateString('sv-SE', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Kund</span>
          <span class="info-value">${transaction.customer_email}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-value">
            <span class="status-badge">${transaction.payment_status === 'paid' ? 'Betald' : transaction.payment_status}</span>
          </span>
        </div>
      </div>
      
      <!-- Order Items -->
      <div class="section">
        <div class="section-title">Beställning</div>
        <div class="order-item">
          <div class="item-details">
            <div class="item-name">${transaction.dish_name}</div>
            <div class="item-quantity">Antal: ${transaction.quantity} st</div>
          </div>
        <div class="item-price">${basePrice.toFixed(2)} ${transaction.currency}</div>
        </div>
      </div>
      
      <!-- Payment Summary -->
      <div class="section">
        <div class="section-title">Ekonomisk sammanfattning</div>
        <div class="summary-row">
          <span>Kundens totala betalning</span>
          <span><strong>${totalAmount.toFixed(2)} ${transaction.currency}</strong></span>
        </div>
        <div class="summary-row" style="border-top: 1px solid #e1e4e8; padding-top: 12px; margin-top: 8px;">
          <span>Varubelopp (exkl. serviceavgift)</span>
          <span>${basePrice.toFixed(2)} ${transaction.currency}</span>
        </div>
        <div class="summary-row">
          <span>↳ Delsumma (exkl. moms)</span>
          <span>${basePriceExclVat.toFixed(2)} ${transaction.currency}</span>
        </div>
        <div class="summary-row">
          <span>↳ Moms (12%)</span>
          <span>${vatAmount.toFixed(2)} ${transaction.currency}</span>
        </div>
      </div>
      
      <!-- Commission Breakdown -->
      <div class="commission-box">
        <div class="commission-title">📊 Avgiftsfördelning (Hybridmodell)</div>
        <div class="commission-row">
          <span class="label">Serviceavgift från kund (${serviceFeePercentage}%)</span>
          <span class="value platform-fee">+${serviceFee.toFixed(2)} ${transaction.currency}</span>
        </div>
        <div class="commission-row">
          <span class="label">Provision från säljare (${sellerCommissionPercentage}%)</span>
          <span class="value platform-fee">+${sellerCommission.toFixed(2)} ${transaction.currency}</span>
        </div>
        <div class="commission-row" style="border-top: 2px solid #F59E0B; padding-top: 12px; margin-top: 8px;">
          <span class="label"><strong>💰 Totalt till Homechef (inkl. moms)</strong></span>
          <span class="value platform-fee"><strong>${totalToHomechef.toFixed(2)} ${transaction.currency}</strong></span>
        </div>
        <div class="commission-row" style="border-top: 1px solid #F59E0B; padding-top: 12px; margin-top: 8px;">
          <span class="label"><strong>🍳 Utbetalning till säljare (81%)</strong></span>
          <span class="value chef-earnings"><strong>${sellerEarnings.toFixed(2)} ${transaction.currency}</strong></span>
        </div>
      </div>
      
      <!-- Homechef VAT Breakdown for Accounting -->
      <div class="section" style="background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%); padding: 24px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #7C3AED;">
        <div class="section-title" style="color: #5B21B6; font-size: 14px; margin-bottom: 20px;">🧾 Homechefs momsredovisning (25% tjänstemoms)</div>
        
        <div style="background: white; border-radius: 6px; padding: 16px; margin-bottom: 16px;">
          <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 8px;">Serviceavgift från kund</div>
          <div class="summary-row" style="font-size: 14px;">
            <span>Belopp inkl. moms</span>
            <span>${serviceFee.toFixed(2)} ${transaction.currency}</span>
          </div>
          <div class="summary-row" style="font-size: 14px;">
            <span>Belopp exkl. moms</span>
            <span>${serviceFeeExclVat.toFixed(2)} ${transaction.currency}</span>
          </div>
          <div class="summary-row" style="font-size: 14px; color: #7C3AED;">
            <span><strong>Utgående moms (25%)</strong></span>
            <span><strong>${serviceFeeVat.toFixed(2)} ${transaction.currency}</strong></span>
          </div>
        </div>
        
        <div style="background: white; border-radius: 6px; padding: 16px; margin-bottom: 16px;">
          <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 8px;">Provision från säljare</div>
          <div class="summary-row" style="font-size: 14px;">
            <span>Belopp inkl. moms</span>
            <span>${sellerCommission.toFixed(2)} ${transaction.currency}</span>
          </div>
          <div class="summary-row" style="font-size: 14px;">
            <span>Belopp exkl. moms</span>
            <span>${commissionExclVat.toFixed(2)} ${transaction.currency}</span>
          </div>
          <div class="summary-row" style="font-size: 14px; color: #7C3AED;">
            <span><strong>Utgående moms (25%)</strong></span>
            <span><strong>${commissionVat.toFixed(2)} ${transaction.currency}</strong></span>
          </div>
        </div>
        
        <div style="background: #7C3AED; color: white; border-radius: 6px; padding: 16px;">
          <div class="summary-row" style="font-size: 14px;">
            <span>Total intäkt inkl. moms</span>
            <span>${totalToHomechef.toFixed(2)} ${transaction.currency}</span>
          </div>
          <div class="summary-row" style="font-size: 14px;">
            <span>Total intäkt exkl. moms</span>
            <span>${homechefIncomeExclVat.toFixed(2)} ${transaction.currency}</span>
          </div>
          <div class="summary-row" style="font-size: 16px; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 12px; margin-top: 8px;">
            <span><strong>💸 Moms att redovisa till Skatteverket</strong></span>
            <span><strong>${homechefVatAmount.toFixed(2)} ${transaction.currency}</strong></span>
          </div>
          <div class="summary-row" style="font-size: 16px;">
            <span><strong>✅ Nettointäkt efter moms</strong></span>
            <span><strong>${homechefNetIncome.toFixed(2)} ${transaction.currency}</strong></span>
          </div>
        </div>
      </div>
      
      <!-- Verification -->
      <div class="section" style="background: #F0FDF4; padding: 16px; border-radius: 8px; margin-top: 16px;">
        <div class="section-title" style="color: #166534;">✅ Verifiering</div>
        <div class="summary-row" style="font-size: 13px;">
          <span>Homechef intäkt + Säljare utbetalning</span>
          <span>${(totalToHomechef + sellerEarnings).toFixed(2)} ${transaction.currency}</span>
        </div>
        <div class="summary-row" style="font-size: 13px;">
          <span>Kundens betalning</span>
          <span>${totalAmount.toFixed(2)} ${transaction.currency}</span>
        </div>
        <div class="summary-row" style="font-size: 13px; border-top: 1px solid #BBF7D0; padding-top: 8px; margin-top: 8px;">
          <span>Homechef moms (serviceavgift + provision)</span>
          <span>${serviceFeeVat.toFixed(2)} + ${commissionVat.toFixed(2)} = ${homechefVatAmount.toFixed(2)} ${transaction.currency}</span>
        </div>
      </div>
      
      <!-- Payment Method -->
      <div class="section">
        <div class="section-title">Betalningsmetod</div>
        <div class="payment-method">
          <div class="payment-icon">💳</div>
          <div>
            <div style="font-weight: 600; color: #1a1a1a;">Stripe Checkout</div>
            <div style="font-size: 12px; color: #6b7280;">Session: ${transaction.stripe_session_id.slice(0, 20)}...</div>
          </div>
        </div>
        ${transaction.receipt_url ? `
        <div style="margin-top: 12px;">
          <a href="${transaction.receipt_url}" style="color: #EA580C; text-decoration: none; font-size: 13px; font-weight: 500;">
            → Visa kundkvitto i Stripe
          </a>
        </div>
        ` : ''}
      </div>
      
      <!-- Accounting Info -->
      <div class="section">
        <div class="section-title">Bokföringsinformation</div>
        <div class="info-row">
          <span class="info-label">Payment Intent ID</span>
          <span class="info-value" style="font-family: monospace; font-size: 12px;">${transaction.stripe_payment_intent_id || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Charge ID</span>
          <span class="info-value" style="font-family: monospace; font-size: 12px;">${transaction.stripe_charge_id || 'N/A'}</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Homechef AB</strong></p>
      <p>Detta provisionsunderlag är automatiskt genererat och utgör underlag för bokföring</p>
      <p>Genererat: ${new Date().toLocaleString('sv-SE')}</p>
    </div>
  </div>
</body>
</html>
    `;

    return new Response(htmlReport, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/html; charset=utf-8"
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
