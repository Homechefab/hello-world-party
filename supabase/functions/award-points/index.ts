import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client using service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Also create regular client for auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify user authentication
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { order_id, order_amount } = await req.json();

    if (!order_id || !order_amount) {
      throw new Error('Missing required parameters: order_id, order_amount');
    }

    console.log(`Processing points award for user ${user.id}, order ${order_id}, amount ${order_amount}`);

    // Call the database function to award points
    const { data, error } = await supabaseAdmin.rpc('award_points_for_purchase', {
      p_user_id: user.id,
      p_order_id: order_id,
      p_order_amount: order_amount
    });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Points awarded successfully:', data);

    // Check if user is eligible for discount on next purchase
    if (data.discount_eligible) {
      console.log(`User ${user.id} is eligible for ${data.discount_percentage}% discount on next purchase`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        points_awarded: data.points_earned,
        total_points: data.total_points,
        current_points: data.current_points,
        total_purchases: data.total_purchases,
        discount_eligible: data.discount_eligible,
        discount_percentage: data.discount_percentage,
        next_discount_at: data.next_discount_at,
        message: `Du fick ${data.points_earned} poäng för ditt köp!${data.discount_eligible ? ` Du får ${data.discount_percentage}% rabatt på nästa köp!` : ''}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error awarding points:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});