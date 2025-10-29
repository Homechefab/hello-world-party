import { useRole } from "@/hooks/useRole";
import ChefServices from "./ChefServices";
import KitchenPartnerServices from "./KitchenPartnerServices";
import CustomerServices from "./CustomerServices";
import RestaurantServices from "./RestaurantServices";

const RoleBasedServices = () => {
  const { role, loading } = useRole();

  console.log('RoleBasedServices rendering with role:', role);

  if (loading) return null;

  // Show content based on active role
  return (
    <>
      {(role === 'customer' || !role) && <CustomerServices />}
      {role === 'chef' && <ChefServices />}
      {role === 'kitchen_partner' && <KitchenPartnerServices />}
      {role === 'restaurant' && <RestaurantServices />}
      {role === 'admin' && <CustomerServices />}
    </>
  );
};

export default RoleBasedServices;