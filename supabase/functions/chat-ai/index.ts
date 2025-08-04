import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    // Simple AI responses for Homechef support
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
    
    let response = ''
    
    if (userMessage.includes('beställ') || userMessage.includes('order') || userMessage.includes('mat')) {
      response = 'För att beställa mat går du till vår hemsida och klickar på "Beställ mat". Där kan du söka bland lokala kockar och deras rätter. Har du problem med din beställning kan du ringa oss på 0734234686!'
    } else if (userMessage.includes('kock') || userMessage.includes('chef') || userMessage.includes('sälja')) {
      response = 'Som kock på Homechef kan du sälja din hemlagade mat! Gå till "Sälja mat" för att registrera dig som kock. Vi har strikta hygienregler för att säkerställa kvalitet. Har du frågor om att bli kock? Ring 0734234686!'
    } else if (userMessage.includes('kök') || userMessage.includes('hyra') || userMessage.includes('kitchen')) {
      response = 'Du kan hyra professionella kök genom vår plattform! Perfekt för catering, events eller större matlagning. Gå till "Hyra kök" för att se tillgängliga alternativ. För mer info, ring 0734234686!'
    } else if (userMessage.includes('privatkock') || userMessage.includes('private chef') || userMessage.includes('event')) {
      response = 'Vi erbjuder privatkockar för events, middagar och speciella tillfällen! Gå till "Privatkock" för att se våra duktiga kockar och boka. Ring 0734234686 för personlig rådgivning!'
    } else if (userMessage.includes('upplevelse') || userMessage.includes('experience') || userMessage.includes('matlagning')) {
      response = 'Våra matlagningsupplevelser är perfekta för teambuilding, dejter eller bara för kul! Du får laga mat tillsammans med professionella kockar. Boka under "Upplevelser". Frågor? Ring 0734234686!'
    } else if (userMessage.includes('betala') || userMessage.includes('betalning') || userMessage.includes('payment') || userMessage.includes('klarna')) {
      response = 'Vi använder säkra betalningar via Klarna. Du kan betala med kort, banköverföring eller delbetalning. All betalning sker säkert och krypterat. Problem med betalning? Ring 0734234686!'
    } else if (userMessage.includes('problem') || userMessage.includes('hjälp') || userMessage.includes('support')) {
      response = 'Vi hjälper gärna till! För snabb hjälp ring oss på 0734234686 (vardagar 08:00-17:00). Du kan också maila oss eller använda denna chat. Vad behöver du hjälp med specifikt?'
    } else if (userMessage.includes('hej') || userMessage.includes('hello') || userMessage.includes('hallå')) {
      response = 'Hej och välkommen till Homechef! 🍽️ Jag hjälper dig gärna med frågor om våra tjänster - beställa mat, bli kock, hyra kök eller boka privatkock. Vad kan jag hjälpa dig med idag?'
    } else if (userMessage.includes('tack') || userMessage.includes('thanks')) {
      response = 'Så kul att jag kunde hjälpa! Om du har fler frågor är jag här. Du kan också alltid ringa oss på 0734234686 för direkt hjälp. Ha en fantastisk dag! 😊'
    } else {
      response = 'Tack för din fråga! Jag hjälper dig gärna med information om Homechef - beställa mat, bli kock, hyra kök, boka privatkock eller matlagningsupplevelser. För specifik hjälp kan du ringa oss på 0734234686 (vardagar 08:00-17:00). Vad behöver du veta mer om?'
    }

    return new Response(
      JSON.stringify({ message: response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})