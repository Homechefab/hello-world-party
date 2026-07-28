import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "update_order_status",
  title: "Uppdatera beställningsstatus",
  description:
    "Uppdaterar status på en beställning. Endast tillåtet för den kock som äger beställningen (RLS avgör).",
  inputSchema: {
    orderId: z.string().describe("Beställningens UUID."),
    status: z
      .enum(["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"])
      .describe("Ny status för beställningen."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ orderId, status }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();

    const { data, error } = await supabaseForUser(ctx)
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("id, status, updated_at");

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data || data.length === 0) {
      return {
        content: [{ type: "text", text: "Ingen beställning uppdaterades – saknar behörighet eller fel ID." }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data[0], null, 2) }],
      structuredContent: { order: data[0] },
    };
  },
});
