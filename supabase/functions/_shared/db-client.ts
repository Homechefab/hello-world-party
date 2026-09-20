// Shared client type for edge functions.
//
// Edge functions run without a generated Database type. With supabase-js 2.5x
// strict generics, `ReturnType<typeof createClient>` resolves table rows to
// `never`, which breaks typed inserts/updates. Pin a permissive client type
// here so payment/order helpers accept dynamic row payloads.
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServiceClient = SupabaseClient<any, any, any, any, any>;

export function createServiceClient(): ServiceClient {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  ) as ServiceClient;
}
