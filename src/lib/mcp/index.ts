import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listMyOrders from "./tools/list-my-orders";
import searchChefs from "./tools/search-chefs";
import searchDishes from "./tools/search-dishes";
import getMyProfile from "./tools/get-my-profile";
import updateOrderStatus from "./tools/update-order-status";

// Issuern måste vara den direkta Supabase-hosten, byggd från projekt-ref.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "homechef-mcp",
  title: "Homechef",
  version: "0.1.0",
  instructions:
    "Verktyg för Homechef – Sveriges marknadsplats för hemlagad mat. Använd search_chefs och search_dishes för att hitta hemmakockar och maträtter, get_my_profile för den inloggade användaren, list_my_orders för beställningar och update_order_status för kockar som vill uppdatera en beställning.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchChefs, searchDishes, getMyProfile, listMyOrders, updateOrderStatus],
});
