import { useRole } from "@/hooks/useRole";
import ChefServices from "./ChefServices";
import KitchenPartnerServices from "./KitchenPartnerServices";
import CustomerServices from "./CustomerServices";
import RestaurantServices from "./RestaurantServices";

const RoleBasedServices = () => {
  const { user, loading } = useRole();

  if (loading) {
    return null;
  }

  if (user?.role === 'chef') {
    return <ChefServices />;
  }

  if (user?.role === 'kitchen_partner') {
    return <KitchenPartnerServices />;
  }

  if (user?.role === 'restaurant') {
    return <RestaurantServices />;
  }

  // Default till customer services
  return <CustomerServices />;
};

export default RoleBasedServices;