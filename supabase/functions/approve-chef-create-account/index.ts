import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

interface ApproveChefRequest {
  chefId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Create client with anon key to verify user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error("Invalid authentication:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Verify admin role using has_role function
    const { data: isAdmin, error: roleError } = await supabaseClient
      .rpc("has_role", { _user_id: user.id, _role: "admin" });

    if (roleError || !isAdmin) {
      console.error("Admin role check failed:", roleError, "isAdmin:", isAdmin);
      return new Response(
        JSON.stringify({ error: "Admin privileges required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Admin verified:", user.email);

    // 4. Now proceed with service role operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { chefId }: ApproveChefRequest = await req.json();
    console.log("Approving chef with ID:", chefId);

    // Get chef details
    const { data: chef, error: chefError } = await supabase
      .from("chefs")
      .select("*")
      .eq("id", chefId)
      .single();

    if (chefError || !chef) {
      console.error("Chef not found:", chefError);
      throw new Error("Chef inte hittad");
    }

    console.log("Chef found:", chef.full_name);

    // Always create a new @homechef.se account for approved chefs
    // Generate @homechef.se email with unique suffix if needed
    const nameParts = chef.full_name?.toLowerCase().split(" ") || [];
    const firstName = nameParts[0] || "chef";
    const lastName = nameParts[nameParts.length - 1] || "unknown";
    let baseEmail = `${firstName}.${lastName}`.replace(/[^a-z.]/g, "");
    
    // Check if user already exists and find unique email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    let homechefEmail = `${baseEmail}@homechef.se`;
    let counter = 1;
    
    // Check if email is already taken by another user linked to a different chef
    while (true) {
      const existingUser = existingUsers?.users.find(u => u.email === homechefEmail);
      if (!existingUser) {
        // Email is free, use it
        break;
      }
      
      // Check if this user is already linked to another chef
      const { data: linkedChef } = await supabase
        .from("chefs")
        .select("id")
        .eq("user_id", existingUser.id)
        .maybeSingle();
      
      if (linkedChef && linkedChef.id !== chefId) {
        // User is linked to another chef, generate unique email
        counter++;
        homechefEmail = `${baseEmail}${counter}@homechef.se`;
        console.log("Email taken, trying:", homechefEmail);
      } else {
        // User exists but not linked to any chef, or linked to this chef - can reuse
        break;
      }
    }
    
    console.log("Generated email:", homechefEmail);

    const existingUser = existingUsers?.users.find(u => u.email === homechefEmail);
    let userId: string;
    let password = generatePassword();
    console.log("Password generated");

    if (existingUser) {
      // User already exists, use existing user_id
      console.log("User already exists, using existing ID:", existingUser.id);
      userId = existingUser.id;
      
      // Update password for existing user
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
      // Create new auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: homechefEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: chef.full_name,
          role: "chef",
        },
      });

      if (authError) {
        console.error("Auth user creation error:", authError);
        throw new Error(`Kunde inte skapa användare: ${authError.message}`);
      }

      console.log("Auth user created:", authData.user.id);
      userId = authData.user.id;
    }

    // Update chef record with user_id
    const { error: updateError } = await supabase
      .from("chefs")
      .update({
        user_id: userId,
        application_status: "approved",
        kitchen_approved: true,
        municipality_approval_date: new Date().toISOString(),
      })
      .eq("id", chefId);

    if (updateError) {
      console.error("Chef update error:", updateError);
      throw new Error("Kunde inte uppdatera kock-profil");
    }

    console.log("Chef record updated");

    // Create or update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email: homechefEmail,
        full_name: chef.full_name,
        role: "chef",
        phone: chef.phone,
        address: chef.address,
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Continue even if profile creation fails
    }

    // Add chef role (use upsert to avoid duplicate key errors)
    const { error: roleInsertError } = await supabase
      .from("user_roles")
      .upsert({
        user_id: userId,
        role: "chef",
      }, {
        onConflict: 'user_id,role'
      });

    if (roleInsertError) {
      console.error("Role assignment error:", roleInsertError);
      // Continue even if role assignment fails
    }

    console.log("Profile and role created");

