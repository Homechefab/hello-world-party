import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  chef_id: string;
  chef_name: string;
  chef_postal_code: string;
  chef_city?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chef_id, chef_name, chef_postal_code, chef_city }: NotifyRequest = await req.json();

    console.log(`Notifying users about new chef: ${chef_name} in ${chef_postal_code}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get postal code prefix (first 3 digits) for matching
    const postalPrefix = chef_postal_code.replace(/\s/g, '').substring(0, 3);

    // Find all early access signups in the same postal area
    const { data: signups, error: signupsError } = await supabase
      .from("early_access_signups")
      .select("email, postal_code");

    if (signupsError) {
      throw signupsError;
    }

    // Filter signups that match the postal code area
    const matchingSignups = signups?.filter(signup => {
      const signupPrefix = signup.postal_code.replace(/\s/g, '').substring(0, 3);
      return signupPrefix === postalPrefix;
    }) || [];

    console.log(`Found ${matchingSignups.length} users to notify in area ${postalPrefix}xx`);

    if (matchingSignups.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users to notify in this area", count: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send emails to all matching users
    const emailPromises = matchingSignups.map(async (signup) => {
      try {
        const result = await resend.emails.send({
          from: "HomeChef <noreply@resend.dev>",
          to: [signup.email],
          subject: "🎉 En ny kock har registrerat sig i ditt område!",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">HomeChef</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h2 style="color: #18181b; margin: 0 0 16px 0;">Goda nyheter! 🎉</h2>
                  <p style="color: #52525b; line-height: 1.6; margin: 0 0 16px 0;">
                    En ny hemkock har precis registrerat sig i ditt område!
                  </p>
                  <div style="background: #fef3c7; border-left: 4px solid #f97316; padding: 16px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e;">
                      <strong>${chef_name}</strong><br>
                      ${chef_city ? `📍 ${chef_city}` : `📍 Område: ${postalPrefix}xx`}
                    </p>
                  </div>
                  <p style="color: #52525b; line-height: 1.6; margin: 0 0 24px 0;">
                    Du var bland de första att anmäla intresse för hemlagad mat i ditt område. Nu kan du börja utforska rätter från lokala hemkockar!
                  </p>
                  <a href="https://rkucenozpmaixfphpiub.lovableproject.com" style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    Utforska maten nu
                  </a>
                  <p style="color: #a1a1aa; font-size: 12px; margin: 24px 0 0 0;">
                    Du får detta mail för att du anmälde intresse för HomeChef. 
                    <a href="#" style="color: #a1a1aa;">Avregistrera</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        console.log(`Email sent to ${signup.email}:`, result);
        return { email: signup.email, success: true };
      } catch (error) {
        console.error(`Failed to send email to ${signup.email}:`, error);
        return { email: signup.email, success: false, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;

    console.log(`Sent ${successCount}/${matchingSignups.length} emails successfully`);

    return new Response(
      JSON.stringify({ 
        message: `Notified ${successCount} users`, 
        count: successCount,
        results 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in notify-early-access function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
