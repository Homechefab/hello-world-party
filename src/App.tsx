import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { PublicLayout } from "@/components/PublicLayout";
import Index from "./pages/Index";
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
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/dish/:id" element={<PublicLayout><DishPage /></PublicLayout>} />
            <Route path="/sell" element={<PublicLayout><SellPage /></PublicLayout>} />
            <Route path="/seller-guide" element={<PublicLayout><SellerGuide /></PublicLayout>} />
            <Route path="/pickup" element={<PublicLayout><PickupPage /></PublicLayout>} />
            <Route path="/experiences" element={<PublicLayout><ExperiencePage /></PublicLayout>} />
            <Route path="/private-chef" element={<PublicLayout><PrivateChefPage /></PublicLayout>} />
            <Route path="/partnership" element={<PublicLayout><PartnershipPage /></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
            <Route path="/secure-payments" element={<PublicLayout><SecurePayments /></PublicLayout>} />
            <Route path="/customer-service" element={<PublicLayout><CustomerService /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/search" element={<PublicLayout><SearchResults /></PublicLayout>} />
            <Route path="/chef/:chefId" element={<PublicLayout><ChefProfile /></PublicLayout>} />
            <Route path="/search-chefs" element={<PublicLayout><ChefSearch /></PublicLayout>} />
            <Route path="/hyr-ut-ditt-kok" element={<PublicLayout><HyrUtDittKokInfo /></PublicLayout>} />
            <Route path="/kitchen-partner/how-it-works" element={<PublicLayout><KitchenPartnerHowItWorks /></PublicLayout>} />
            <Route path="/kitchen-partner/pricing-terms" element={<PublicLayout><PricingTerms /></PublicLayout>} />
            <Route path="/kitchen-partner/security" element={<Navigate to="/kitchen-partner/security-insurance" replace />} />
            <Route path="/kitchen-partner/security-insurance" element={<PublicLayout><SecurityInsurance /></PublicLayout>} />
            <Route path="/kitchen-partner/support" element={<PublicLayout><PartnerSupport /></PublicLayout>} />
            <Route path="/restaurant" element={<PublicLayout><RestaurantPartnership /></PublicLayout>} />
            <Route path="/restaurant/partnership" element={<PublicLayout><RestaurantPartnership /></PublicLayout>} />
            <Route path="/auth" element={<PublicLayout><Auth /></PublicLayout>} />
            <Route path="/notification-signup" element={<PublicLayout><NotificationSignup /></PublicLayout>} />
            <Route path="/chef/application" element={<PublicLayout><ChefApplication /></PublicLayout>} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<RoleBasedLayout><Dashboard /></RoleBasedLayout>} />
            <Route path="/chef" element={<RoleBasedLayout><ChefHome /></RoleBasedLayout>} />
            <Route path="/chef/onboarding" element={<RoleBasedLayout><ChefOnboarding /></RoleBasedLayout>} />
            
            <Route path="/chef/application-pending" element={<RoleBasedLayout><ApplicationPending /></RoleBasedLayout>} />
            <Route path="/chef/dashboard" element={<RoleBasedLayout><ChefDashboard /></RoleBasedLayout>} />
            <Route path="/chef/private-services" element={<RoleBasedLayout><PrivateChefServices /></RoleBasedLayout>} />
            <Route path="/chef/experiences" element={<RoleBasedLayout><ChefExperiences /></RoleBasedLayout>} />
            <Route path="/chef/kitchen-requirements" element={<RoleBasedLayout><KitchenRequirements /></RoleBasedLayout>} />
            <Route path="/chef/kitchen-assessment" element={<RoleBasedLayout><KitchenAssessment /></RoleBasedLayout>} />
            <Route path="/chef/business-registration" element={<RoleBasedLayout><BusinessRegistration /></RoleBasedLayout>} />
            <Route path="/kitchen-partner/dashboard" element={<RoleBasedLayout><KitchenPartnerDashboard /></RoleBasedLayout>} />
            <Route path="/kitchen-partner/register" element={<RoleBasedLayout><KitchenPartnerOnboarding /></RoleBasedLayout>} />
            <Route path="/delivery-partner/onboarding" element={<RoleBasedLayout><DeliveryPartnerOnboarding /></RoleBasedLayout>} />
            <Route path="/admin/dashboard" element={<RoleBasedLayout><AdminDashboard /></RoleBasedLayout>} />
            <Route path="/restaurant/dashboard" element={<RoleBasedLayout><RestaurantDashboard /></RoleBasedLayout>} />
            <Route path="/restaurant/apply" element={<RoleBasedLayout><RestaurantApplicationForm /></RoleBasedLayout>} />
            <Route path="/profile" element={<RoleBasedLayout><Profile /></RoleBasedLayout>} />
            <Route path="/my-orders" element={<RoleBasedLayout><MyOrders /></RoleBasedLayout>} />
            <Route path="/my-points" element={<RoleBasedLayout><MyPoints /></RoleBasedLayout>} />
            <Route path="/settings" element={<RoleBasedLayout><SettingsPage /></RoleBasedLayout>} />
            <Route path="/settings/addresses" element={<RoleBasedLayout><DeliveryAddresses /></RoleBasedLayout>} />
            <Route path="/settings/payment-methods" element={<RoleBasedLayout><PaymentMethods /></RoleBasedLayout>} />
            <Route path="/settings/preferences" element={<RoleBasedLayout><Preferences /></RoleBasedLayout>} />

            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;