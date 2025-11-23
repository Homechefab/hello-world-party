import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'chef' | 'kitchen_partner' | 'chef_rejection';
  application_id: string;
  applicant_name: string;
  applicant_email: string;
  business_name?: string;
  rejection_reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, application_id, applicant_name, applicant_email, business_name, rejection_reason }: NotificationRequest = await req.json();

    console.log(`Sending notification for ${type} application:`, application_id);

    // Handle rejection notification
    if (type === 'chef_rejection') {
      const emailResponse = await resend.emails.send({
        from: "HomeChef <onboarding@resend.dev>",
        to: [applicant_email],
        subject: "Angående din kockansökan hos HomeChef",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626; border-radius: 4px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Din kockansökan</h1>
              </div>
              <div class="content">
                <p>Hej ${applicant_name},</p>
                <p>Tack för din intresse för att bli kock hos HomeChef. Efter att ha granskat din ansökan måste vi tyvärr meddela att vi inte kan godkänna den just nu.</p>
                
                <div class="info-box">
                  <p><strong>Anledning:</strong></p>
                  <p>${rejection_reason}</p>
                </div>

                <p>Du är välkommen att skicka in en ny ansökan när du har åtgärdat ovanstående punkter.</p>
                
                <p>Med vänliga hälsningar,<br>HomeChef-teamet</p>

                <div class="footer">
                  <p>Detta är ett automatiskt meddelande från HomeChef-plattformen.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log("Rejection email sent successfully:", emailResponse);

      return new Response(JSON.stringify(emailResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Handle admin notification for new application
    const typeLabel = type === 'chef' ? 'Kock' : 'Kökspartner';
    const dashboardTab = type === 'chef' ? 'chefs' : 'kitchen-partners';
    const dashboardUrl = `https://rkucenozpmaixfphpiub.supabase.co?tab=${dashboardTab}`;

    const emailResponse = await resend.emails.send({
      from: "HomeChef <onboarding@resend.dev>",
      to: ["farhan_javanmiri@hotmail.com"],
      subject: `Ny ${typeLabel}-ansökan från ${applicant_name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #f97316; border-radius: 4px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
            .button { display: inline-block; background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Ny ${typeLabel}-ansökan</h1>
            </div>
            <div class="content">
              <p>Hej Admin,</p>
              <p>En ny ${typeLabel.toLowerCase()}-ansökan har kommit in och väntar på din granskning.</p>
              
              <div class="info-box">
                <div class="info-row">
                  <span class="label">Sökande:</span> ${applicant_name}
                </div>
                <div class="info-row">
                  <span class="label">E-post:</span> ${applicant_email}
                </div>
                <div class="info-row">
                  <span class="label">Företag:</span> ${business_name}
                </div>
                <div class="info-row">
                  <span class="label">Ansöknings-ID:</span> ${application_id}
                </div>
              </div>

              <p>Logga in på adminpanelen för att granska ansökan:</p>
              <a href="${dashboardUrl}" class="button">Granska ansökan</a>

              <div class="footer">
                <p>Detta är ett automatiskt meddelande från HomeChef-plattformen.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-application function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
