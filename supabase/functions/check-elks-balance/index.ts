import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Threshold in SEK – mejla admin om saldot går under detta
const LOW_BALANCE_THRESHOLD = 20;
const ADMIN_EMAIL = 'info@homechef.nu';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ---- Auth: require admin JWT or service_role (Cron) ----
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  try {
    const token = authHeader.replace('Bearer ', '');
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const role = claimsData.claims.role as string | undefined;
    const userId = claimsData.claims.sub as string | undefined;
    let allowed = role === 'service_role';
    if (!allowed && userId) {
      const supabaseSvc = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      const { data: isAdmin } = await supabaseSvc.rpc('has_role', { _user_id: userId, _role: 'admin' });
      allowed = !!isAdmin;
    }
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (_err) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const ELKS_API_USERNAME = Deno.env.get('ELKS_API_USERNAME');
    const ELKS_API_PASSWORD = Deno.env.get('ELKS_API_PASSWORD');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!ELKS_API_USERNAME || !ELKS_API_PASSWORD) {
      throw new Error('46elks credentials not configured');
    }
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    // Hämta saldo från 46elks
    const basicAuth = btoa(`${ELKS_API_USERNAME}:${ELKS_API_PASSWORD}`);
    const balanceResp = await fetch('https://api.46elks.com/a1/me', {
      headers: { 'Authorization': `Basic ${basicAuth}` },
    });

    if (!balanceResp.ok) {
      throw new Error(`46elks API error: ${balanceResp.status}`);
    }

    const me = await balanceResp.json();
    // 46elks returnerar saldo i ören (cents), dela med 100 för SEK
    const balanceSek = (me.balance ?? 0) / 100;
    const currency = me.currency ?? 'SEK';

    // Uppskatta antal SMS kvar (~0.52 kr per del)
    const estimatedSms = Math.floor(balanceSek / 0.52);
    const isLow = balanceSek < LOW_BALANCE_THRESHOLD;

    console.log(`46elks balance: ${balanceSek} ${currency} (~${estimatedSms} SMS), low=${isLow}`);

    let emailSent = false;

    // Mejla bara om saldot är lågt
    if (isLow) {
      const subject = `⚠️ 46elks saldo lågt: ${balanceSek.toFixed(2)} kr kvar`;
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:24px;border-radius:12px 12px 0 0;">
            <h1 style="color:white;margin:0;font-size:22px;">⚠️ 46elks saldo lågt</h1>
          </div>
          <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <p>Hej!</p>
            <p>Saldot på Homechefs 46elks-konto har gått under <strong>${LOW_BALANCE_THRESHOLD} kr</strong>.</p>
            
            <table style="width:100%;border-collapse:collapse;margin:16px 0;background:#fef3c7;border-radius:8px;">
              <tr>
                <td style="padding:12px;font-weight:bold;">Aktuellt saldo:</td>
                <td style="padding:12px;text-align:right;font-size:20px;color:#d97706;font-weight:bold;">
                  ${balanceSek.toFixed(2)} ${currency}
                </td>
              </tr>
              <tr>
                <td style="padding:12px;font-weight:bold;">Uppskattat antal SMS kvar:</td>
                <td style="padding:12px;text-align:right;">~${estimatedSms} st</td>
              </tr>
            </table>

            <p><strong>Åtgärd:</strong> Logga in på 46elks och fyll på saldot innan SMS-notiserna till kockarna slutar fungera.</p>
            
            <a href="https://46elks.se/account" 
               style="display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;font-weight:bold;">
              Fyll på saldo →
            </a>
            
            <p style="color:#6b7280;font-size:12px;margin-top:24px;">
              Detta mail skickas automatiskt en gång per dag när saldot är under ${LOW_BALANCE_THRESHOLD} kr.
            </p>
          </div>
        </div>
      `;

      const emailResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Homechef <info@homechef.nu>',
          to: [ADMIN_EMAIL],
          subject,
          html,
        }),
      });

      const emailResult = await emailResp.json();
      console.log('Low-balance email sent:', emailResult);
      emailSent = true;
    }

    return new Response(
      JSON.stringify({
        success: true,
        balance: balanceSek,
        currency,
        estimatedSms,
        isLow,
        threshold: LOW_BALANCE_THRESHOLD,
        emailSent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in check-elks-balance:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
