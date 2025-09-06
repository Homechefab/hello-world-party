import { useRole } from "@/hooks/useRole";
import ChefServices from "./ChefServices";
import KitchenPartnerServices from "./KitchenPartnerServices";
import CustomerServices from "./CustomerServices";
import RestaurantServices from "./RestaurantServices";

const RoleBasedServices = () => {
  const { isChef, isKitchenPartner, isCustomer, isRestaurant, user } = useRole();

  console.log('RoleBasedServices - Current role:', user?.role, 'isRestaurant:', isRestaurant);

  if (isChef) {
    console.log('RoleBasedServices - Rendering ChefServices');
    return <ChefServices />;
  }

  if (isKitchenPartner) {
    console.log('RoleBasedServices - Rendering KitchenPartnerServices');
    return <KitchenPartnerServices />;
  }

  if (isRestaurant) {
    console.log('RoleBasedServices - Rendering RestaurantServices');
    return <RestaurantServices />;
  }

  if (isCustomer) {
    console.log('RoleBasedServices - Rendering CustomerServices');
    return <CustomerServices />;
  }

  console.log('RoleBasedServices - Fallback to CustomerServices');
  // Fallback för om ingen roll är aktiv
  return <CustomerServices />;
};

export default RoleBasedServices;