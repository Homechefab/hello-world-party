import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BusinessConfirmationRequest {
  businessName: string;
  contactName: string;
  contactEmail: string;
  businessType: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-business-confirmation function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessName, contactName, contactEmail, businessType }: BusinessConfirmationRequest = await req.json();

    console.log(`Sending confirmation email to ${contactEmail} for business: ${businessName}`);

    // Validate required fields
    if (!contactEmail || !businessName || !contactName) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const businessTypeLabels: Record<string, string> = {
      catering: "Cateringföretag",
      food_truck: "Food truck",
      meal_prep: "Måltidslådor / Meal prep",
      bakery: "Bageri / Konditori",
      deli: "Delikatessbutik",
      restaurant: "Restaurang",
      other: "Annat"
    };

    const businessTypeLabel = businessTypeLabels[businessType] || businessType;

    const emailResponse = await resend.emails.send({
      from: "Homechef <onboarding@resend.dev>",
      to: [contactEmail],
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
              <p>Hej <strong>${contactName}</strong>,</p>
              
              <p>Vi har tagit emot din ansökan om att bli företagspartner på Homechef. Vi är glada att ni vill vara en del av Sveriges första marknadsplats för hemlagad och lokalt producerad mat!</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #F97316;">Din ansökan</h3>
                <div class="info-row">
                  <span class="info-label">Företagsnamn:</span>
                  <span class="info-value">${businessName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Verksamhetstyp:</span>
                  <span class="info-value">${businessTypeLabel}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Kontaktperson:</span>
                  <span class="info-value">${contactName}</span>
                </div>
              </div>
              
              <h3>Vad händer nu?</h3>
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-text"><strong>Granskning</strong> - Vi verifierar era uppgifter och kontrollerar ert företag (2-3 arbetsdagar)</div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-text"><strong>Bekräftelse</strong> - Ni får ett e-postmeddelande med besked om er ansökan</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-text"><strong>Kom igång</strong> - Vid godkännande hjälper vi er att börja sälja på plattformen</div>
                </div>
              </div>
              
              <p>Har ni frågor under tiden? Kontakta oss gärna på <a href="mailto:info@homechef.nu" style="color: #F97316;">info@homechef.nu</a></p>
              
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

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-business-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
