import { useRole } from "@/hooks/useRole";
import ChefServices from "./ChefServices";
import KitchenPartnerServices from "./KitchenPartnerServices";
import CustomerServices from "./CustomerServices";

const RoleBasedServices = () => {
  const { isChef, isKitchenPartner, isCustomer } = useRole();

  if (isChef) {
    return <ChefServices />;
  }

  if (isKitchenPartner) {
    return <KitchenPartnerServices />;
  }

  if (isCustomer) {
    return <CustomerServices />;
  }

  // Fallback för om ingen roll är aktiv
  return <CustomerServices />;
};

export default RoleBasedServices;