import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (step: string, details?: unknown) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[TEST-RECEIPT-FLOW] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "email krävs" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    log("Starting test receipt flow", { email });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Skapa en test-transaktion som ser ut som en riktig betalning
    const fakeSessionId = `test_session_${Date.now()}`;
    const totalAmount = 159.0;
    const platformFee = totalAmount * 0.06;
    const chefEarnings = totalAmount - platformFee;

    const { error: insertErr } = await supabase
      .from("payment_transactions")
      .insert({
        stripe_session_id: fakeSessionId,
        customer_email: email,
        dish_name: "TEST – Hemgjord glass 4 dl",
        quantity: 1,
        total_amount: totalAmount,
        platform_fee: platformFee,
        chef_earnings: chefEarnings,
        currency: "SEK",
        payment_status: "paid",
      });

    if (insertErr) {
      log("Insert failed", insertErr);
      throw new Error(`Kunde inte skapa testtransaktion: ${insertErr.message}`);
    }

    log("Test transaction created", { sessionId: fakeSessionId });

    // Anropa send-customer-receipt med test-sessionen
    const { data: receiptData, error: receiptErr } = await supabase.functions.invoke(
      "send-customer-receipt",
      { body: { sessionId: fakeSessionId } }
    );

    if (receiptErr) {
      log("Receipt invocation failed", receiptErr);
      throw new Error(`Kunde inte skicka kvitto: ${receiptErr.message}`);
    }

    log("Receipt sent", receiptData);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Test-kvitto skickat till ${email}`,
        sessionId: fakeSessionId,
        receipt: receiptData,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log("ERROR", { msg });
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
