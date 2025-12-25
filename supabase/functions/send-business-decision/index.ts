import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BusinessDecisionRequest {
  businessName: string;
  contactName: string;
  contactEmail: string;
  decision: "approved" | "rejected";
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-business-decision function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: BusinessDecisionRequest = await req.json();

    console.log(`Sending decision email to ${data.contactEmail}: ${data.decision}`);

    if (!data.contactEmail || !data.businessName || !data.contactName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let subject: string;
    let htmlContent: string;

    if (data.decision === "approved") {
      subject = "🎉 Grattis! Er ansökan har godkänts – Homechef";
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .success-box { background: #dcfce7; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .success-box h2 { color: #166534; margin: 0 0 10px 0; }
            .steps { margin: 25px 0; }
            .step { display: flex; align-items: flex-start; margin-bottom: 15px; }
            .step-number { background: #F97316; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
            .step-text { padding-top: 3px; }
            .cta { text-align: center; margin: 25px 0; }
            .cta a { background: #F97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Välkommen till Homechef!</h1>
            </div>
            <div class="content">
              <p>Hej <strong>${data.contactName}</strong>,</p>
              
              <div class="success-box">
                <h2>Er ansökan har godkänts!</h2>
                <p style="margin: 0; color: #166534;">${data.businessName} är nu en del av Homechef-familjen.</p>
              </div>
              
              <p>Vi är glada att meddela att er ansökan om att bli företagspartner på Homechef har godkänts. Nu kan ni börja sälja era produkter på Sveriges första marknadsplats för hemlagad och lokalt producerad mat!</p>
              
              <h3>Nästa steg</h3>
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-text"><strong>Logga in</strong> - Logga in på ert konto på Homechef</div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-text"><strong>Skapa er meny</strong> - Lägg till era rätter och produkter</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-text"><strong>Börja sälja</strong> - Aktivera er profil och börja ta emot beställningar</div>
                </div>
              </div>
              
              <div class="cta">
                <a href="https://homechef.nu/auth">Logga in och kom igång</a>
              </div>
              
              <p>Har ni frågor? Kontakta oss på <a href="mailto:info@homechef.nu" style="color: #F97316;">info@homechef.nu</a></p>
              
              <div class="footer">
                <p>Med vänliga hälsningar,<br><strong>Teamet på Homechef</strong></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      subject = "Angående er ansökan – Homechef";
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6b7280; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .info-box { background: #fef3c7; border: 1px solid #fcd34d; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-box h3 { color: #92400e; margin: 0 0 10px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Angående er ansökan</h1>
            </div>
            <div class="content">
              <p>Hej <strong>${data.contactName}</strong>,</p>
              
              <p>Tack för ert intresse att bli företagspartner på Homechef. Efter att ha granskat er ansökan för <strong>${data.businessName}</strong> har vi tyvärr beslutat att inte godkänna den vid detta tillfälle.</p>
              
              ${data.rejectionReason ? `
              <div class="info-box">
                <h3>Anledning</h3>
                <p style="margin: 0;">${data.rejectionReason}</p>
              </div>
              ` : ''}
              
              <p>Om ni anser att det finns information vi missat eller om omständigheterna ändrats är ni välkomna att skicka in en ny ansökan.</p>
              
              <p>Har ni frågor är ni välkomna att kontakta oss på <a href="mailto:info@homechef.nu" style="color: #F97316;">info@homechef.nu</a></p>
              
              <div class="footer">
                <p>Med vänliga hälsningar,<br><strong>Teamet på Homechef</strong></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Homechef <onboarding@resend.dev>",
      to: [data.contactEmail],
      subject,
      html: htmlContent,
    });

    console.log("Decision email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending decision email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
