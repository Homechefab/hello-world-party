import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Calculate previous month range
    const now = new Date();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = now.getMonth() === 0 ? 12 : now.getMonth(); // 1-indexed previous month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00Z`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}T23:59:59Z`;

    const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
    const monthLabel = `${monthNames[month - 1]} ${year}`;

    console.log(`[MONTHLY-REPORT] Generating reports for ${monthLabel} (${startDate} to ${endDate})`);

    // Fetch all transactions for the previous month
    const { data: transactions, error: txError } = await supabase
      .from('payment_transactions')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .eq('payment_status', 'paid');

    if (txError) throw txError;

    if (!transactions || transactions.length === 0) {
      console.log("[MONTHLY-REPORT] No transactions found for the period");
      return new Response(JSON.stringify({ message: "Inga transaktioner att rapportera", sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Group transactions by chef_id
    const chefTransactions = new Map<string, typeof transactions>();
    for (const tx of transactions) {
      if (!tx.chef_id) continue;
      const existing = chefTransactions.get(tx.chef_id) || [];
      existing.push(tx);
      chefTransactions.set(tx.chef_id, existing);
    }

    // Fetch chef details
    const chefIds = Array.from(chefTransactions.keys());
    if (chefIds.length === 0) {
      console.log("[MONTHLY-REPORT] No chef-linked transactions found");
      return new Response(JSON.stringify({ message: "Inga kocklänkade transaktioner", sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: chefs, error: chefError } = await supabase
      .from('chefs')
      .select('id, business_name, full_name, contact_email')
      .in('id', chefIds);

    if (chefError) throw chefError;

    let sentCount = 0;
    const errors: string[] = [];

    for (const chef of (chefs || [])) {
      const txs = chefTransactions.get(chef.id);
      if (!txs || txs.length === 0) continue;

      const email = chef.contact_email;
      if (!email) {
        console.log(`[MONTHLY-REPORT] Chef ${chef.id} has no contact_email, skipping`);
        continue;
      }

      const totalSales = txs.reduce((s, t) => s + t.total_amount, 0);
      const totalEarnings = txs.reduce((s, t) => s + t.chef_earnings, 0);
      const totalFees = txs.reduce((s, t) => s + t.platform_fee, 0);

      // Build per-dish breakdown
      const dishMap = new Map<string, { count: number; earnings: number; sales: number }>();
      for (const tx of txs) {
        const d = dishMap.get(tx.dish_name) || { count: 0, earnings: 0, sales: 0 };
        d.count += tx.quantity;
        d.earnings += tx.chef_earnings;
        d.sales += tx.total_amount;
        dishMap.set(tx.dish_name, d);
      }

      const dishRows = Array.from(dishMap.entries())
        .sort((a, b) => b[1].earnings - a[1].earnings)
        .map(([name, d]) => `
          <tr>
            <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;">${escapeHtml(name)}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.count}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;text-align:right;">${d.sales.toFixed(2)} kr</td>
            <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#16a34a;">${d.earnings.toFixed(2)} kr</td>
          </tr>
        `).join('');

      const chefName = chef.business_name || chef.full_name || 'Säljare';

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:linear-gradient(135deg,#EA580C,#FB923C);color:white;padding:32px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="margin:0;font-size:24px;">Homechef</h1>
      <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">Månadsrapport — ${monthLabel}</p>
    </div>
    <div style="background:white;padding:32px;border-radius:0 0 12px 12px;">
      <p style="font-size:16px;color:#1a1a1a;">Hej <strong>${escapeHtml(chefName)}</strong>,</p>
      <p style="color:#6b7280;margin-bottom:24px;">Här är din sammanfattning för ${monthLabel}.</p>
      
      <div style="display:flex;gap:12px;margin-bottom:24px;">
        <div style="flex:1;background:#f0fdf4;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Din intäkt</div>
          <div style="font-size:22px;font-weight:700;color:#16a34a;">${totalEarnings.toFixed(2)} kr</div>
        </div>
        <div style="flex:1;background:#f9fafb;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Total försäljning</div>
          <div style="font-size:22px;font-weight:700;color:#1a1a1a;">${totalSales.toFixed(2)} kr</div>
        </div>
        <div style="flex:1;background:#f9fafb;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Antal köp</div>
          <div style="font-size:22px;font-weight:700;color:#1a1a1a;">${txs.length}</div>
        </div>
      </div>

      <h3 style="font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Per rätt</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:10px 16px;text-align:left;font-weight:600;">Rätt</th>
            <th style="padding:10px 16px;text-align:center;font-weight:600;">Antal</th>
            <th style="padding:10px 16px;text-align:right;font-weight:600;">Försäljning</th>
            <th style="padding:10px 16px;text-align:right;font-weight:600;">Din intäkt</th>
          </tr>
        </thead>
        <tbody>
          ${dishRows}
        </tbody>
        <tfoot>
          <tr style="background:#f0fdf4;">
            <td colspan="2" style="padding:12px 16px;font-weight:700;">Totalt</td>
            <td style="padding:12px 16px;text-align:right;font-weight:700;">${totalSales.toFixed(2)} kr</td>
            <td style="padding:12px 16px;text-align:right;font-weight:700;color:#16a34a;">${totalEarnings.toFixed(2)} kr</td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top:24px;padding:16px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px;font-size:13px;color:#78350f;">
        <strong>Avgifter:</strong> Homechef tar en serviceavgift på 6% från kunden och 19% provision från dina priser. Du får 81% av ditt angivna pris.<br>
        <strong>Homechefs avgift denna månad:</strong> ${totalFees.toFixed(2)} kr
      </div>

      <p style="margin-top:24px;font-size:13px;color:#9ca3af;text-align:center;">
        Detta underlag är automatiskt genererat av Homechef AB (559547-7026).<br>
        Kiselvägen 15a, 269 41 Östra Karup
      </p>
    </div>
  </div>
</body>
</html>`;

      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Homechef <info@homechef.nu>",
            to: [email],
            subject: `Din månadsrapport — ${monthLabel}`,
            html,
          }),
        });

        if (emailRes.ok) {
          sentCount++;
          console.log(`[MONTHLY-REPORT] Sent report to ${email} for chef ${chef.id}`);
        } else {
          const errText = await emailRes.text();
          console.error(`[MONTHLY-REPORT] Failed to send to ${email}: ${errText}`);
          errors.push(`${email}: ${errText}`);
        }
      } catch (emailErr) {
        console.error(`[MONTHLY-REPORT] Error sending to ${email}:`, emailErr);
        errors.push(`${email}: ${emailErr instanceof Error ? emailErr.message : 'Unknown error'}`);
      }
    }

    console.log(`[MONTHLY-REPORT] Done. Sent: ${sentCount}, Errors: ${errors.length}`);

    return new Response(JSON.stringify({ 
      message: `Månadsrapporter skickade`, 
      sent: sentCount, 
      errors: errors.length > 0 ? errors : undefined,
      period: monthLabel 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[MONTHLY-REPORT] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Okänt fel" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
