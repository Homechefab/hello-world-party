import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer"],
    });

    let paymentIntentId: string | undefined;
    let chargeId: string | undefined;
    let receiptUrl: string | undefined;

    if (session.payment_intent && typeof session.payment_intent !== "string") {
      paymentIntentId = session.payment_intent.id;
      // Get latest charge to obtain receipt_url
      const latest = (session.payment_intent.latest_charge as string) || undefined;
      if (latest) {
        const charge = await stripe.charges.retrieve(latest);
        chargeId = charge.id;
        receiptUrl = charge.receipt_url || undefined;
      }
    }

    // Get line items (for display)
    const items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 10 });
    
    // Save transaction to database with commission breakdown
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    const totalAmount = (session.amount_total || 0) / 100; // Convert from cents to SEK
    // Serviceavgift betalas av kund: totalAmount = basePrice * 1.20
    // Så basePrice = totalAmount / 1.20, serviceFee = totalAmount - basePrice
    const basePrice = totalAmount / 1.20;
    const platformFee = totalAmount - basePrice; // 20% serviceavgift
    const chefEarnings = basePrice; // Säljaren får 100% av sitt pris
    const dishName = items.data[0]?.description || session.metadata?.dishName || "Okänd rätt";
    
    try {
      const { error: dbError } = await supabaseClient
        .from("payment_transactions")
        .upsert({
          stripe_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          stripe_charge_id: chargeId,
          customer_email: session.customer_details?.email || "unknown@email.com",
          dish_name: dishName,
          quantity: items.data[0]?.quantity || 1,
          total_amount: totalAmount,
          platform_fee: platformFee,
          chef_earnings: chefEarnings,
          currency: (session.currency || "sek").toUpperCase(),
          payment_status: session.payment_status || "unknown",
          receipt_url: receiptUrl,
        }, {
          onConflict: "stripe_session_id"
        });
      
      if (dbError) {
        console.error("Error saving transaction:", dbError);
      } else {
        console.log("Transaction saved successfully");
      }
    } catch (error) {
      console.error("Error saving to database:", error);
    }

    return new Response(
      JSON.stringify({
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email,
        payment_intent_id: paymentIntentId,
        charge_id: chargeId,
        receipt_url: receiptUrl,
        metadata: session.metadata,
        line_items: items.data.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          amount_subtotal: i.amount_subtotal,
          amount_total: i.amount_total,
          currency: i.currency,
        })),
        commission_report: {
          total_amount: totalAmount,
          platform_fee: platformFee,
          chef_earnings: chefEarnings,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
