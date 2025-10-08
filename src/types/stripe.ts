import { Database } from "@/integrations/supabase/types";

export type StripeCustomer = Database["public"]["Tables"]["stripe_customers"]["Row"];
export type OrderWithStripe = Database["public"]["Tables"]["orders"]["Row"];