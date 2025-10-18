import { SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function createOrRetrieveCustomer({
  userId,
  stripe,
  supabaseClient,
}: {
  userId: string;
  stripe: Stripe;
  supabaseClient: SupabaseClient;
}) {
  const { data: customerData, error } = await supabaseClient
    .from('stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !customerData?.stripe_customer_id) {
    // No customer record found, let's create one
    const { data: userData } = await supabaseClient
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .maybeSingle();

    const customer = await stripe.customers.create({
      email: userData?.email,
      name: userData?.full_name,
      metadata: {
        supabaseUUID: userId,
      },
    });

    // Insert the new customer ID into our Supabase mapping table
    await supabaseClient.from('stripe_customers').insert([
      {
        user_id: userId,
        stripe_customer_id: customer.id,
      },
    ]);

    return customer;
  }

  return await stripe.customers.retrieve(customerData.stripe_customer_id);
}