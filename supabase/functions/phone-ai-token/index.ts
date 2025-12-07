import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not configured');
      throw new Error('ElevenLabs API key is not configured');
    }

    console.log('Generating ElevenLabs signed URL...');

    // Get agent ID from request body, or use default
    const { agentId } = await req.json().catch(() => ({}));
    
    // Use provided agent ID or a placeholder - user needs to create an agent in ElevenLabs
    const targetAgentId = agentId || Deno.env.get('ELEVENLABS_AGENT_ID');
    
    if (!targetAgentId) {
      return new Response(
        JSON.stringify({ 
          error: 'No ElevenLabs agent configured',
          message: 'Du behöver skapa en agent i ElevenLabs och lägga till ELEVENLABS_AGENT_ID'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Request a signed URL from ElevenLabs for the conversational agent
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${targetAgentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Signed URL generated successfully');

    return new Response(
      JSON.stringify({ 
        signedUrl: data.signed_url,
        agentId: targetAgentId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in phone-ai-token function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate token',
        message: 'Kunde inte starta röstsamtal. Försök igen senare.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
