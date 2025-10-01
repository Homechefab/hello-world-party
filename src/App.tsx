import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
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
          <RoleBasedLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dish/:id" element={<DishPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/seller-guide" element={<SellerGuide />} />
              <Route path="/pickup" element={<PickupPage />} />
              <Route path="/experiences" element={<ExperiencePage />} />
              <Route path="/private-chef" element={<PrivateChefPage />} />
              <Route path="/partnership" element={<PartnershipPage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/secure-payments" element={<SecurePayments />} />
              <Route path="/customer-service" element={<CustomerService />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/chef/:chefId" element={<ChefProfile />} />
              <Route path="/search-chefs" element={<ChefSearch />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chef" element={<ChefHome />} />
              <Route path="/chef/onboarding" element={<ChefOnboarding />} />
              <Route path="/chef/application" element={<ChefApplication />} />
              <Route path="/chef/application-pending" element={<ApplicationPending />} />
              <Route path="/chef/dashboard" element={<ChefDashboard />} />
              <Route path="/chef/private-services" element={<PrivateChefServices />} />
              <Route path="/chef/experiences" element={<ChefExperiences />} />
              <Route path="/chef/kitchen-requirements" element={<KitchenRequirements />} />
              <Route path="/chef/kitchen-assessment" element={<KitchenAssessment />} />
              <Route path="/chef/business-registration" element={<BusinessRegistration />} />
              <Route path="/hyr-ut-ditt-kok" element={<HyrUtDittKokInfo />} />
              <Route path="/kitchen-partner/dashboard" element={<KitchenPartnerDashboard />} />
              <Route path="/kitchen-partner/register" element={<KitchenPartnerOnboarding />} />
              <Route path="/kitchen-partner/how-it-works" element={<KitchenPartnerHowItWorks />} />
              <Route path="/kitchen-partner/pricing-terms" element={<PricingTerms />} />
              <Route path="/kitchen-partner/security" element={<Navigate to="/kitchen-partner/security-insurance" replace />} />
              <Route path="/kitchen-partner/security-insurance" element={<SecurityInsurance />} />
              <Route path="/kitchen-partner/support" element={<PartnerSupport />} />
              <Route path="/delivery-partner/onboarding" element={<DeliveryPartnerOnboarding />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/restaurant" element={<RestaurantPartnership />} />
              <Route path="/restaurant/partnership" element={<RestaurantPartnership />} />
              <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
              <Route path="/restaurant/apply" element={<RestaurantApplicationForm />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/my-points" element={<MyPoints />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/addresses" element={<DeliveryAddresses />} />
              <Route path="/settings/payment-methods" element={<PaymentMethods />} />
              <Route path="/settings/preferences" element={<Preferences />} />
              <Route path="/notification-signup" element={<NotificationSignup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RoleBasedLayout>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;