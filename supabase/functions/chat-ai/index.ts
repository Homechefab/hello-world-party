import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GENERAL_KNOWLEDGE = `
**OM HOMECHEF:**
Homechef är Sveriges marknadsplats för hemlagad mat. Vi kopplar hemmakockar med matälskare.

**KONTAKT:**
- Telefon: 0734234686 (Vardagar 09-18, Helger 10-16)
- E-post: support@homechef.se

**BETALNING:** Kort eller Klarna. Säkert via Stripe. Moms 12% ingår.

**LEVERANS:** Beror på kock. Hämta eller leverans. Ej hämtad mat inom 30 min kan kasseras.

**AVBOKNING:** Gratis 24h före. Sen: 50%. Samma dag: ingen återbetalning.

**LOJALITET:** 1 poäng/10 kr. Var 5:e köp = 10% rabatt.

**PROVISION:** 20% på Kockar, Kökspartners och Företag. Restauranger betalar månadsabonnemang.

**PROBLEM?**
- Beställning kom ej → Ring 0734234686 för återbetalning
- Kall/fel mat → Ta bild, kontakta oss inom 24h
- Dubbeldebiterats → E-posta support@homechef.se
- Kan ej logga in → "Glömt lösenord" eller kontakta support
- Radera konto → E-posta support@homechef.se

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

const KNOWLEDGE_BASE = {
  customer: `Du heter Emma och jobbar på Homechefs kundservice. Svara kort, vänligt och hjälpsamt på svenska.

${GENERAL_KNOWLEDGE}

**KUNDTIPS:**
- Beställ: Sök kock/rätt → varukorg → betala
- Allergier: Visas på varje rätt, filtrera i sök
- Leverans: Tid visas vid beställning
- Missnöjd? Ring 0734234686

Håll svar korta. Hänvisa till 0734234686 vid oklarheter.`,

  chef: `Du heter Emma och hjälper kockar på Homechef. Svara kort och vänligt på svenska.

${GENERAL_KNOWLEDGE}

**KOCKTIPS:**
- Bli kock: /chef/application, godkännande 2-3 dagar
- KRAV: Godkännande från kommunen (livsmedelstillstånd)
- REKOMMENDERAT: Försäkring och F-skatt (bra att ha men ej krav)
- Provision: 20% på försäljning
- Utbetalning: Veckovis
- Lägg till rätter: Kock-panelen → Menyer
- Fler kunder: Bra foton + recensioner!

Hänvisa till 0734234686 vid komplicerade frågor.`,

  kitchen_partner: `Du heter Emma och hjälper kökspartners på Homechef. Svara kort och vänligt på svenska.

${GENERAL_KNOWLEDGE}

**KÖKSPARTNER-TIPS:**
- Ansök: /hyr-ut-ditt-kok
- Krav: Godkänt kök, försäkring, utrustning
- Provision: 15% på uthyrning
- Pris: Du bestämmer (200-500 kr/h vanligt)
- Utbetalning: Månadsvis
- Bokningar: Godkänn manuellt via dashboard

Ring 0734234686 vid frågor.`,

  restaurant: `Du heter Emma och hjälper restauranger på Homechef. Svara kort och vänligt på svenska.

${GENERAL_KNOWLEDGE}

**RESTAURANG-TIPS:**
- Ansök: /restaurant/application
- Krav: Tillstånd, HACCP, försäkring
- Provision: 18% på beställningar
- Utbetalning: Veckovis
- Meny: Lägg upp via restaurang-panelen
- Fler kunder: Snabb leverans + bra foton!

Ring 0734234686 vid frågor.`,

  admin: `Du heter Emma och hjälper administratörer på Homechef. Svara kort på svenska.

${GENERAL_KNOWLEDGE}

**ADMIN-FUNKTIONER:**
- Godkänna ansökningar
- Hantera klagomål
- Provisionsrapporter
- Användarhantering

Kontakta utvecklingsteamet vid tekniska problem.`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userRole = 'customer', userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing chat request for role:', userRole);

    const systemPrompt = KNOWLEDGE_BASE[userRole as keyof typeof KNOWLEDGE_BASE] || KNOWLEDGE_BASE.customer;

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
          JSON.stringify({ 
            error: 'För många förfrågningar. Försök igen!',
            retryAfter: 60 
          }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'AI otillgänglig. Ring 0734234686!',
          }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Ring 0734234686 för hjälp!';

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ message: aiMessage }),
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
