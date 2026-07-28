import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "search_dishes",
  title: "Sök maträtter",
  description:
    "Söker tillgängliga maträtter på Homechef efter namn, kategori, pris eller kock.",
  inputSchema: {
    query: z.string().optional().describe("Fritext som matchar rättens namn eller beskrivning."),
    category: z.string().optional().describe("Kategori, t.ex. husmanskost, vegetariskt."),
    chefId: z.string().optional().describe("Begränsa till en specifik kocks rätter (UUID)."),
    maxPrice: z.number().optional().describe("Högsta pris i kronor."),
    limit: z.number().int().min(1).max(50).default(10),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category, chefId, maxPrice, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();

    let q = supabaseForUser(ctx)
      .from("dishes")
      .select("id, name, description, price, category, allergens, preparation_time, chef_id, image_url, available")
      .eq("available", true)
      .limit(limit ?? 10);

    if (query) q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    if (category) q = q.ilike("category", `%${category}%`);
    if (chefId) q = q.eq("chef_id", chefId);
    if (typeof maxPrice === "number") q = q.lte("price", maxPrice);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { dishes: data ?? [] },
    };
  },
});
