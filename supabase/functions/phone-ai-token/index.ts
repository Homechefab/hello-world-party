import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const getSignedUrl = async (agentId: string, apiKey: string) => {
  const endpoints = [
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${encodeURIComponent(agentId)}`,
  ];

  let lastStatus = 500;
  let lastErrorText = "Unknown ElevenLabs error";

  for (const url of endpoints) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (response.ok) {
      const result = await response.json();
      const signedUrl = result?.signed_url ?? result?.signedUrl;

      if (!signedUrl) {
        throw new Error("ElevenLabs response missing signed URL");
      }

      return signedUrl;
    }

    lastStatus = response.status;
    lastErrorText = await response.text();
    console.error("ElevenLabs signed URL request failed:", { url, status: lastStatus, body: lastErrorText });

    if (response.status !== 404) {
      break;
    }
  }

  throw new Error(`ElevenLabs API error: ${lastStatus} ${lastErrorText}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      console.error("ELEVENLABS_API_KEY is not configured");
      throw new Error("ElevenLabs API key is not configured");
    }

    const { agentId } = await req.json().catch(() => ({}));
    const targetAgentId = agentId || Deno.env.get("ELEVENLABS_AGENT_ID");

    if (!targetAgentId) {
      return new Response(
        JSON.stringify({
          error: "No ElevenLabs agent configured",
          message: "Du behöver skapa en agent i ElevenLabs och lägga till ELEVENLABS_AGENT_ID",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Generating ElevenLabs signed URL...", { agentId: targetAgentId });

    const signedUrl = await getSignedUrl(targetAgentId, ELEVENLABS_API_KEY);

    return new Response(
      JSON.stringify({
        signedUrl,
        agentId: targetAgentId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in phone-ai-token function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate token",
        message: "Kunde inte starta röstsamtal. Försök igen senare.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
