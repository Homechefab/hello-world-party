import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chefId } = await req.json();

    if (!chefId) {
      throw new Error("Chef ID krävs");
    }

    console.log("Resetting password for chef:", chefId);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get chef details
    const { data: chef, error: chefError } = await supabaseAdmin
      .from("chefs")
      .select("*")
      .eq("id", chefId)
      .single();

    if (chefError || !chef) {
      throw new Error("Kunde inte hitta kocken");
    }

    if (!chef.user_id) {
      throw new Error("Kocken har inget användarkonto");
    }

    // Get user email
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(chef.user_id);

    if (userError || !user) {
      throw new Error("Kunde inte hitta användaren");
    }

    // Generate new password
    const newPassword = generatePassword();
    console.log("New password generated");

    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      chef.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      throw new Error("Kunde inte uppdatera lösenordet");
    }

    console.log("Password updated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        email: user.email,
        password: newPassword,
        chefName: chef.full_name || chef.business_name
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in reset-chef-password:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
