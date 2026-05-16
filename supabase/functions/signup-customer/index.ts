import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SignupPayload {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as SignupPayload;
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    const full_name = (body.full_name || "").trim();
    const phone = (body.phone || "").trim();

    if (!email || !password || !full_name || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Lösenordet måste vara minst 6 tecken" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Create user with email pre-confirmed so no verification email is required.
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        phone,
        role: "customer",
      },
    });

    if (error || !data.user) {
      const msg = error?.message || "Kunde inte skapa konto";
      const status = /registered|exists|duplicate/i.test(msg) ? 409 : 400;
      return new Response(
        JSON.stringify({
          error: status === 409 ? "En användare med denna e-post finns redan" : msg,
        }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Persist phone on profile (handle_new_user trigger doesn't read this from metadata)
    await admin.from("profiles").update({ phone }).eq("id", data.user.id);

    return new Response(JSON.stringify({ success: true, user_id: data.user.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Internt fel" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
