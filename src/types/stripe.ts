import { Database } from "@/integrations/supabase/types";

// Local fallback type to avoid coupling to a non-existent generated table
export type StripeCustomer = {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  created_at: string;
};

export type OrderWithStripe = Database["public"]["Tables"]["orders"]["Row"];