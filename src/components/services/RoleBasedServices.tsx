import { useRole } from "@/hooks/useRole";
import ChefServices from "./ChefServices";
import KitchenPartnerServices from "./KitchenPartnerServices";
import CustomerServices from "./CustomerServices";
import RestaurantServices from "./RestaurantServices";

const RoleBasedServices = () => {
  return (
    <>
      <CustomerServices />
      <ChefServices />
      <KitchenPartnerServices />
      <RestaurantServices />
    </>
  );
};

export default RoleBasedServices;