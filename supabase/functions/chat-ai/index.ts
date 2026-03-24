import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GENERAL_KNOWLEDGE = `
**OM HOMECHEF:**
Homechef är Sveriges marknadsplats för hemlagad mat. Vi kopplar hemmakockar med matälskare.

**KONTAKT:**
- Telefon: 0734234686 (Vardagar 09-18, Helger 10-16)
- E-post: support@homechef.nu
- Hemsida: homechef.nu

**BETALNING:** Kort eller Klarna. Säkert via Stripe. Moms 12% ingår.

**LEVERANS:** Beror på kock. Hämta eller leverans. Ej hämtad mat inom 30 min kan kasseras.

**AVBOKNING:** Gratis 24h före. Sen: 50%. Samma dag: ingen återbetalning.

**LOJALITET:** 1 poäng/10 kr. Var 5:e köp = 10% rabatt.

**AVGIFTSMODELL:** Kunder betalar 6% serviceavgift. Säljare (Kockar, Kökspartners, Företag) betalar 19% provision och får 81% av sitt pris. Restauranger betalar fast månadsavgift på 3 999 kr/mån (inga avgifter på försäljningen).

**PROBLEM?**
- Beställning kom ej → Ring 0734234686 för återbetalning
- Kall/fel mat → Ta bild, kontakta oss inom 24h
- Dubbeldebiterats → E-posta support@homechef.nu
- Kan ej logga in → "Glömt lösenord" eller kontakta support
- Radera konto → E-posta support@homechef.nu

**KRAV KOCKAR:** 
- KRAV: Godkännande från kommunen (livsmedelstillstånd)
- REKOMMENDERAT: Försäkring och F-skatt (bra att ha men ej krav)

**KRAV KÖKSPARTNERS:** Godkänt kök från kommunen. Försäkring rekommenderas.
**KRAV RESTAURANGER:** Restaurangtillstånd från kommunen. HACCP och försäkring rekommenderas.

**VIKTIGA LÄNKAR:**
- /chef/application - Bli kock
- /restaurant/application - Bli restaurang
- /hyr-ut-ditt-kok - Hyr ut kök
- /my-orders - Beställningar
- /my-points - Poäng
`;

const ESCALATION_INSTRUCTION = `

**ESKALERINGSREGEL:**
Om du INTE kan svara på kundens fråga med informationen ovan, eller om kunden uttryckligen ber att prata med en människa, MÅSTE du lägga till exakt denna tagg i BÖRJAN av ditt svar: [NEEDS_HUMAN]
Använd denna tagg BARA när du verkligen inte kan hjälpa. Svara fortfarande hjälpsamt och berätta att du skickar frågan vidare till teamet.`;

const KNOWLEDGE_BASE = {
  customer: `Du heter Emma och jobbar på Homechefs kundservice. Svara kort, vänligt och hjälpsamt på svenska.

${GENERAL_KNOWLEDGE}

**KUNDTIPS:**
- Beställ: Sök kock/rätt → varukorg → betala
- Allergier: Visas på varje rätt, filtrera i sök
- Leverans: Tid visas vid beställning
- Missnöjd? Ring 0734234686

Håll svar korta. Hänvisa till 0734234686 vid oklarheter.${ESCALATION_INSTRUCTION}`,

  chef: `Du heter Emma och hjälper kockar på Homechef. Svara kort och vänligt på svenska.

${GENERAL_KNOWLEDGE}

**KOCKTIPS:**
- Bli kock: /chef/application, godkännande 2-3 dagar
- KRAV: Godkännande från kommunen (livsmedelstillstånd)
- REKOMMENDERAT: Försäkring och F-skatt (bra att ha men ej krav)
- Avgifter: 6% kundavgift + 19% provision (du får 81% av ditt pris)
- Utbetalning: Veckovis
- Lägg till rätter: Kock-panelen → Menyer
- Fler kunder: Bra foton + recensioner!

Hänvisa till 0734234686 vid komplicerade frågor.${ESCALATION_INSTRUCTION}`,

  kitchen_partner: `Du heter Emma och hjälper kökspartners på Homechef. Svara kort och vänligt på svenska.

${GENERAL_KNOWLEDGE}

**KÖKSPARTNER-TIPS:**
- Ansök: /hyr-ut-ditt-kok
- Krav: Godkänt kök, försäkring, utrustning
- Avgifter: 6% kundavgift + 19% provision (du får 81% av din hyra)
- Pris: Du bestämmer (200-500 kr/h vanligt)
- Utbetalning: Månadsvis
- Bokningar: Godkänn manuellt via dashboard

Ring 0734234686 vid frågor.${ESCALATION_INSTRUCTION}`,

  restaurant: `Du heter Emma och hjälper restauranger på Homechef. Svara kort och vänligt på svenska.

${GENERAL_KNOWLEDGE}

**RESTAURANG-TIPS:**
- Ansök: /restaurant/application
- Krav: Tillstånd, HACCP, försäkring
- Månadsavgift: 3 999 kr/mån (ingen serviceavgift på försäljningen)
- Utbetalning: Veckovis
- Meny: Lägg upp via restaurang-panelen
- Fler kunder: Snabb leverans + bra foton!

Ring 0734234686 vid frågor.${ESCALATION_INSTRUCTION}`,

  admin: `Du heter Emma och hjälper administratörer på Homechef. Svara kort på svenska.

${GENERAL_KNOWLEDGE}

**ADMIN-FUNKTIONER:**
- Godkänna ansökningar
- Hantera klagomål
- Provisionsrapporter
- Användarhantering

Kontakta utvecklingsteamet vid tekniska problem.${ESCALATION_INSTRUCTION}`
};

