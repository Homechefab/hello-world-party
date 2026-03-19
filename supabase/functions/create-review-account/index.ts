import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Server-side only credentials — never sent to the client
const REVIEW_ACCOUNTS: Record<string, { email: string; password: string; fullName: string }> = {
  Apple: {
    email: "applereview@homechef.nu",
    password: "AppleReview2026!",
    fullName: "Apple Review",
  },
  Google: {
    email: "googlereview@homechef.nu",
    password: "GoogleReview2026!",
    fullName: "Google Review",
  },
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isDuplicateAuthError = (message: string) =>
  /already|exists|registered|taken/i.test(message);

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: "Invalid authentication" }, 401);
    }

    const { data: isAdmin, error: adminError } = await supabaseClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (adminError || !isAdmin) {
      return jsonResponse({ error: "Admin access required" }, 403);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    let payload: any = {};
    if (req.method !== "GET") {
      try {
        payload = await req.json();
      } catch {
        payload = {};
      }
    }

    const action = payload?.action ?? "create";

    // ── STATUS action ──
    if (action === "status") {
      const platforms: string[] = Array.isArray(payload?.platforms)
        ? payload.platforms.filter((p: unknown) => typeof p === "string" && REVIEW_ACCOUNTS[p as string])
        : Object.keys(REVIEW_ACCOUNTS);

      const emails = platforms.map((p) => REVIEW_ACCOUNTS[p].email);

      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .in("email", emails);

      if (profilesError) {
        return jsonResponse({ error: `Failed to fetch profiles: ${profilesError.message}` }, 400);
      }

      const userIds = (profiles ?? []).map((profile) => profile.id);
      const requiredRoles = ["customer", "chef", "kitchen_partner", "restaurant"];

      const rolesByUser = new Map<string, Set<string>>();
      const approvalByUser = new Map<
        string,
        { chef: boolean; kitchenPartner: boolean; restaurant: boolean }
      >();

      userIds.forEach((userId) => {
        approvalByUser.set(userId, { chef: false, kitchenPartner: false, restaurant: false });
      });

      if (userIds.length > 0) {
        const [rolesResult, chefsResult, kitchenPartnersResult, restaurantsResult] = await Promise.all([
          supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", userIds),
          supabaseAdmin.from("chefs").select("user_id, kitchen_approved").in("user_id", userIds),
          supabaseAdmin.from("kitchen_partners").select("user_id, approved").in("user_id", userIds),
          supabaseAdmin.from("restaurants").select("user_id, approved").in("user_id", userIds),
        ]);

        if (rolesResult.error || chefsResult.error || kitchenPartnersResult.error || restaurantsResult.error) {
          return jsonResponse({
            error: `Failed to fetch status data: ${
              rolesResult.error?.message ??
              chefsResult.error?.message ??
              kitchenPartnersResult.error?.message ??
              restaurantsResult.error?.message
            }`,
          }, 400);
        }

        (rolesResult.data ?? []).forEach((row) => {
          if (!rolesByUser.has(row.user_id)) rolesByUser.set(row.user_id, new Set<string>());
          rolesByUser.get(row.user_id)?.add(row.role);
        });

        (chefsResult.data ?? []).forEach((row) => {
          if (!row.user_id) return;
          const c = approvalByUser.get(row.user_id);
          if (c && row.kitchen_approved) c.chef = true;
        });

        (kitchenPartnersResult.data ?? []).forEach((row) => {
          const c = approvalByUser.get(row.user_id);
          if (c && row.approved) c.kitchenPartner = true;
        });

        (restaurantsResult.data ?? []).forEach((row) => {
          if (!row.user_id) return;
          const c = approvalByUser.get(row.user_id);
          if (c && row.approved) c.restaurant = true;
        });
      }

      const accounts = platforms.map((platform) => {
        const email = REVIEW_ACCOUNTS[platform].email;
        const profile = (profiles ?? []).find((row) => row.email === email);

        if (!profile) {
          return { platform, email, exists: false, fullyConfigured: false, roles: [] };
        }

        const roles = Array.from(rolesByUser.get(profile.id) ?? []);
        const approvals = approvalByUser.get(profile.id) ?? { chef: false, kitchenPartner: false, restaurant: false };
        const hasAllRoles = requiredRoles.every((role) => roles.includes(role));
        const fullyConfigured = hasAllRoles && approvals.chef && approvals.kitchenPartner && approvals.restaurant;

        return { platform, email, exists: true, fullyConfigured, roles };
      });

      // Never return passwords
      return jsonResponse({ success: true, accounts });
    }

    // ── CREATE action ──
    const platform = payload?.platform;
    if (!platform || !REVIEW_ACCOUNTS[platform]) {
      return jsonResponse({ error: "Invalid platform. Must be 'Apple' or 'Google'." }, 400);
    }

    const { email, password, fullName } = REVIEW_ACCOUNTS[platform];

    let userId: string | null = null;
    let existedAlready = false;

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "customer" },
    });

    if (createError) {
      if (!isDuplicateAuthError(createError.message)) {
        return jsonResponse({ error: `Failed to create user: ${createError.message}` }, 400);
      }

      existedAlready = true;

      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      userId = existingProfile?.id ?? null;

      if (!userId) {
        const { data: usersPage, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers({
          page: 1, perPage: 1000,
        });

        if (listUsersError) {
          return jsonResponse({ error: `Failed to list existing users: ${listUsersError.message}` }, 400);
        }

        userId = usersPage.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
      }

      if (!userId) {
        return jsonResponse({ error: "User already exists but could not be linked" }, 400);
      }
    } else {
      userId = newUser.user.id;
    }

    const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "customer" },
    });

    if (updateAuthError) {
      return jsonResponse({ error: `Failed to update auth user: ${updateAuthError.message}` }, 400);
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId, email, full_name: fullName, phone: "+46700000000",
        address: `${platform} Review, Stockholm`, municipality_approved: true,
        onboarding_completed: true, role: "customer",
      },
      { onConflict: "id" },
    );

    if (profileError) {
      return jsonResponse({ error: `Failed to upsert profile: ${profileError.message}` }, 400);
    }

    const roles = ["customer", "chef", "kitchen_partner", "restaurant"] as const;
    const { error: rolesError } = await supabaseAdmin.from("user_roles").upsert(
      roles.map((role) => ({ user_id: userId, role })),
      { onConflict: "user_id,role" },
    );

    if (rolesError) {
      return jsonResponse({ error: `Failed to upsert roles: ${rolesError.message}` }, 400);
    }

    let chefId: string | null = null;

    const { data: existingChef } = await supabaseAdmin
      .from("chefs").select("id").eq("user_id", userId).maybeSingle();

    if (existingChef?.id) {
      const { data: updatedChef, error: updateChefError } = await supabaseAdmin
        .from("chefs")
        .update({
          business_name: `${platform} Review Kitchen`, full_name: fullName,
          kitchen_approved: true, application_status: "approved",
          municipality_approval_date: new Date().toISOString(),
          contact_email: email, phone: "+46700000000", city: "Stockholm",
        })
        .eq("id", existingChef.id).select("id").single();

      if (updateChefError) {
        return jsonResponse({ error: `Failed to update chef profile: ${updateChefError.message}` }, 400);
      }
      chefId = updatedChef.id;
    } else {
      const { data: createdChef, error: createChefError } = await supabaseAdmin
        .from("chefs")
        .insert({
          user_id: userId, business_name: `${platform} Review Kitchen`, full_name: fullName,
          kitchen_approved: true, application_status: "approved",
          municipality_approval_date: new Date().toISOString(),
          contact_email: email, phone: "+46700000000", city: "Stockholm",
        })
        .select("id").single();

      if (createChefError) {
        return jsonResponse({ error: `Failed to create chef profile: ${createChefError.message}` }, 400);
      }
      chefId = createdChef.id;
    }

    const { data: existingKP } = await supabaseAdmin
      .from("kitchen_partners").select("id").eq("user_id", userId).maybeSingle();

    if (existingKP?.id) {
      await supabaseAdmin.from("kitchen_partners").update({
        business_name: `${platform} Review Kitchen Partner`,
        address: "Review Street 1, Stockholm", approved: true, application_status: "approved",
      }).eq("id", existingKP.id);
    } else {
      await supabaseAdmin.from("kitchen_partners").insert({
        user_id: userId, business_name: `${platform} Review Kitchen Partner`,
        address: "Review Street 1, Stockholm", approved: true, application_status: "approved",
      });
    }

    const { data: existingRestaurant } = await supabaseAdmin
      .from("restaurants").select("id").eq("user_id", userId).maybeSingle();

    if (existingRestaurant?.id) {
      await supabaseAdmin.from("restaurants").update({
        business_name: `${platform} Review Restaurant`, full_name: fullName,
        approved: true, application_status: "approved",
        contact_email: email, phone: "+46700000000", city: "Stockholm",
      }).eq("id", existingRestaurant.id);
    } else {
      await supabaseAdmin.from("restaurants").insert({
        user_id: userId, business_name: `${platform} Review Restaurant`, full_name: fullName,
        approved: true, application_status: "approved",
        contact_email: email, phone: "+46700000000", city: "Stockholm",
      });
    }

    if (chefId) {
      const { count } = await supabaseAdmin
        .from("dishes").select("id", { count: "exact", head: true }).eq("chef_id", chefId);

      if ((count ?? 0) === 0) {
        await supabaseAdmin.from("dishes").insert([
          {
            chef_id: chefId, name: "Köttbullar med lingon",
            description: "Klassiska svenska köttbullar med lingonsylt och potatismos",
            price: 149, category: "Huvudrätt",
            ingredients: ["nötfärs", "ströbröd", "grädde", "lök", "lingon"],
            allergens: ["gluten", "mjölk"], preparation_time: 45, available: true,
          },
          {
            chef_id: chefId, name: "Laxfilé med dillsås",
            description: "Ugnsbakad lax med krämig dillsås och kokt potatis",
            price: 179, category: "Huvudrätt",
            ingredients: ["lax", "dill", "grädde", "potatis", "citron"],
            allergens: ["fisk", "mjölk"], preparation_time: 35, available: true,
          },
        ]);
      }
    }

    // Never return password in response
    return jsonResponse({
      success: true,
      existed: existedAlready,
      message: `${platform} review account ${existedAlready ? "updated" : "created"} successfully`,
      userId,
      email,
    });
  } catch (error: any) {
    console.error("Error creating review account:", error);
    return jsonResponse({ error: error.message ?? "Unexpected error" }, 500);
  }
});
