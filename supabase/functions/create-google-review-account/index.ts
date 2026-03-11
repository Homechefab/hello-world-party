import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ReviewRole = "customer" | "chef" | "kitchen_partner" | "restaurant";

interface ReviewAccount {
  email: string;
  password: string;
  fullName: string;
  role: ReviewRole;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REVIEW_ACCOUNTS: ReviewAccount[] = [
  {
    email: "googlereview@homechef.nu",
    password: "GoogleReview2026!",
    fullName: "Google Reviewer Customer",
    role: "customer",
  },
  {
    email: "googlereview-chef@homechef.nu",
    password: "GoogleReview2026!",
    fullName: "Google Reviewer Chef",
    role: "chef",
  },
  {
    email: "googlereview-kitchen@homechef.nu",
    password: "GoogleReview2026!",
    fullName: "Google Reviewer Kitchen",
    role: "kitchen_partner",
  },
  {
    email: "googlereview-restaurant@homechef.nu",
    password: "GoogleReview2026!",
    fullName: "Google Reviewer Restaurant",
    role: "restaurant",
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Saknar SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY");
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: listedUsers, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) throw listError;

    const users = listedUsers.users ?? [];

    const ensureUser = async (account: ReviewAccount) => {
      const existing = users.find((u) => (u.email ?? "").toLowerCase() === account.email.toLowerCase());

      if (existing) {
        const { data: updated, error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
          password: account.password,
          email_confirm: true,
          user_metadata: { full_name: account.fullName },
        });

        if (updateError) throw updateError;
        return updated.user.id;
      }

      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.fullName },
      });

      if (createError) throw createError;
      return created.user.id;
    };

    const ensureRoleData = async (userId: string, account: ReviewAccount) => {
      const { error: profileError } = await admin.from("profiles").upsert(
        {
          id: userId,
          email: account.email,
          full_name: account.fullName,
          role: account.role,
        },
        { onConflict: "id" }
      );

      if (profileError) throw profileError;

      const { error: roleError } = await admin.from("user_roles").upsert(
        {
          user_id: userId,
          role: account.role,
        },
        { onConflict: "user_id,role" }
      );

      if (roleError) throw roleError;

      if (account.role === "chef") {
        const { data: existingChef, error: chefReadError } = await admin
          .from("chefs")
          .select("id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();

        if (chefReadError) throw chefReadError;

        if (existingChef?.id) {
          const { error: chefUpdateError } = await admin
            .from("chefs")
            .update({ kitchen_approved: true, application_status: "approved", business_name: "Google Review Chef" })
            .eq("id", existingChef.id);
          if (chefUpdateError) throw chefUpdateError;
        } else {
          const { error: chefInsertError } = await admin.from("chefs").insert({
            user_id: userId,
            business_name: "Google Review Chef",
            contact_email: account.email,
            full_name: account.fullName,
            kitchen_approved: true,
            application_status: "approved",
          });
          if (chefInsertError) throw chefInsertError;
        }
      }

      if (account.role === "kitchen_partner") {
        const { data: existingPartner, error: partnerReadError } = await admin
          .from("kitchen_partners")
          .select("id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();

        if (partnerReadError) throw partnerReadError;

        if (existingPartner?.id) {
          const { error: partnerUpdateError } = await admin
            .from("kitchen_partners")
            .update({ approved: true, application_status: "approved", business_name: "Google Review Kitchen", address: "Reviewgatan 1" })
            .eq("id", existingPartner.id);
          if (partnerUpdateError) throw partnerUpdateError;
        } else {
          const { error: partnerInsertError } = await admin.from("kitchen_partners").insert({
            user_id: userId,
            business_name: "Google Review Kitchen",
            address: "Reviewgatan 1",
            approved: true,
            application_status: "approved",
          });
          if (partnerInsertError) throw partnerInsertError;
        }
      }

      if (account.role === "restaurant") {
        const { data: existingRestaurant, error: restReadError } = await admin
          .from("restaurants")
          .select("id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();

        if (restReadError) throw restReadError;

        if (existingRestaurant?.id) {
          const { error: restUpdateError } = await admin
            .from("restaurants")
            .update({ approved: true, application_status: "approved", business_name: "Google Review Restaurant" })
            .eq("id", existingRestaurant.id);
          if (restUpdateError) throw restUpdateError;
        } else {
          const { error: restInsertError } = await admin.from("restaurants").insert({
            user_id: userId,
            business_name: "Google Review Restaurant",
            contact_email: account.email,
            full_name: account.fullName,
            approved: true,
            application_status: "approved",
          });
          if (restInsertError) throw restInsertError;
        }
      }
    };

    const result: Array<{ email: string; password: string; role: ReviewRole; user_id: string }> = [];

    for (const account of REVIEW_ACCOUNTS) {
      const userId = await ensureUser(account);
      await ensureRoleData(userId, account);
      result.push({
        email: account.email,
        password: account.password,
        role: account.role,
        user_id: userId,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Google review-konton klara",
        accounts: result,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    console.error("create-google-review-account error:", error);

    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
