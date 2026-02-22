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

    // 1. Send email to admin at info@homechef.nu
    const adminEmailPromise = resend.emails.send({
      from: "Homechef <info@homechef.nu>",
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

    // 2. Send confirmation email to the applicant
    const applicantEmailPromise = resend.emails.send({
      from: "Homechef <info@homechef.nu>",
      to: [applicant_email],
      subject: "Tack för din ansökan till Homechef!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #F97316, #EA580C); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F97316; }
            .info-row { display: flex; margin-bottom: 10px; }
            .info-label { font-weight: 600; width: 140px; color: #666; }
            .info-value { color: #333; }
            .steps { margin: 20px 0; }
            .step { display: flex; align-items: flex-start; margin-bottom: 15px; }
            .step-number { background: #F97316; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
            .step-text { padding-top: 3px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .footer a { color: #F97316; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Tack för din ansökan!</h1>
            </div>
            <div class="content">
              <p>Hej <strong>${applicant_name}</strong>,</p>
              
              <p>Vi har tagit emot din ansökan om att bli ${typeLabel.toLowerCase()} på Homechef. Vi är glada att du vill vara en del av Sveriges första marknadsplats för hemlagad och lokalt producerad mat!</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #F97316;">Din ansökan</h3>
                <div class="info-row">
                  <span class="info-label">${type === 'chef' ? 'Namn' : 'Företagsnamn'}:</span>
                  <span class="info-value">${business_name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Ansökningstyp:</span>
                  <span class="info-value">${typeLabel}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Kontaktperson:</span>
                  <span class="info-value">${applicant_name}</span>
                </div>
              </div>
              
              <h3>Vad händer nu?</h3>
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-text"><strong>Granskning</strong> - Vi verifierar dina uppgifter och granskar din ansökan (2-3 arbetsdagar)</div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-text"><strong>Bekräftelse</strong> - Du får ett e-postmeddelande med besked om din ansökan</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-text"><strong>Kom igång</strong> - Vid godkännande får du dina inloggningsuppgifter och kan börja använda plattformen</div>
                </div>
              </div>
              
              <p>Har du frågor under tiden? Kontakta oss gärna på <a href="mailto:info@homechef.nu" style="color: #F97316;">info@homechef.nu</a></p>
              
              <div class="footer">
                <p>Med vänliga hälsningar,<br><strong>Teamet på Homechef</strong></p>
                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                  Homechef AB | Kiselvägen 15a, 269 41 Östra Karup<br>
                  Org.nr: 559547-7026
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send both emails in parallel
    const [adminResult, applicantResult] = await Promise.allSettled([adminEmailPromise, applicantEmailPromise]);

    console.log("Admin email result:", adminResult.status === 'fulfilled' ? 'sent' : adminResult.reason);
    console.log("Applicant confirmation email result:", applicantResult.status === 'fulfilled' ? 'sent' : applicantResult.reason);

    return new Response(JSON.stringify({ 
      success: true, 
      adminEmailSent: adminResult.status === 'fulfilled',
      applicantEmailSent: applicantResult.status === 'fulfilled',
    }), {
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
