import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.1?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Authenticate the caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAnon.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Use service role for data fetching
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { order_id } = await req.json();
    if (!order_id) throw new Error('order_id is required');

    // Fetch order and verify the caller owns it
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(quantity, unit_price, dishes(name))')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message}`);
    }

    // Only the customer who placed the order can trigger this notification
    if (order.customer_id !== userId) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get chef's email
    const { data: chef, error: chefError } = await supabase
      .from('chefs')
      .select('contact_email, full_name, business_name')
      .eq('id', order.chef_id)
      .single();

    if (chefError || !chef?.contact_email) {
      console.log('No chef email found, skipping email notification');
      return new Response(
        JSON.stringify({ success: false, reason: 'no_chef_email' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build items list (XSS-safe)
    const itemsList = (order.order_items || [])
      .map((item: any) => {
        const dishName = escapeHtml(item.dishes?.name || 'Okänd rätt');
        return `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${dishName}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${item.unit_price} kr</td>
        </tr>`;
      })
      .join('');

    const orderId = order.id.slice(0, 8);
    const chefName = escapeHtml(chef.full_name || chef.business_name || '');
    const specialInstructions = order.special_instructions ? escapeHtml(order.special_instructions) : '';

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:24px;">🆕 Ny beställning!</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">Beställning #${orderId}</p>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
          <p>Hej ${chefName}! 👋</p>
          <p>Du har fått en ny beställning på <strong>${order.total_amount} kr</strong>.</p>
          
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="padding:8px;text-align:left;">Rätt</th>
                <th style="padding:8px;text-align:center;">Antal</th>
                <th style="padding:8px;text-align:right;">Pris</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:8px;font-weight:bold;">Totalt</td>
                <td style="padding:8px;text-align:right;font-weight:bold;">${order.total_amount} kr</td>
              </tr>
            </tfoot>
          </table>

          ${specialInstructions ? `<p style="background:#fef3c7;padding:12px;border-radius:8px;">📝 <strong>Kundens meddelande:</strong> ${specialInstructions}</p>` : ''}
          
          <a href="https://hello-world-party.lovable.app/chef/dashboard?tab=orders" 
             style="display:inline-block;background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;font-weight:bold;">
            Visa beställning →
          </a>
          
          <p style="color:#6b7280;font-size:12px;margin-top:24px;">
            Detta mail skickades automatiskt från Homechef.
          </p>
        </div>
      </div>
    `;

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Homechef <info@homechef.nu>',
        to: [chef.contact_email],
        subject: `🆕 Ny beställning #${orderId} (${order.total_amount} kr)`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log('Email sent to chef:', chef.contact_email, emailResult);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in notify-chef-new-order:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
