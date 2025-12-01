import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  municipality: string;
  hourlyRate: number;
  applicationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      businessName, 
      contactPerson, 
      email, 
      phone, 
      address, 
      municipality,
      hourlyRate,
      applicationId 
    }: NotificationRequest = await req.json();

    console.log("Sending admin notification for kitchen partner application:", applicationId);

    // Send email to admin
    const emailResponse = await resend.emails.send({
      from: "Homechef <onboarding@resend.dev>",
      to: ["admin@homechef.se"], // Change this to actual admin email
      subject: `Ny Kökspartner-ansökan: ${businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff6b35;">Ny Kökspartner-ansökan!</h1>
          <p>En ny ansökan har kommit in från en potentiell kökspartner.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Företagsinformation</h2>
            <p><strong>Företagsnamn:</strong> ${businessName}</p>
            <p><strong>Kontaktperson:</strong> ${contactPerson}</p>
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
            <p><strong>Adress:</strong> ${address}</p>
            <p><strong>Kommun:</strong> ${municipality}</p>
            <p><strong>Timpris:</strong> ${hourlyRate} kr/timme</p>
          </div>

          <div style="margin: 30px 0;">
            <a href="https://homechef.se/admin/dashboard" 
               style="background-color: #ff6b35; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Granska ansökan
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Logga in på admin-panelen för att granska och godkänna eller avslå ansökan.
          </p>
        </div>
      `,
    });

    console.log("Admin notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-kitchen-partner function:", error);
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
