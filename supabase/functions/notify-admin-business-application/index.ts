import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BusinessNotificationRequest {
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  organizationNumber: string;
  city: string;
  hasDocument: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("notify-admin-business-application function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: BusinessNotificationRequest = await req.json();

    console.log(`Notifying admin about new business application: ${data.businessName}`);

    const businessTypeLabels: Record<string, string> = {
      catering: "Cateringföretag",
      food_truck: "Food truck",
      meal_prep: "Måltidslådor / Meal prep",
      bakery: "Bageri / Konditori",
      deli: "Delikatessbutik",
      restaurant: "Restaurang",
      other: "Annat"
    };

    const businessTypeLabel = businessTypeLabels[data.businessType] || data.businessType;

    const emailResponse = await resend.emails.send({
      from: "Homechef System <onboarding@resend.dev>",
      to: ["info@homechef.nu"],
      subject: `🏢 Ny företagsansökan: ${data.businessName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; padding: 25px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 22px; }
            .content { background: #f9fafb; padding: 25px; border-radius: 0 0 12px 12px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .info-row { padding: 8px 0; border-bottom: 1px solid #eee; }
            .info-row:last-child { border-bottom: none; }
            .info-label { font-weight: 600; color: #666; display: inline-block; width: 150px; }
            .info-value { color: #333; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .badge-success { background: #dcfce7; color: #166534; }
            .badge-warning { background: #fef3c7; color: #92400e; }
            .cta { text-align: center; margin-top: 20px; }
            .cta a { background: #F97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏢 Ny företagsansökan</h1>
            </div>
            <div class="content">
              <p>En ny företagsansökan har inkommit och väntar på granskning.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #F97316;">Företagsinformation</h3>
                <div class="info-row">
                  <span class="info-label">Företagsnamn:</span>
                  <span class="info-value"><strong>${data.businessName}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Org.nummer:</span>
                  <span class="info-value">${data.organizationNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Verksamhetstyp:</span>
                  <span class="info-value">${businessTypeLabel}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Ort:</span>
                  <span class="info-value">${data.city}</span>
                </div>
              </div>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #F97316;">Kontaktuppgifter</h3>
                <div class="info-row">
                  <span class="info-label">Kontaktperson:</span>
                  <span class="info-value">${data.contactName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">E-post:</span>
                  <span class="info-value"><a href="mailto:${data.contactEmail}">${data.contactEmail}</a></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Telefon:</span>
                  <span class="info-value">${data.contactPhone}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Dokument:</span>
                  <span class="info-value">
                    ${data.hasDocument 
                      ? '<span class="badge badge-success">✓ Bifogat</span>' 
                      : '<span class="badge badge-warning">Ej bifogat</span>'}
                  </span>
                </div>
              </div>
              
              <div class="cta">
                <a href="https://homechef.nu/admin">Granska ansökan</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending admin notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
