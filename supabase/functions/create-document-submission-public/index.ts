import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface PublicDocumentSubmissionBody {
  chefId?: string;
  restaurantId?: string;
  documentType?: string;
  documentUrl?: string;
  municipality?: string;
  permitNumber?: string | null;
}

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: PublicDocumentSubmissionBody = await req.json();

    const chefId = normalizeText(body.chefId) || null;
    const restaurantId = normalizeText(body.restaurantId) || null;
    const documentType = normalizeText(body.documentType) || "municipal_permit";
    const documentUrl = normalizeText(body.documentUrl);
    const municipality = normalizeText(body.municipality);
    const permitNumber = normalizeText(body.permitNumber);

    if (!documentUrl || !municipality || (!chefId && !restaurantId) || (chefId && restaurantId)) {
      return json({ success: false, message: "Ogiltig dokumentdata." });
    }

    // Restrict documentUrl to the project's Supabase storage domain to prevent
    // attackers from polluting the admin queue with arbitrary external URLs.
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    let allowedHost = "";
    try {
      allowedHost = new URL(supabaseUrl).host;
    } catch {
      allowedHost = "";
    }
    try {
      const docHost = new URL(documentUrl).host;
      if (!allowedHost || docHost !== allowedHost) {
        return json({ success: false, message: "Ogiltig dokumentlänk." });
      }
    } catch {
      return json({ success: false, message: "Ogiltig dokumentlänk." });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    if (chefId) {
      const { data: chef, error: chefError } = await supabase
        .from("chefs")
        .select("id, user_id")
        .eq("id", chefId)
        .maybeSingle();

      if (chefError) {
        throw chefError;
      }

      if (!chef || chef.user_id) {
        return json({ success: false, message: "Kockansökan kunde inte hittas." });
      }
    }

    if (restaurantId) {
      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("id, user_id")
        .eq("id", restaurantId)
        .maybeSingle();

      if (restaurantError) {
        throw restaurantError;
      }

      if (!restaurant || restaurant.user_id) {
        return json({ success: false, message: "Restaurangansökan kunde inte hittas." });
      }
    }

    const ownerId = chefId ?? restaurantId;

    const { error: insertError } = await supabase
      .from("document_submissions")
      .insert({
        user_id: ownerId,
        chef_id: chefId,
        restaurant_id: restaurantId,
        document_type: documentType,
        document_url: documentUrl,
        municipality,
        permit_number: permitNumber || null,
        status: "pending",
      });

    if (insertError) {
      throw insertError;
    }

    return json({ success: true });
  } catch (error) {
    console.error("create-document-submission-public error:", error);
    return json({ success: false, message: "Kunde inte spara dokumentet just nu." }, 500);
  }
});
