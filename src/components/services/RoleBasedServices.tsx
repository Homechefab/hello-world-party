import { useRole } from "@/hooks/useRole";
import ChefServices from "./ChefServices";
import KitchenPartnerServices from "./KitchenPartnerServices";
import CustomerServices from "./CustomerServices";
import RestaurantServices from "./RestaurantServices";

const RoleBasedServices = () => {
  const { isChef, isCustomer, isKitchenPartner, isRestaurant, loading } = useRole();

  if (loading) {
    return null;
  }

  return (
    <>
      {isCustomer && <CustomerServices />}
      {isChef && <ChefServices />}
      {isKitchenPartner && <KitchenPartnerServices />}
      {isRestaurant && <RestaurantServices />}
    </>
  );
};

export default RoleBasedServices;