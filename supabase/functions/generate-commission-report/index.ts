import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId är obligatoriskt" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch transaction from database
    const { data: transaction, error: dbError } = await supabaseClient
      .from("payment_transactions")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (dbError || !transaction) {
      return new Response(
        JSON.stringify({ error: "Transaktion hittades inte i databasen" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Generate PDF using basic PDF structure
    const pdfContent = generatePDF(transaction);

    return new Response(pdfContent, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="provisionsunderlag-${transaction.stripe_session_id}.pdf"`
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error generating report:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function generatePDF(transaction: any): Uint8Array {
  // Basic PDF structure with text content
  const content = `
HOMECHEF AB - PROVISIONSUNDERLAG

Transaktionsdetaljer
--------------------
Transaktions-ID: ${transaction.stripe_session_id}
Datum: ${new Date(transaction.created_at).toLocaleString('sv-SE')}
Kund: ${transaction.customer_email}
Betalningsstatus: ${transaction.payment_status}

Beställning
-----------
Rätt: ${transaction.dish_name}
Antal: ${transaction.quantity} st

Provisionsfördelning
--------------------
Totalt belopp: ${transaction.total_amount.toFixed(2)} ${transaction.currency}
Homechef provision (20%): ${transaction.platform_fee.toFixed(2)} ${transaction.currency}
Kock (80%): ${transaction.chef_earnings.toFixed(2)} ${transaction.currency}

Bokföringsinformation
---------------------
Intäktskonto (Försäljning): ${transaction.total_amount.toFixed(2)} ${transaction.currency}
Homechef provision: ${transaction.platform_fee.toFixed(2)} ${transaction.currency}
Kock utbetalning: ${transaction.chef_earnings.toFixed(2)} ${transaction.currency}
Stripe Payment Intent ID: ${transaction.stripe_payment_intent_id || 'N/A'}
Stripe Charge ID: ${transaction.stripe_charge_id || 'N/A'}

--------------------
Homechef AB - Provisionsunderlag genererat ${new Date().toLocaleString('sv-SE')}
Detta dokument är automatiskt genererat och utgör underlag för bokföring
`;

  // Create simple PDF structure
  const pdfHeader = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Courier
>>
endobj
5 0 obj
<<
/Length ${content.length + 50}
>>
stream
BT
/F1 10 Tf
50 750 Td
`;

  const lines = content.split('\n');
  let yPos = 750;
  const pdfLines: string[] = [];
  
  for (const line of lines) {
    if (line.trim()) {
      pdfLines.push(`(${line.replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj`);
    }
    yPos -= 15;
    pdfLines.push(`0 -15 Td`);
  }

  const pdfBody = pdfLines.join('\n');

  const pdfFooter = `
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000262 00000 n 
0000000341 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${pdfHeader.length + pdfBody.length + 150}
%%EOF`;

  const fullPDF = pdfHeader + pdfBody + pdfFooter;
  return new TextEncoder().encode(fullPDF);
}
