// Shared helper: create order(s) + items from a paid Stripe Checkout session
// and notify the chef. Idempotent — safe to call multiple times for the same
// session (e.g. from both verify-payment and the Stripe webhook).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

type SupabaseClient = ReturnType<typeof createClient>;

interface SessionLike {
  id: string;
  payment_status?: string | null;
  metadata?: Record<string, string> | null;
}

interface OrderItemMeta {
  chefId: string;
  dishId: string;
  quantity: number;
  unitPrice: number;
  name?: string;
}

export async function createOrdersFromSession(
  supabaseService: SupabaseClient,
  session: SessionLike,
): Promise<{ createdOrderIds: string[] }> {
  const createdOrderIds: string[] = [];

  if (session.payment_status !== "paid") return { createdOrderIds };
  const rawItems = session.metadata?.order_items;
  if (!rawItems) return { createdOrderIds };

  const userId = session.metadata?.userId;
  if (!userId) {
    console.log("[create-order] No userId in session metadata, skipping order creation");
    return { createdOrderIds };
  }

  let orderItemsData: OrderItemMeta[];
  try {
    orderItemsData = JSON.parse(rawItems) as OrderItemMeta[];
  } catch (err) {
    console.error("[create-order] Failed to parse order_items metadata", err);
    return { createdOrderIds };
  }
  if (orderItemsData.length === 0) return { createdOrderIds };

  // Backfill phone on profile (best effort)
  const phoneFromMeta = session.metadata?.customer_phone;
  if (phoneFromMeta) {
    try {
      const { data: existingProfile } = await supabaseService
        .from("profiles")
        .select("phone")
        .eq("id", userId)
        .maybeSingle();
      if (existingProfile && !existingProfile.phone) {
        await supabaseService.from("profiles").update({ phone: phoneFromMeta }).eq("id", userId);
      }
    } catch (err) {
      console.error("[create-order] Failed to backfill profile phone", err);
    }
  }

  const itemsByChef: Record<string, OrderItemMeta[]> = {};
  for (const item of orderItemsData) {
    if (!item.chefId) continue;
    (itemsByChef[item.chefId] ||= []).push(item);
  }

  for (const [chefId, chefItems] of Object.entries(itemsByChef)) {
    const orderTotal = chefItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    // Strong idempotency: lookup by (stripe_session_id, chef_id)
    const { data: bySession } = await supabaseService
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .eq("chef_id", chefId)
      .limit(1);

    if (bySession && bySession.length > 0) {
      createdOrderIds.push(bySession[0].id as string);
      console.log("[create-order] Order already exists for session, skipping", { chefId, existing: bySession[0].id });
      continue;
    }

    // Atomic insert protected by unique index on (stripe_session_id, chef_id).
    // If another concurrent invocation already inserted the row, the unique
    // constraint will reject this insert and we recover by re-reading.
    const { data: newOrder, error: orderError } = await supabaseService
      .from("orders")
      .insert({
        customer_id: userId,
        chef_id: chefId,
        total_amount: orderTotal,
        delivery_address: session.metadata?.delivery_address || "Upphämtning",
        special_instructions: session.metadata?.special_instructions || null,
        status: "pending",
        customer_phone: phoneFromMeta || null,
        stripe_session_id: session.id,
      })
      .select("id")
      .single();

    let orderId: string | null = newOrder?.id as string | null;
    let createdNow = !!newOrder && !orderError;

    if (orderError || !newOrder) {
      // Likely unique-violation race — re-query the winning row.
      const { data: raceOrder } = await supabaseService
        .from("orders")
        .select("id")
        .eq("stripe_session_id", session.id)
        .eq("chef_id", chefId)
        .limit(1);
      if (raceOrder && raceOrder.length > 0) {
        orderId = raceOrder[0].id as string;
        createdNow = false;
        console.log("[create-order] Race detected — using existing order", { chefId, orderId });
      } else {
        console.error("[create-order] Error creating order", orderError);
        continue;
      }
    }

    if (!orderId) continue;
    createdOrderIds.push(orderId);

    // Only insert items + notify when WE created the order, to avoid duplicate items/SMS.
    if (!createdNow) continue;

    const itemInserts = chefItems.map((i) => ({
      order_id: orderId,
      dish_id: i.dishId,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      total_price: i.unitPrice * i.quantity,
    }));

    const { error: itemsError } = await supabaseService.from("order_items").insert(itemInserts);
    if (itemsError) console.error("[create-order] Error creating order items", itemsError);

    try {
      await supabaseService.functions.invoke("notify-chef-new-order", {
        body: { order_id: orderId },
      });
      console.log("[create-order] Chef notification triggered", { orderId });
    } catch (notifyError) {
      console.error("[create-order] Failed to notify chef", notifyError);
    }
  }

  return { createdOrderIds };
}
