import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify admin role
    const { data: isAdmin } = await supabaseClient
      .rpc("has_role", { _user_id: user.id, _role: "admin" });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Parse request
    const { email, password, fullName, platform } = await req.json();

    if (!email || !password || !fullName || !platform) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, password, fullName, platform" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Create account with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Create auth user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "customer" }
    });

    if (createError) {
      return new Response(
        JSON.stringify({ error: `Failed to create user: ${createError.message}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = newUser.user.id;

    // 4. Update profile
    await supabaseAdmin.from("profiles").update({
      full_name: fullName,
      phone: "+46700000000",
      address: `${platform} Review, Stockholm`,
      municipality_approved: true,
      onboarding_completed: true,
    }).eq("id", userId);

    // 5. Add all roles
    const roles = ["customer", "chef", "kitchen_partner", "restaurant"];
    for (const role of roles) {
      await supabaseAdmin.from("user_roles").insert({
        user_id: userId,
        role,
      });
    }

    // 6. Create chef profile (approved)
    const { data: chefData } = await supabaseAdmin.from("chefs").insert({
      user_id: userId,
      business_name: `${platform} Review Kitchen`,
      full_name: fullName,
      kitchen_approved: true,
      application_status: "approved",
      municipality_approval_date: new Date().toISOString(),
      contact_email: email,
      phone: "+46700000000",
      city: "Stockholm",
    }).select().single();

    // 7. Create kitchen partner profile (approved)
    await supabaseAdmin.from("kitchen_partners").insert({
      user_id: userId,
      business_name: `${platform} Review Kitchen Partner`,
      address: "Review Street 1, Stockholm",
      approved: true,
      application_status: "approved",
    });

    // 8. Create restaurant profile (approved)
    await supabaseAdmin.from("restaurants").insert({
      user_id: userId,
      business_name: `${platform} Review Restaurant`,
      full_name: fullName,
      approved: true,
      application_status: "approved",
      contact_email: email,
      phone: "+46700000000",
      city: "Stockholm",
    });

    // 9. Create sample dishes if chef was created
    if (chefData) {
      await supabaseAdmin.from("dishes").insert([
        {
          chef_id: chefData.id,
          name: "Köttbullar med lingon",
          description: "Klassiska svenska köttbullar med lingonsylt och potatismos",
          price: 149,
          category: "Huvudrätt",
          ingredients: ["nötfärs", "ströbröd", "grädde", "lök", "lingon"],
          allergens: ["gluten", "mjölk"],
          preparation_time: 45,
          available: true,
        },
        {
          chef_id: chefData.id,
          name: "Laxfilé med dillsås",
          description: "Ugnsbakad lax med krämig dillsås och kokt potatis",
          price: 179,
          category: "Huvudrätt",
          ingredients: ["lax", "dill", "grädde", "potatis", "citron"],
          allergens: ["fisk", "mjölk"],
          preparation_time: 35,
          available: true,
        },
      ]);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${platform} review account created successfully`,
        userId,
        email,
        credentials: { email, password },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error creating review account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
