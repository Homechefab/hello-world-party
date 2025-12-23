import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import useEdgeSwipeBack from "@/hooks/useEdgeSwipeBack";
import useAutoSafeArea from "@/hooks/useAutoSafeArea";
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
import CateringPage from "./pages/CateringPage";
import MealBoxesPage from "./pages/MealBoxesPage";
import PartnershipPage from "./pages/PartnershipPage";
import HowItWorks from "./pages/HowItWorks";
import HyrUtDittKokInfo from "@/pages/kitchen-partner/HyrUtDittKokInfo";
import SecurePayments from "./pages/SecurePayments";
import CustomerService from "./pages/CustomerService";
import About from "./pages/About";
import { ChefDashboard } from "./pages/chef/ChefDashboard";
import { ChefOnboarding } from "./pages/chef/ChefOnboarding";
import ChefWelcomeGuide from "./pages/chef/ChefWelcomeGuide";
import ChefApplication from "./pages/chef/ChefApplication";
import ApplicationPending from "./pages/chef/ApplicationPending";
import ApplicationStatus from "./pages/chef/ApplicationStatus";
import PrivateChefServices from "./pages/chef/PrivateChefServices";
import CateringServices from "./pages/chef/CateringServices";
import MealBoxes from "./pages/chef/MealBoxes";
import ChefExperiences from "./pages/chef/ChefExperiences";
import KitchenRequirements from "./pages/chef/KitchenRequirements";
import MunicipalityRequirements from "./pages/chef/MunicipalityRequirements";
import KitchenAssessment from "./pages/chef/KitchenAssessment";
import ChefHome from "./pages/chef/ChefHome";
import BusinessRegistration from "./pages/chef/BusinessRegistration";
import ChefForum from "./pages/chef/ChefForum";
import ChefOfTheMonth from "./pages/chef/ChefOfTheMonth";
import SalesStatistics from "./pages/chef/SalesStatistics";
import Mentorship from "./pages/chef/Mentorship";
import { KitchenPartnerDashboard } from "./pages/kitchen-partner/KitchenPartnerDashboard";
import { KitchenPartnerOnboarding } from "./pages/kitchen-partner/KitchenPartnerOnboarding";
import KitchenPartnerApplicationPending from "./pages/kitchen-partner/ApplicationPending";
import KitchenPartnerHowItWorks from "./pages/kitchen-partner/HowItWorks";
import PricingTerms from "./pages/kitchen-partner/PricingTerms";
import PartnerSupport from "./pages/kitchen-partner/PartnerSupport";
import DeliveryPartnerOnboarding from "./pages/delivery-partner/DeliveryPartnerOnboarding";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import RestaurantPartnership from "./pages/restaurant/RestaurantPartnership";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import RestaurantApplicationForm from "./pages/restaurant/RestaurantApplicationForm";
import RestaurantApplication from "./pages/restaurant/RestaurantApplication";
import RestaurantApplicationPending from "./pages/restaurant/ApplicationPending";
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
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import Privacy from "./pages/Privacy";
import DataDeletion from "./pages/DataDeletion";
import Terms from "./pages/Terms";
import Press from "./pages/Press";
import Referral from "./pages/Referral";
import BusinessServicesPage from "./pages/business/BusinessServices";

const queryClient = new QueryClient();

