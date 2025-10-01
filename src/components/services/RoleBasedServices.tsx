import { useRole } from "@/hooks/useRole";
import ChefServices from "./ChefServices";
import KitchenPartnerServices from "./KitchenPartnerServices";
import CustomerServices from "./CustomerServices";
import RestaurantServices from "./RestaurantServices";

const RoleBasedServices = () => {
  const { isChef, isKitchenPartner, isCustomer, isRestaurant } = useRole();

  if (isChef) {
    return <ChefServices />;
  }

  if (isKitchenPartner) {
    return <KitchenPartnerServices />;
  }

  if (isRestaurant) {
    return <RestaurantServices />;
  }

  if (isCustomer) {
    return <CustomerServices />;
  }

  // Fallback för om ingen roll är aktiv
  return <CustomerServices />;
};

export default RoleBasedServices;