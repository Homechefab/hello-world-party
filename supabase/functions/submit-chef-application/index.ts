import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface SubmitChefApplicationBody {
  fullName?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  experience?: string;
  specialties?: string;
  businessName?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const body: SubmitChefApplicationBody = await req.json();

    const fullName = normalizeText(body.fullName);
    const contactEmail = normalizeText(body.contactEmail).toLowerCase();
    const phone = normalizeText(body.phone);
    const address = normalizeText(body.address);
    const city = normalizeText(body.city);
    const postalCode = normalizeText(body.postalCode);
    const experience = normalizeText(body.experience);
    const specialties = normalizeText(body.specialties);
    const businessName = normalizeText(body.businessName) || "Mitt kök";

    if (!fullName || !contactEmail || !phone || !address || !city || !postalCode || !experience || !specialties) {
      return json({ success: false, message: "Alla obligatoriska fält måste fyllas i." });
    }

    if (!emailRegex.test(contactEmail)) {
      return json({ success: false, message: "Ange en giltig e-postadress." });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: existingApplications, error: existingError } = await supabase
      .from("chefs")
      .select("id, application_status")
      .eq("contact_email", contactEmail);

    if (existingError) {
      throw existingError;
    }

    // Block if there is ANY existing application for this email — never delete
    // pre-existing applications (would allow attackers to wipe legitimate ones).
    if ((existingApplications ?? []).length > 0) {
      return json({
        success: false,
        message: "Det finns redan en ansökan för denna e-postadress. Kontakta support om du behöver hjälp.",
      });
    }

    const chefId = crypto.randomUUID();

    const { error: insertError } = await supabase
      .from("chefs")
      .insert({
        id: chefId,
        user_id: null,
        business_name: businessName,
        kitchen_approved: false,
        application_status: "pending",
        full_name: fullName,
        contact_email: contactEmail,
        phone,
        address,
        city,
        postal_code: postalCode,
        experience,
        specialties,
      });

    if (insertError) {
      throw insertError;
    }

    return json({ success: true, chefId });
  } catch (error) {
    console.error("submit-chef-application error:", error);
    return json({ success: false, message: "Kunde inte skapa ansökan just nu." }, 500);
  }
});
