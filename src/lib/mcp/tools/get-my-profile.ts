import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "get_my_profile",
  title: "Hämta min profil",
  description:
    "Hämtar profil och roller för den inloggade Homechef-användaren.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();

    const [{ data: profile, error: profileError }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);

    if (profileError) {
      return { content: [{ type: "text", text: profileError.message }], isError: true };
    }

    const result = { profile, roles: (roles ?? []).map((r) => r.role) };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
