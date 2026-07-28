import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "search_chefs",
  title: "Sök hemmakockar",
  description:
    "Söker godkända hemmakockar på Homechef efter stad, namn eller specialitet.",
  inputSchema: {
    city: z.string().optional().describe("Stad att filtrera på, t.ex. Stockholm."),
    query: z.string().optional().describe("Fritext som matchar kockens namn eller verksamhetsnamn."),
    limit: z.number().int().min(1).max(50).default(10),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ city, query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();

    let q = supabaseForUser(ctx)
      .from("public_chef_profiles")
      .select("id, full_name, business_name, city, bio, specialties, profile_image_url")
      .limit(limit ?? 10);

    if (city) q = q.ilike("city", `%${city}%`);
    if (query) q = q.or(`full_name.ilike.%${query}%,business_name.ilike.%${query}%`);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { chefs: data ?? [] },
    };
  },
});
