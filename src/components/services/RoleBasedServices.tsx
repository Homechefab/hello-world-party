import { useRole } from "@/hooks/useRole";
import ChefServices from "./ChefServices";
import KitchenPartnerServices from "./KitchenPartnerServices";
import CustomerServices from "./CustomerServices";
import RestaurantServices from "./RestaurantServices";

const RoleBasedServices = () => {
  const { role } = useRole();

  return (
    <>
      {role === 'customer' && <CustomerServices />}
      {role === 'chef' && <ChefServices />}
      {role === 'kitchen_partner' && <KitchenPartnerServices />}
      {role === 'restaurant' && <RestaurantServices />}
    </>
  );
};

export default RoleBasedServices;