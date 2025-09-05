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

    const { order_id, original_amount } = await req.json();

    if (!order_id || !original_amount) {
      throw new Error('Missing required parameters: order_id, original_amount');
    }

    console.log(`Checking loyalty discount for user ${user.id}, order ${order_id}, amount ${original_amount}`);

    // Call the database function to check and apply loyalty discount
    const { data, error } = await supabaseAdmin.rpc('apply_loyalty_discount', {
      p_user_id: user.id,
      p_order_id: order_id,
      p_original_amount: original_amount
    });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Loyalty discount check completed:', data);

    return new Response(
      JSON.stringify({
        success: true,
        discount_applied: data.discount_applied,
        discount_amount: data.discount_amount,
        original_amount: data.original_amount,
        final_amount: data.final_amount,
        discount_percentage: data.discount_percentage,
        message: data.discount_applied 
          ? `Grattis! Du fick ${data.discount_percentage}% lojalitetsrabatt (${data.discount_amount} kr)`
          : 'Ingen lojalitetsrabatt denna gång'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error checking loyalty discount:', error);
    
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