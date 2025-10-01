import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import Index from "./pages/Index";
// DEBUG: temporary banner
import DishPage from "./pages/DishPage";
import SellPage from "./pages/SellPage";
import SellerGuide from "./pages/SellerGuide";
import Dashboard from "./pages/Dashboard";
import ChefSearch from "./pages/ChefSearch";
import SearchResults from "./pages/SearchResults";
import ChefProfile from "./pages/ChefProfile";
import PickupPage from "./pages/PickupPage";
import ExperiencePage from "./pages/ExperiencePage";
import PrivateChefPage from "./pages/PrivateChefPage";
import PartnershipPage from "./pages/PartnershipPage";
import HowItWorks from "./pages/HowItWorks";
import HyrUtDittKokInfo from "@/pages/kitchen-partner/HyrUtDittKokInfo";
import SecurePayments from "./pages/SecurePayments";
import CustomerService from "./pages/CustomerService";
import About from "./pages/About";
import { ChefDashboard } from "./pages/chef/ChefDashboard";
import { ChefOnboarding } from "./pages/chef/ChefOnboarding";
import ChefApplication from "./pages/chef/ChefApplication";
import ApplicationPending from "./pages/chef/ApplicationPending";
import PrivateChefServices from "./pages/chef/PrivateChefServices";
import ChefExperiences from "./pages/chef/ChefExperiences";
import KitchenRequirements from "./pages/chef/KitchenRequirements";
import KitchenAssessment from "./pages/chef/KitchenAssessment";
import ChefHome from "./pages/chef/ChefHome";
import BusinessRegistration from "./pages/chef/BusinessRegistration";
import { KitchenPartnerDashboard } from "./pages/kitchen-partner/KitchenPartnerDashboard";
import { KitchenPartnerOnboarding } from "./pages/kitchen-partner/KitchenPartnerOnboarding";
import KitchenPartnerHowItWorks from "./pages/kitchen-partner/HowItWorks";
import PricingTerms from "./pages/kitchen-partner/PricingTerms";
import SecurityInsurance from "./pages/kitchen-partner/SecurityInsurance";
import PartnerSupport from "./pages/kitchen-partner/PartnerSupport";
import DeliveryPartnerOnboarding from "./pages/delivery-partner/DeliveryPartnerOnboarding";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import RestaurantPartnership from "./pages/restaurant/RestaurantPartnership";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import RestaurantApplicationForm from "./pages/restaurant/RestaurantApplicationForm";
import NotFound from "./pages/NotFound";
import NotificationSignup from "./pages/NotificationSignup";
import Auth from "./pages/Auth";
import SettingsPage from "./pages/settings/Settings";
import DeliveryAddresses from "./pages/settings/DeliveryAddresses";
import PaymentMethods from "./pages/settings/PaymentMethods";
import Preferences from "./pages/settings/Preferences";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import MyPoints from "./pages/MyPoints";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div style={{position:'fixed', top: 8, left: 8, zIndex: 99999, background:'#fff3', color:'#ff6b35', padding: '6px 10px', borderRadius: 6}}>DEBUG: App mounted</div>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