async function sendEscalationEmail(userMessage: string, aiResponse: string, userRole: string, conversationHistory: Array<{role: string, content: string}>, userInfo?: { email?: string; phone?: string; name?: string }) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured, cannot send escalation email');
    return;
  }

  const recentMessages = conversationHistory.slice(-6).map(m => 
    `<p style="margin:4px 0;"><strong>${m.role === 'user' ? '👤 Kund' : '🤖 Emma'}:</strong> ${m.content}</p>`
  ).join('');

  const roleLabels: Record<string, string> = {
    customer: 'Kund',
    chef: 'Kock',
    kitchen_partner: 'Kökspartner',
    restaurant: 'Restaurang',
    admin: 'Admin'
  };

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:20px;border-radius:12px 12px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">💬 Emma kunde inte svara – kundförfrågan</h1>
      </div>
      <div style="background:#fff;padding:20px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <div style="background:#fef3c7;padding:12px;border-radius:8px;margin-bottom:16px;">
          <strong>Roll:</strong> ${roleLabels[userRole] || userRole}<br/>
          <strong>Tid:</strong> ${new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}
          ${userInfo?.email ? `<br/><strong>E-post:</strong> <a href="mailto:${userInfo.email}">${userInfo.email}</a>` : ''}
          ${userInfo?.phone ? `<br/><strong>Telefon:</strong> <a href="tel:${userInfo.phone}">${userInfo.phone}</a>` : ''}
          ${userInfo?.name ? `<br/><strong>Namn:</strong> ${userInfo.name}` : ''}
          ${!userInfo?.email && !userInfo?.phone ? '<br/><em style="color:#9ca3af;">Ej inloggad – ingen kontaktinfo tillgänglig</em>' : ''}
        </div>
        <h3 style="margin:12px 0 8px;">Senaste konversationen:</h3>
        <div style="background:#f9fafb;padding:12px;border-radius:8px;font-size:14px;">
          ${recentMessages}
        </div>
        <p style="margin-top:16px;color:#6b7280;font-size:13px;">
          Svara kunden genom att kontakta dem direkt, eller logga in på admin-dashboarden.
        </p>
      </div>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Homechef <info@homechef.nu>',
        to: ['info@homechef.nu'],
        subject: `💬 Kundförfrågan – Emma kunde inte svara (${roleLabels[userRole] || userRole})`,
        html,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend error:', res.status, errText);
    } else {
      console.log('Escalation email sent successfully');
    }
  } catch (err) {
    console.error('Failed to send escalation email:', err);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: authHeader ? { headers: { Authorization: authHeader } } : undefined,
    });

    const bearerToken = authHeader?.replace('Bearer ', '').trim();
    const isAnonymousToken = !bearerToken || bearerToken === supabaseAnonKey;

    let authenticatedUserId: string | null = null;
    if (!isAnonymousToken && bearerToken) {
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(bearerToken);
      if (userError || !userData?.user) {
        console.error('Auth fallback to guest:', userError?.message);
      } else {
        authenticatedUserId = userData.user.id;
      }
    }

    const { messages, userEmail } = await req.json();

    // Look up the user's actual role from the database instead of trusting client input
    let verifiedRole = 'customer';
    if (authenticatedUserId) {
      try {
        const { data: roleRows } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', authenticatedUserId);
        if (roleRows && roleRows.length > 0) {
          // Prefer admin > chef > kitchen_partner > restaurant > customer
          const rolePriority = ['admin', 'chef', 'kitchen_partner', 'restaurant', 'customer'];
          for (const r of rolePriority) {
            if (roleRows.some((row: any) => row.role === r)) {
              verifiedRole = r;
              break;
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch user role:', e);
      }
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    // Look up user profile using the AUTHENTICATED user's ID only
    let userInfo: { email?: string; phone?: string; name?: string } | undefined;
    try {
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (authenticatedUserId && supabaseUrl && SUPABASE_SERVICE_ROLE_KEY) {
        const profileRes = await fetch(
          `${supabaseUrl}/rest/v1/profiles?id=eq.${authenticatedUserId}&select=email,phone,full_name`,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
          }
        );
        if (profileRes.ok) {
          const profiles = await profileRes.json();
          if (profiles.length > 0) {
            userInfo = { email: profiles[0].email, phone: profiles[0].phone, name: profiles[0].full_name };
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch user profile:', e);
    }
    if (!userInfo && userEmail) {
      userInfo = { email: userEmail };
    }

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing chat request for role:', verifiedRole, 'authenticated:', !!authenticatedUserId);

    const systemPrompt = KNOWLEDGE_BASE[verifiedRole as keyof typeof KNOWLEDGE_BASE] || KNOWLEDGE_BASE.customer;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt + '\n\nVIKTIGT: Håll svar korta och koncisa. Max 2-3 meningar om möjligt.' },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 400
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'För många förfrågningar. Försök igen!', retryAfter: 60 }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI otillgänglig. Ring 0734234686!' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    let aiMessage = data.choices[0]?.message?.content || 'Ring 0734234686 för hjälp!';

    // Check if AI flagged this as needing human help
    const needsHuman = aiMessage.includes('[NEEDS_HUMAN]');
    if (needsHuman) {
      aiMessage = aiMessage.replace('[NEEDS_HUMAN]', '').trim();
      // Send email notification in the background (don't block response)
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      sendEscalationEmail(lastUserMsg, aiMessage, verifiedRole, messages, userInfo).catch(console.error);
    }

    console.log('AI response generated successfully, needsHuman:', needsHuman);

    return new Response(
      JSON.stringify({ message: aiMessage, needsHuman }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Fel uppstod. Ring 0734234686!',
        message: 'Tekniskt fel. Ring 0734234686 (vardagar 09-18) så hjälper vi dig!'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
