import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.1?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Authenticate caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey);
    const { data: authData, error: authError } = await supabaseUser.auth.getUser(token);
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerUserId = authData.user.id;

    const body = await req.json().catch(() => ({}));
    const orderId = body?.order_id;
    if (!orderId || typeof orderId !== "string") {
      return new Response(JSON.stringify({ error: "order_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, chef_id, customer_id, customer_phone")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Authorize: caller must be the chef owning this order (or admin)
    const { data: chef } = await supabase
      .from("chefs")
      .select("id, user_id")
      .eq("id", order.chef_id)
      .single();

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUserId);
    const isAdmin = (roles || []).some((r: { role: string }) => r.role === "admin");

    if (!isAdmin && chef?.user_id !== callerUserId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve customer phone — prefer the one captured at checkout, fall back to profile
    let phone: string | null = order.customer_phone || null;
    if (!phone) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone")
        .eq("id", order.customer_id)
        .single();
      phone = profile?.phone || null;
    }

    if (!phone) {
      console.log(`No phone number on file for order ${orderId}`);
      return new Response(
        JSON.stringify({ success: false, reason: "no_phone" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Normalize to E.164 (assume Swedish if no country code)
    let toPhone = phone.replace(/[\s\-()]/g, "");
    if (toPhone.startsWith("00")) {
      toPhone = "+" + toPhone.substring(2);
    } else if (toPhone.startsWith("0")) {
      toPhone = "+46" + toPhone.substring(1);
    } else if (!toPhone.startsWith("+")) {
      toPhone = "+46" + toPhone;
    }

    const ELKS_API_USERNAME = Deno.env.get("ELKS_API_USERNAME");
    const ELKS_API_PASSWORD = Deno.env.get("ELKS_API_PASSWORD");
    if (!ELKS_API_USERNAME || !ELKS_API_PASSWORD) {
      console.error("46elks credentials not configured");
      return new Response(
        JSON.stringify({ success: false, reason: "elks_not_configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const shortId = String(order.id).slice(0, 8);
    const smsBody = `Din mat ar klar for upphamtning! Ordernr #${shortId}`;

    const basicAuth = btoa(`${ELKS_API_USERNAME}:${ELKS_API_PASSWORD}`);
    const smsResponse = await fetch("https://api.46elks.com/a1/sms", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        from: "Homechef",
        to: toPhone,
        message: smsBody,
      }),
    });

    const smsResult = await smsResponse.json().catch(() => ({}));
    if (!smsResponse.ok) {
      console.error("46elks SMS error:", JSON.stringify(smsResult));
      return new Response(
        JSON.stringify({ success: false, error: smsResult }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`Ready-SMS sent to ${toPhone} for order ${shortId}, id=${smsResult.id}`);

    return new Response(
      JSON.stringify({ success: true, smsId: smsResult.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    console.error("Error in notify-customer-ready:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
