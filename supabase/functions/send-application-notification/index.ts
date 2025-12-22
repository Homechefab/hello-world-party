import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'chef' | 'kitchen_partner' | 'restaurant';
  applicant_name: string;
  applicant_email: string;
  business_name: string;
  phone?: string;
  address?: string;
  city?: string;
  application_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();
    const { type, applicant_name, applicant_email, business_name, phone, address, city, application_id } = data;

    console.log(`Sending notification for ${type} application:`, {
      applicant_name,
      applicant_email,
      business_name,
      application_id
    });

    // Determine application type label in Swedish
    const typeLabels: Record<string, string> = {
      'chef': 'Kock',
      'kitchen_partner': 'Kökspartner',
      'restaurant': 'Restaurang'
    };
    const typeLabel = typeLabels[type] || type;

    // Send email to admin at info@homechef.nu
    const emailResponse = await resend.emails.send({
      from: "Homechef <onboarding@resend.dev>",
      to: ["info@homechef.nu"],
      subject: `Ny ${typeLabel}-ansökan: ${business_name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .info-box { background-color: white; padding: 24px; margin: 20px 0; border-left: 4px solid #f97316; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .info-row { margin: 12px 0; display: flex; }
            .label { font-weight: bold; color: #666; min-width: 120px; }
            .value { color: #333; }
            .badge { display: inline-block; background-color: #f97316; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #e5e5e5; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Ny ${typeLabel}-ansökan!</h1>
            </div>
            <div class="content">
              <p>Hej Admin,</p>
              <p>En ny <strong>${typeLabel.toLowerCase()}-ansökan</strong> har kommit in och väntar på granskning.</p>
              
              <div class="info-box">
                <span class="badge">${typeLabel}</span>
                <div class="info-row">
                  <span class="label">Sökande:</span>
                  <span class="value">${applicant_name}</span>
                </div>
                <div class="info-row">
                  <span class="label">E-post:</span>
                  <span class="value">${applicant_email}</span>
                </div>
                <div class="info-row">
                  <span class="label">Företag:</span>
                  <span class="value">${business_name}</span>
                </div>
                ${phone ? `<div class="info-row"><span class="label">Telefon:</span><span class="value">${phone}</span></div>` : ''}
                ${address ? `<div class="info-row"><span class="label">Adress:</span><span class="value">${address}${city ? `, ${city}` : ''}</span></div>` : ''}
                ${application_id ? `<div class="info-row"><span class="label">Ansöknings-ID:</span><span class="value" style="font-family: monospace; font-size: 12px;">${application_id}</span></div>` : ''}
              </div>

              <p>Logga in på adminpanelen för att granska ansökan:</p>
              <a href="https://homechef.nu/admin/dashboard" class="button">Granska ansökan →</a>

              <div class="footer">
                <p>Detta är ett automatiskt meddelande från HomeChef-plattformen.</p>
                <p>© 2025 Homechef</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-application-notification function:", error);
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
