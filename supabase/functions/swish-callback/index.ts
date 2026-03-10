import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SwishCallback {
  id: string;
  payeePaymentReference: string;
  paymentReference: string;
  callbackUrl: string;
  payerAlias: string;
  payeeAlias: string;
  amount: number;
  currency: string;
  message: string;
  status: "PAID" | "DECLINED" | "ERROR" | "CANCELLED";
  dateCreated: string;
  datePaid?: string;
  errorCode?: string;
  errorMessage?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const callback = await req.json() as SwishCallback;

    console.log("Received Swish callback:", JSON.stringify(callback));

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the existing payment record to validate the callback
    const { data: existingPayment, error: fetchError } = await supabaseClient
      .from("swish_payments")
      .select("instruction_id, amount, payee_alias, status")
      .eq("instruction_id", callback.payeePaymentReference)
      .single();

    if (fetchError || !existingPayment) {
      console.error("Payment not found for instruction_id:", callback.payeePaymentReference);
      return new Response(
        JSON.stringify({ error: "Payment not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Validate amount matches what we expect
    if (callback.status === "PAID" && Number(callback.amount) !== Number(existingPayment.amount)) {
      console.error("Amount mismatch! Expected:", existingPayment.amount, "Got:", callback.amount);
      return new Response(
        JSON.stringify({ error: "Amount mismatch" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Validate payee alias matches
    if (callback.payeeAlias && callback.payeeAlias !== existingPayment.payee_alias) {
      console.error("Payee alias mismatch! Expected:", existingPayment.payee_alias, "Got:", callback.payeeAlias);
      return new Response(
        JSON.stringify({ error: "Payee alias mismatch" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Prevent replaying a callback on an already-paid payment
    if (existingPayment.status === "PAID" && callback.status === "PAID") {
      console.log("Payment already marked as PAID, ignoring duplicate callback");
      return new Response(
        JSON.stringify({ success: true, message: "Already processed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Update payment status in database
    const { error: updateError } = await supabaseClient
      .from("swish_payments")
      .update({
        status: callback.status,
        payment_reference: callback.paymentReference,
        date_paid: callback.datePaid,
        error_code: callback.errorCode,
        error_message: callback.errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("instruction_id", callback.payeePaymentReference);

    if (updateError) {
      console.error("Error updating payment status:", updateError);
      throw updateError;
    }

    // If payment was successful, update the order status
    if (callback.status === "PAID") {
      const { data: payment } = await supabaseClient
        .from("swish_payments")
        .select("order_id")
        .eq("instruction_id", callback.payeePaymentReference)
        .single();

      if (payment?.order_id) {
        await supabaseClient
          .from("orders")
          .update({ status: "paid" })
          .eq("id", payment.order_id);

        console.log("Order marked as paid:", payment.order_id);
      }
    }

    console.log("Swish callback processed successfully");

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in swish-callback function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
