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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // ---- Auth: require valid JWT (user or service_role) ----
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const callerRole = claimsData.claims.role as string | undefined;
    const callerUserId = claimsData.claims.sub as string | undefined;
    const isServiceRole = callerRole === 'service_role';

    // Use service role for all data fetching
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { order_id } = await req.json();
    if (!order_id) throw new Error('order_id is required');

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(quantity, unit_price, dishes(name))')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message}`);
    }

    // Get chef's email and phone
    const { data: chef, error: chefError } = await supabase
      .from('chefs')
      .select('contact_email, full_name, business_name, phone, user_id')
      .eq('id', order.chef_id)
      .single();

    if (chefError || !chef) {
      console.log('No chef found, skipping notifications');
      return new Response(
        JSON.stringify({ success: false, reason: 'no_chef_found' }),
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

    // Send email via Resend (if chef has email)
    let emailSent = false;
    if (chef.contact_email) {
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
      emailSent = true;
    }

    // Send SMS via 46elks (if chef has phone)
    let smsSent = false;
    if (chef.phone) {
      const ELKS_API_USERNAME = Deno.env.get('ELKS_API_USERNAME');
      const ELKS_API_PASSWORD = Deno.env.get('ELKS_API_PASSWORD');

      if (ELKS_API_USERNAME && ELKS_API_PASSWORD) {
        // Format phone: ensure E.164 format for Swedish numbers
        let toPhone = chef.phone.replace(/[\s\-()]/g, '');
        if (toPhone.startsWith('0')) {
          toPhone = '+46' + toPhone.substring(1);
        } else if (!toPhone.startsWith('+')) {
          toPhone = '+46' + toPhone;
        }

        const smsBody = `Ny bestallning #${orderId}`;

        try {
          const basicAuth = btoa(`${ELKS_API_USERNAME}:${ELKS_API_PASSWORD}`);
          const smsResponse = await fetch('https://api.46elks.com/a1/sms', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              from: 'Homechef',
              to: toPhone,
              message: smsBody,
            }),
          });

          const smsResult = await smsResponse.json();
          if (!smsResponse.ok) {
            console.error('46elks SMS error:', JSON.stringify(smsResult));
          } else {
            console.log('SMS sent to chef:', toPhone, 'ID:', smsResult.id);
            smsSent = true;
          }
        } catch (smsError) {
          console.error('SMS sending failed:', smsError);
        }
      } else {
        console.log('46elks not configured, skipping SMS.');
      }
    }

    return new Response(
      JSON.stringify({ success: true, emailSent, smsSent }),
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