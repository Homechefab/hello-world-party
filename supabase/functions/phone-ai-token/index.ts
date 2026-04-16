import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    console.error("ElevenLabs signed URL request failed:", { url, status: lastStatus });

    if (response.status !== 404) {
      break;
    }
  }

  throw new Error(`ElevenLabs API error: ${lastStatus}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: authHeader ? { headers: { Authorization: authHeader } } : undefined,
    });

    const bearerToken = authHeader?.replace("Bearer ", "").trim();
    const isAnonymousToken = !bearerToken || bearerToken === supabaseAnonKey;

    let userId: string | null = null;
    if (!isAnonymousToken && bearerToken) {
      const { data: userData, error: userError } = await supabase.auth.getUser(bearerToken);
      if (userError || !userData?.user) {
        console.error("Auth verification failed:", userError?.message);
      } else {
        userId = userData.user.id;
      }
    }

    // Mandatory auth guard: deny anonymous/unauthenticated callers to prevent
    // abuse of the platform's ElevenLabs API key and quota.
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Authentication required",
          message: "Du måste vara inloggad för att använda röstassistenten.",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // --- Secrets ---
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      console.error("ELEVENLABS_API_KEY is not configured");
      throw new Error("ElevenLabs API key is not configured");
    }

    // Always use server-side agent ID — ignore client-supplied agentId
    const targetAgentId = Deno.env.get("ELEVENLABS_AGENT_ID");
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

    console.log("Generating ElevenLabs signed URL", { authenticated: !!userId, userId });

    const signedUrl = await getSignedUrl(targetAgentId, ELEVENLABS_API_KEY);

    return new Response(
      JSON.stringify({ signedUrl, agentId: targetAgentId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in phone-ai-token function:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate token",
        message: "Kunde inte starta röstsamtal. Försök igen senare.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
