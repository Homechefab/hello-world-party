import { serve } from 'https://deno.fresh.run/std@0.168.0/http/server.ts';
import { stripe } from '../_shared/stripe.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createOrRetrieveCustomer } from '../_shared/customers.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency, dishTitle, quantity, pickupTime, pickupAddress, userId } = await req.json();

    // Create or retrieve the customer
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const customer = await createOrRetrieveCustomer({
      userId,
      stripe,
      supabaseClient,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: dishTitle,
              description: `Quantity: ${quantity}, Pickup: ${pickupTime}`,
              metadata: {
                pickupAddress,
              },
            },
            unit_amount: amount, // Amount in cents/öre
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/payment/canceled`,
      metadata: {
        userId,
        dishTitle,
        quantity: quantity.toString(),
        pickupTime,
        pickupAddress,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});