import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { calculatePaymentBreakdown } from "../_shared/payment-breakdown.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser(token);

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

    if (session.metadata?.userId && session.metadata.userId !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    if (!session.metadata?.userId && session.customer_details?.email) {
      const { data: profile } = await supabaseAuth
        .from("profiles")
        .select("email")
        .eq("id", user.id)
        .single();

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
      const latestChargeId = typeof session.payment_intent.latest_charge === "string"
        ? session.payment_intent.latest_charge
        : undefined;

      if (latestChargeId) {
        const charge = await stripe.charges.retrieve(latestChargeId);
        chargeId = charge.id;
        receiptUrl = charge.receipt_url || undefined;
      }
    }

    const items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 10 });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const totalAmount = (session.amount_total || 0) / 100;
    const paymentBreakdown = calculatePaymentBreakdown(totalAmount);
    const dishName = items.data[0]?.description || session.metadata?.dishName || session.metadata?.dish_name || "Okänd rätt";

    let transactionChefId: string | undefined;
    let quantityTotal = items.data[0]?.quantity || 1;

    if (session.metadata?.order_items) {
      try {
        const orderItemsData = JSON.parse(session.metadata.order_items) as Array<{ chefId?: string; quantity?: number }>;
        const chefIds = [...new Set(orderItemsData.map((item) => item.chefId).filter(Boolean))];

        if (chefIds.length === 1 && chefIds[0]) {
          transactionChefId = chefIds[0];
        }

        const derivedQuantity = orderItemsData.reduce((sum, item) => sum + (item.quantity || 0), 0);
        if (derivedQuantity > 0) {
          quantityTotal = derivedQuantity;
        }
      } catch {
        // ignore malformed metadata
      }
    }

    try {
      const insertData: Record<string, unknown> = {
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        stripe_charge_id: chargeId,
        customer_email: session.customer_details?.email || "unknown@email.com",
        user_id: user.id,
        dish_name: dishName,
        quantity: quantityTotal,
        total_amount: paymentBreakdown.totalAmount,
        platform_fee: paymentBreakdown.platformFee,
        chef_earnings: paymentBreakdown.chefEarnings,
        currency: (session.currency || "sek").toUpperCase(),
        payment_status: session.payment_status || "unknown",
        receipt_url: receiptUrl,
      };

      if (transactionChefId) {
        insertData.chef_id = transactionChefId;
      }

      const { error: dbError } = await supabaseClient
        .from("payment_transactions")
        .upsert(insertData, { onConflict: "stripe_session_id" });

      if (dbError) {
        console.error("Error saving transaction:", dbError);
      } else {
        console.log("Transaction saved successfully");
      }
    } catch (error) {
      console.error("Error saving to database:", error);
    }

    let createdOrderId: string | undefined;
    if (session.payment_status === "paid" && session.metadata?.order_items) {
      try {
        const orderItemsData = JSON.parse(session.metadata.order_items) as Array<{
          chefId: string;
          dishId: string;
          quantity: number;
          unitPrice: number;
        }>;

        if (orderItemsData.length > 0) {
          const itemsByChef: Record<string, Array<{ dishId: string; quantity: number; unitPrice: number }>> = {};

          for (const item of orderItemsData) {
            if (!itemsByChef[item.chefId]) {
              itemsByChef[item.chefId] = [];
            }
            itemsByChef[item.chefId].push(item);
          }

          for (const [chefId, chefItems] of Object.entries(itemsByChef)) {
            const orderTotal = chefItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

            const { data: existingOrder } = await supabaseClient
              .from("orders")
              .select("id")
              .eq("customer_id", user.id)
              .eq("chef_id", chefId)
              .gte("created_at", new Date(Date.now() - 120000).toISOString())
              .limit(1);

            if (existingOrder && existingOrder.length > 0) {
              createdOrderId = existingOrder[0].id;
              continue;
            }

            const { data: newOrder, error: orderError } = await supabaseClient
              .from("orders")
              .insert({
                customer_id: user.id,
                chef_id: chefId,
                total_amount: orderTotal,
                delivery_address: session.metadata?.delivery_address || "Upphämtning",
                special_instructions: session.metadata?.special_instructions || null,
                status: "pending",
              })
              .select("id")
              .single();

            if (orderError) {
              console.error("Error creating order:", orderError);
              continue;
            }

            createdOrderId = newOrder.id;

            const orderItemInserts = chefItems.map((item) => ({
              order_id: newOrder.id,
              dish_id: item.dishId,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              total_price: item.unitPrice * item.quantity,
            }));

            const { error: itemsError } = await supabaseClient.from("order_items").insert(orderItemInserts);
            if (itemsError) {
              console.error("Error creating order items:", itemsError);
            }

            try {
              await supabaseClient.functions.invoke("notify-chef-new-order", {
                body: { order_id: newOrder.id },
              });
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
        line_items: items.data.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          amount_subtotal: item.amount_subtotal,
          amount_total: item.amount_total,
          currency: item.currency,
        })),
        commission_report: {
          total_amount: paymentBreakdown.totalAmount,
          platform_fee: paymentBreakdown.platformFee,
          chef_earnings: paymentBreakdown.chefEarnings,
        },
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
