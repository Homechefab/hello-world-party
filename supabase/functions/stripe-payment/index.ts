import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { stripe } from '../_shared/stripe.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createOrRetrieveCustomer } from '../_shared/customers.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    logStep('Stripe payment function started');
    
    // Accept dish_id and quantity instead of amount
    const { dishId, quantity, pickupTime, pickupAddress, userId } = await req.json();

    if (!dishId || !quantity) {
      throw new Error('dishId and quantity are required');
    }

    if (quantity < 1 || quantity > 100) {
      throw new Error('Quantity must be between 1 and 100');
    }

    logStep('Received payment request', { dishId, quantity });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Look up the dish price from database
    const { data: dish, error: dishError } = await supabaseClient
      .from('dishes')
      .select('id, name, price, chef_id')
      .eq('id', dishId)
      .single();

    if (dishError || !dish) {
      logStep('Dish lookup failed', { error: dishError });
      throw new Error('Invalid dish ID');
    }

    logStep('Dish found', { name: dish.name, price: dish.price });

    // Calculate total amount server-side (price is in kr, convert to öre)
    const unitPriceInOre = Math.round(dish.price * 100);
    const totalAmount = unitPriceInOre * quantity;

    logStep('Calculated amount', { unitPriceInOre, quantity, totalAmount });

    // Create or retrieve the customer
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
            currency: 'sek',
            product_data: {
              name: dish.name,
              description: `Quantity: ${quantity}, Pickup: ${pickupTime}`,
              metadata: {
                pickupAddress,
                dishId: dish.id,
              },
            },
            unit_amount: unitPriceInOre,
          },
          quantity: quantity,
        },
      ],
      success_url: `${req.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/payment/canceled`,
      metadata: {
        userId,
        dishId: dish.id,
        dishName: dish.name,
        quantity: quantity.toString(),
        pickupTime,
        pickupAddress,
      },
    });

    logStep('Stripe session created', { sessionId: session.id });

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR in stripe-payment', { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
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
