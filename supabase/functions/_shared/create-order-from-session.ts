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

    // Idempotency: skip if an order for this customer/chef was created very recently
    const { data: existingOrder } = await supabaseService
      .from("orders")
      .select("id")
      .eq("customer_id", userId)
      .eq("chef_id", chefId)
      .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .limit(1);

    if (existingOrder && existingOrder.length > 0) {
      createdOrderIds.push(existingOrder[0].id as string);
      console.log("[create-order] Order already exists, skipping", { chefId, existing: existingOrder[0].id });
      continue;
    }

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
      })
      .select("id")
      .single();

    if (orderError || !newOrder) {
      console.error("[create-order] Error creating order", orderError);
      continue;
    }

    createdOrderIds.push(newOrder.id as string);

    const itemInserts = chefItems.map((i) => ({
      order_id: newOrder.id,
      dish_id: i.dishId,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      total_price: i.unitPrice * i.quantity,
    }));

    const { error: itemsError } = await supabaseService.from("order_items").insert(itemInserts);
    if (itemsError) console.error("[create-order] Error creating order items", itemsError);

    try {
      await supabaseService.functions.invoke("notify-chef-new-order", {
        body: { order_id: newOrder.id },
      });
      console.log("[create-order] Chef notification triggered", { orderId: newOrder.id });
    } catch (notifyError) {
      console.error("[create-order] Failed to notify chef", notifyError);
    }
  }

  return { createdOrderIds };
}