    // Try to send welcome email (but don't fail if it doesn't work)
    let emailSent = false;
    try {
      const emailHtml = generateWelcomeEmail(chef.full_name, homechefEmail, password);
      
      const { error: emailError } = await resend.emails.send({
        from: "Homechef <onboarding@resend.dev>",
        to: [chef.contact_email],
        subject: "Välkommen till Homechef! Dina inloggningsuppgifter",
        html: emailHtml,
      });

      if (emailError) {
        console.error("Email sending error (non-fatal):", emailError);
      } else {
        emailSent = true;
        console.log("Welcome email sent to:", chef.contact_email);
      }
    } catch (emailErr) {
      console.error("Email sending exception (non-fatal):", emailErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        email: homechefEmail,
        emailSent: emailSent,
        message: emailSent 
          ? "Kock godkänd och välkomstmejl skickat" 
          : "Kock godkänd! OBS: Mejlet kunde inte skickas. Kontakta kocken direkt för att återställa lösenordet.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in approve-chef-create-account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

function generatePassword(): string {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

function generateWelcomeEmail(fullName: string, email: string, password: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
        }
        .credentials {
          background: #f5f5f5;
          border-left: 4px solid #ff6b35;
          padding: 20px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .credential-row {
          margin: 10px 0;
        }
        .label {
          font-weight: bold;
          color: #666;
        }
        .value {
          color: #333;
          font-size: 16px;
          font-family: monospace;
          background: white;
          padding: 8px 12px;
          border-radius: 4px;
          display: inline-block;
          margin-left: 10px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          color: #666;
          font-size: 14px;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Välkommen till Homechef!</h1>
      </div>
      
      <div class="content">
        <h2>Hej ${fullName}!</h2>
        
        <p>Grattis! Din ansökan om att bli kock hos Homechef har godkänts. Vi är glada att ha dig med oss!</p>
        
        <p>Ett konto har skapats åt dig med följande inloggningsuppgifter:</p>
        
        <div class="credentials">
          <div class="credential-row">
            <span class="label">Email:</span>
            <span class="value">${email}</span>
          </div>
          <div class="credential-row">
            <span class="label">Lösenord:</span>
            <span class="value">${password}</span>
          </div>
        </div>
        
        <div class="warning">
          <strong>⚠️ Viktigt:</strong> Byt ditt lösenord efter första inloggningen för säkerhetens skull.
        </div>
        
        <p>Du kan nu logga in på din profil och börja lägga upp rätter, hantera beställningar och mycket mer.</p>
        
        <center>
          <a href="https://211e56d1-e9f5-433c-89dc-4ce2d7998096.lovableproject.com/chef/welcome" class="button">
            Kom igång med guiden
          </a>
        </center>
        
        <p style="margin-top: 20px; text-align: center;">
          Eller gå direkt till 
          <a href="https://211e56d1-e9f5-433c-89dc-4ce2d7998096.lovableproject.com/" style="color: #ff6b35;">
            din dashboard
          </a>
        </p>
        
        <p>Om du har några frågor eller behöver hjälp, tveka inte att kontakta oss.</p>
        
        <p>Lycka till med din kokkärriär på Homechef!</p>
        
        <p>Med vänliga hälsningar,<br><strong>Homechef-teamet</strong></p>
      </div>
      
      <div class="footer">
        <p>Detta är ett automatiskt genererat mejl. Svara inte på detta meddelande.</p>
        <p>© ${new Date().getFullYear()} Homechef. Alla rättigheter förbehållna.</p>
      </div>
    </body>
    </html>
  `;
}

function generateApprovalNotificationEmail(fullName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Grattis!</h1>
      </div>
      
      <div class="content">
        <h2>Hej ${fullName}!</h2>
        
        <p>Din ansökan om att bli kock hos Homechef har godkänts! Vi är glada att ha dig med oss.</p>
        
        <p>Du kan nu logga in med ditt befintliga konto och börja lägga upp rätter, hantera beställningar och mycket mer.</p>
        
        <center>
          <a href="https://211e56d1-e9f5-433c-89dc-4ce2d7998096.lovableproject.com/chef/welcome" class="button">
            Kom igång med guiden
          </a>
        </center>
        
        <p>Om du har några frågor eller behöver hjälp, tveka inte att kontakta oss.</p>
        
        <p>Lycka till med din kokkärriär på Homechef!</p>
        
        <p>Med vänliga hälsningar,<br><strong>Homechef-teamet</strong></p>
      </div>
      
      <div class="footer">
        <p>Detta är ett automatiskt genererat mejl. Svara inte på detta meddelande.</p>
        <p>© ${new Date().getFullYear()} Homechef. Alla rättigheter förbehållna.</p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
