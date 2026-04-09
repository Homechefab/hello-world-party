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
    // Require authentication before exposing any payment data
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

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

    // Verify the session belongs to the authenticated user
    if (session.metadata?.userId && session.metadata.userId !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }
    if (!session.metadata?.userId && session.customer_details?.email) {
      const { data: profile } = await supabaseAuth.from('profiles').select('email').eq('id', user.id).single();
      if (profile && profile.email !== session.customer_details.email) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        });
      }
    }
    if (!session.metadata?.userId && !session.customer_details?.email) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    let paymentIntentId: string | undefined;
    let chargeId: string | undefined;
    let receiptUrl: string | undefined;

    if (session.payment_intent && typeof session.payment_intent !== "string") {
      paymentIntentId = session.payment_intent.id;
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
    
    const totalAmount = (session.amount_total || 0) / 100;
    const serviceFeeRate = 0.06;
    const sellerCommissionRate = 0.19;
    const basePrice = totalAmount / (1 + serviceFeeRate);
    const serviceFee = totalAmount - basePrice;
    const sellerCommission = basePrice * sellerCommissionRate;
    const platformFee = serviceFee + sellerCommission;
    const chefEarnings = basePrice - sellerCommission;
    const dishName = items.data[0]?.description || session.metadata?.dishName || "Okänd rätt";
    
    try {
      const { error: dbError } = await supabaseClient
        .from("payment_transactions")
        .upsert({
          stripe_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          stripe_charge_id: chargeId,
          customer_email: session.customer_details?.email || "unknown@email.com",
          user_id: user.id,
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

    // CREATE ORDER in orders table after successful payment
    let createdOrderId: string | undefined;
    if (session.payment_status === 'paid' && session.metadata?.order_items) {
      try {
        const orderItemsData = JSON.parse(session.metadata.order_items);
        if (orderItemsData.length > 0) {
          // Group items by chef (one order per chef)
          const itemsByChef: Record<string, Array<{ dishId: string; quantity: number; unitPrice: number }>> = {};
          for (const item of orderItemsData) {
            if (!itemsByChef[item.chefId]) itemsByChef[item.chefId] = [];
            itemsByChef[item.chefId].push(item);
          }

          for (const [chefId, chefItems] of Object.entries(itemsByChef)) {
            const orderTotal = chefItems.reduce(
              (sum, it) => sum + it.unitPrice * it.quantity, 0
            );

            // Idempotency: check if order already exists for this stripe session
            const { data: existingOrder } = await supabaseClient
              .from("orders")
              .select("id")
              .eq("customer_id", user.id)
              .eq("chef_id", chefId)
              .gte("created_at", new Date(Date.now() - 120000).toISOString())
              .limit(1);

            if (existingOrder && existingOrder.length > 0) {
              console.log("Order already exists, skipping:", existingOrder[0].id);
              createdOrderId = existingOrder[0].id;
              continue;
            }

            // Create the order
            const { data: newOrder, error: orderError } = await supabaseClient
              .from("orders")
              .insert({
                customer_id: user.id,
                chef_id: chefId,
                total_amount: orderTotal,
                delivery_address: session.metadata?.delivery_address || 'Upphämtning',
                special_instructions: session.metadata?.special_instructions || null,
                status: 'pending',
              })
              .select('id')
              .single();

            if (orderError) {
              console.error("Error creating order:", orderError);
              continue;
            }

            createdOrderId = newOrder.id;
            console.log("Order created:", newOrder.id);

            // Create order items
            const orderItemInserts = chefItems.map((it) => ({
              order_id: newOrder.id,
              dish_id: it.dishId,
              quantity: it.quantity,
              unit_price: it.unitPrice,
              total_price: it.unitPrice * it.quantity,
            }));

            const { error: itemsError } = await supabaseClient
              .from("order_items")
              .insert(orderItemInserts);

            if (itemsError) {
              console.error("Error creating order items:", itemsError);
            } else {
              console.log("Order items created for order:", newOrder.id);
            }

            // Notify chef about the new order (email + SMS)
            try {
              await supabaseClient.functions.invoke('notify-chef-new-order', {
                body: { order_id: newOrder.id },
              });
              console.log("Chef notification sent for order:", newOrder.id);
            } catch (notifyError) {
              console.error("Failed to notify chef:", notifyError);
            }
          }
        }
      } catch (orderCreationError) {
        console.error("Error in order creation flow:", orderCreationError);
      }
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
        order_id: createdOrderId,
        line_items: items.data.map((i: any) => ({
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