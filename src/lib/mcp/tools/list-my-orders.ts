import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "list_my_orders",
  title: "Lista mina beställningar",
  description:
    "Hämtar de senaste matbeställningarna för den inloggade Homechef-användaren (som kund eller kock).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(10).describe("Antal beställningar att hämta."),
    status: z.string().optional().describe("Filtrera på status, t.ex. pending, confirmed, delivered."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, status }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();

    let query = supabaseForUser(ctx)
      .from("orders")
      .select("id, status, total_amount, delivery_address, delivery_time, created_at, chef_id, customer_id")
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { orders: data ?? [] },
    };
  },
});
