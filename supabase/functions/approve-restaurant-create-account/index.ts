import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

interface ApproveRestaurantRequest {
  restaurantId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { restaurantId }: ApproveRestaurantRequest = await req.json();
    console.log("Approving restaurant with ID:", restaurantId);

    // Get restaurant details
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      console.error("Restaurant not found:", restaurantError);
      throw new Error("Restaurang inte hittad");
    }

    console.log("Restaurant found:", restaurant.business_name);

    // Generate @homechef.se email
    const businessNameSlug = restaurant.business_name
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 20) || "restaurant";
    const homechefEmail = `${businessNameSlug}@homechef.se`;
    
    console.log("Generated email:", homechefEmail);

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === homechefEmail);
    
    let userId: string;
    let password = generatePassword();
    console.log("Password generated");

    if (existingUser) {
      console.log("User already exists, using existing ID:", existingUser.id);
      userId = existingUser.id;
      
      const { error: updatePasswordError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: password }
      );
      
      if (updatePasswordError) {
        console.error("Password update error:", updatePasswordError);
      } else {
        console.log("Password updated for existing user");
      }
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: homechefEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: restaurant.full_name,
          role: "restaurant",
        },
      });

      if (authError) {
        console.error("Auth user creation error:", authError);
        throw new Error(`Kunde inte skapa användare: ${authError.message}`);
      }

      console.log("Auth user created:", authData.user.id);
      userId = authData.user.id;
    }

    // Update restaurant record
    const { error: updateError } = await supabase
      .from("restaurants")
      .update({
        user_id: userId,
        application_status: "approved",
        approved: true,
      })
      .eq("id", restaurantId);

    if (updateError) {
      console.error("Restaurant update error:", updateError);
      throw new Error("Kunde inte uppdatera restaurang-profil");
    }

    console.log("Restaurant record updated");

    // Create or update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email: homechefEmail,
        full_name: restaurant.full_name,
        role: "restaurant",
        phone: restaurant.phone,
        address: restaurant.address,
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
    }

    // Add restaurant role
    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert({
        user_id: userId,
        role: "restaurant",
      }, {
        onConflict: 'user_id,role'
      });

    if (roleError) {
      console.error("Role assignment error:", roleError);
    }

    console.log("Profile and role created");

    // Send welcome email
    try {
      const { data: emailResponse, error: emailError } = await resend.emails.send({
        from: "Homechef <onboarding@resend.dev>",
        to: [restaurant.contact_email],
        subject: "Välkommen till Homechef! 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #F97316;">Grattis! Din ansökan har godkänts</h1>
            <p>Hej ${restaurant.full_name}!</p>
            <p>Vi är glada att kunna berätta att <strong>${restaurant.business_name}</strong> nu är godkänd som Homechef-restaurang!</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Dina inloggningsuppgifter:</h2>
              <p><strong>Email:</strong> ${homechefEmail}</p>
              <p><strong>Lösenord:</strong> ${password}</p>
            </div>

            <p><strong>Viktigt:</strong> Ändra ditt lösenord direkt efter första inloggningen!</p>
            
            <h3>Nästa steg:</h3>
            <ol>
              <li>Logga in på din dashboard</li>
              <li>Lägg upp dina första rätter</li>
              <li>Börja ta emot beställningar!</li>
            </ol>

            <p>Lycka till!</p>
            <p>Homechef-teamet</p>
          </div>
        `,
      });

      if (emailError) {
        console.error("Email sending error:", emailError);
        throw new Error("Kunde inte skicka välkomstmejl");
      }

      console.log("Email sent successfully:", emailResponse);
    } catch (emailErr) {
      console.error("Error sending email:", emailErr);
      throw new Error("Kunde inte skicka välkomstmejl");
    }

    return new Response(
      JSON.stringify({ 
        message: "Restaurant approved successfully",
        email: homechefEmail
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in approve-restaurant-create-account:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Ett fel uppstod" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

function generatePassword(): string {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

serve(handler);