const App = () => {
  console.log('App.tsx: App component rendering');
  // enable left-edge right-swipe to go back on mobile webviews
  useEdgeSwipeBack();
  // auto-adjust fixed/absolute elements so they don't hide under notches / dynamic island
  useAutoSafeArea();
  console.log('App.tsx: Hooks initialized, rendering routes');
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Routes>

            {/* Public routes */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/dish/:id" element={<PublicLayout><DishPage /></PublicLayout>} />
            <Route path="/sell" element={<PublicLayout><SellPage /></PublicLayout>} />
            <Route path="/seller-guide" element={<PublicLayout><SellerGuide /></PublicLayout>} />
            <Route path="/pickup" element={<PublicLayout><PickupPage /></PublicLayout>} />
            <Route path="/experiences" element={<PublicLayout><ExperiencePage /></PublicLayout>} />
            <Route path="/private-chef" element={<PublicLayout><PrivateChefPage /></PublicLayout>} />
            <Route path="/catering" element={<PublicLayout><CateringPage /></PublicLayout>} />
            <Route path="/meal-boxes" element={<PublicLayout><MealBoxesPage /></PublicLayout>} />
            <Route path="/partnership" element={<PublicLayout><PartnershipPage /></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
            <Route path="/secure-payments" element={<PublicLayout><SecurePayments /></PublicLayout>} />
            <Route path="/customer-service" element={<PublicLayout><CustomerService /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/search" element={<PublicLayout><SearchResults /></PublicLayout>} />
            <Route path="/chef/:chefId" element={<PublicLayout><ChefProfile /></PublicLayout>} />
            <Route path="/search-chefs" element={<PublicLayout><ChefSearch /></PublicLayout>} />
            <Route path="/hyr-ut-ditt-kok" element={<PublicLayout><HyrUtDittKokInfo /></PublicLayout>} />
            <Route path="/kitchen-partner/hyr-ut-ditt-kok" element={<PublicLayout><HyrUtDittKokInfo /></PublicLayout>} />
            <Route path="/kitchen-partner/how-it-works" element={<PublicLayout><KitchenPartnerHowItWorks /></PublicLayout>} />
            <Route path="/kitchen-partner/pricing-terms" element={<PublicLayout><PricingTerms /></PublicLayout>} />
            <Route path="/kitchen-partner/support" element={<PublicLayout><PartnerSupport /></PublicLayout>} />
            <Route path="/restaurant" element={<PublicLayout><RestaurantPartnership /></PublicLayout>} />
            <Route path="/restaurant/partnership" element={<PublicLayout><RestaurantPartnership /></PublicLayout>} />
            <Route path="/restaurant/application" element={<PublicLayout><RestaurantApplication /></PublicLayout>} />
            <Route path="/auth" element={<PublicLayout><Auth /></PublicLayout>} />
            <Route path="/notification-signup" element={<PublicLayout><NotificationSignup /></PublicLayout>} />
            <Route path="/chef/application" element={<PublicLayout><ChefApplication /></PublicLayout>} />
            <Route path="/chef/safety-rules" element={<PublicLayout><KitchenRequirements /></PublicLayout>} />
            <Route path="/chef/application-status" element={<RoleBasedLayout><ApplicationStatus /></RoleBasedLayout>} />
            
            <Route path="/payment-success" element={<PublicLayout><PaymentSuccess /></PublicLayout>} />
            <Route path="/payment-canceled" element={<PublicLayout><PaymentCanceled /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
            <Route path="/privacy-policy" element={<PublicLayout><Privacy /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
            <Route path="/terms-of-service" element={<PublicLayout><Terms /></PublicLayout>} />
            <Route path="/data-deletion" element={<PublicLayout><DataDeletion /></PublicLayout>} />
            <Route path="/press" element={<PublicLayout><Press /></PublicLayout>} />
            <Route path="/referral" element={<PublicLayout><Referral /></PublicLayout>} />
            <Route path="/bjud-in-vanner" element={<PublicLayout><Referral /></PublicLayout>} />
            <Route path="/business" element={<PublicLayout><BusinessServicesPage /></PublicLayout>} />

            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={<RoleBasedLayout><Dashboard /></RoleBasedLayout>} />
            
            {/* Chef public info pages - anyone can view */}
            <Route path="/chef" element={<PublicLayout><ChefHome /></PublicLayout>} />
            <Route path="/chef/onboarding" element={<PublicLayout><ChefOnboarding /></PublicLayout>} />
            <Route path="/chef/welcome" element={<PublicLayout><ChefWelcomeGuide /></PublicLayout>} />
            <Route path="/chef/private-services" element={<PublicLayout><PrivateChefServices /></PublicLayout>} />
            <Route path="/chef/catering" element={<PublicLayout><CateringServices /></PublicLayout>} />
            <Route path="/chef/meal-boxes" element={<PublicLayout><MealBoxes /></PublicLayout>} />
            <Route path="/chef/experiences" element={<PublicLayout><ChefExperiences /></PublicLayout>} />
            <Route path="/chef/kitchen-requirements" element={<PublicLayout><KitchenRequirements /></PublicLayout>} />
            <Route path="/chef/municipality-requirements" element={<PublicLayout><MunicipalityRequirements /></PublicLayout>} />
            <Route path="/chef/kitchen-assessment" element={<PublicLayout><KitchenAssessment /></PublicLayout>} />
            <Route path="/chef/business-registration" element={<PublicLayout><BusinessRegistration /></PublicLayout>} />
            <Route path="/chef/kockforum" element={<PublicLayout><ChefForum /></PublicLayout>} />
            <Route path="/chef/manadens-kock" element={<PublicLayout><ChefOfTheMonth /></PublicLayout>} />
            <Route path="/chef/forsaljningsstatistik" element={<PublicLayout><SalesStatistics /></PublicLayout>} />
            <Route path="/chef/mentorskap" element={<PublicLayout><Mentorship /></PublicLayout>} />
            
            {/* Chef protected routes - require approved chef role */}
            <Route path="/chef/application-pending" element={<PublicLayout><ApplicationPending /></PublicLayout>} />
            <Route path="/chef/dashboard" element={<RoleBasedLayout><ChefDashboard /></RoleBasedLayout>} />
            
            {/* Kitchen partner public info - anyone can view */}
            <Route path="/kitchen-partner/register" element={<PublicLayout><KitchenPartnerOnboarding /></PublicLayout>} />
            
            {/* Kitchen partner protected routes */}
            <Route path="/kitchen-partner/application-pending" element={<PublicLayout><KitchenPartnerApplicationPending /></PublicLayout>} />
            <Route path="/kitchen-partner/dashboard" element={<RoleBasedLayout><KitchenPartnerDashboard /></RoleBasedLayout>} />
            
            {/* Restaurant protected routes */}
            <Route path="/restaurant/application-pending" element={<PublicLayout><RestaurantApplicationPending /></PublicLayout>} />
            <Route path="/restaurant/dashboard" element={<RoleBasedLayout><RestaurantDashboard /></RoleBasedLayout>} />
            <Route path="/restaurant/apply" element={<PublicLayout><RestaurantApplicationForm /></PublicLayout>} />
            
            {/* Other protected routes */}
            <Route path="/delivery-partner/onboarding" element={<PublicLayout><DeliveryPartnerOnboarding /></PublicLayout>} />
            <Route path="/admin/dashboard" element={<RoleBasedLayout><AdminDashboard /></RoleBasedLayout>} />
            <Route path="/profile" element={<RoleBasedLayout><Profile /></RoleBasedLayout>} />
            <Route path="/my-orders" element={<RoleBasedLayout><MyOrders /></RoleBasedLayout>} />
            <Route path="/my-points" element={<RoleBasedLayout><MyPoints /></RoleBasedLayout>} />
            <Route path="/settings" element={<RoleBasedLayout><SettingsPage /></RoleBasedLayout>} />
            <Route path="/settings/addresses" element={<RoleBasedLayout><DeliveryAddresses /></RoleBasedLayout>} />
            <Route path="/settings/payment-methods" element={<RoleBasedLayout><PaymentMethods /></RoleBasedLayout>} />
            <Route path="/settings/preferences" element={<RoleBasedLayout><Preferences /></RoleBasedLayout>} />

            {/* Fallback */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />

        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};


export default App;