import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const email = "googlereview@homechef.nu";
    const password = "GoogleReview2026!";

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u: any) => u.email === email);

    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Kontot finns redan",
          email, 
          password,
          user_id: existingUser.id 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create user with auto-confirm
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Google Reviewer" },
    });

    if (authError) throw authError;
    const userId = authData.user.id;

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email,
      full_name: "Google Reviewer",
      role: "customer",
    });
    if (profileError) console.error("Profile error:", profileError);

    // Create role
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: "customer",
    });
    if (roleError) console.error("Role error:", roleError);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Testkonto skapat!",
        email,
        password,
        user_id: userId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
