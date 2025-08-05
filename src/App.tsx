import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { useRole } from "@/hooks/useRole";
import Index from "./pages/Index";
import DishPage from "./pages/DishPage";
import SellPage from "./pages/SellPage";
import SellerGuide from "./pages/SellerGuide";
import Dashboard from "./pages/Dashboard";
import ChefSearch from "./pages/ChefSearch";
import PickupPage from "./pages/PickupPage";
import ExperiencePage from "./pages/ExperiencePage";
import PrivateChefPage from "./pages/PrivateChefPage";
import PartnershipPage from "./pages/PartnershipPage";
import HowItWorks from "./pages/HowItWorks";
import SecurePayments from "./pages/SecurePayments";
import CustomerService from "./pages/CustomerService";
import About from "./pages/About";
import { ChefDashboard } from "./pages/chef/ChefDashboard";
import { ChefOnboarding } from "./pages/chef/ChefOnboarding";
import ChefApplication from "./pages/chef/ChefApplication";
import ApplicationPending from "./pages/chef/ApplicationPending";
import { KitchenPartnerDashboard } from "./pages/kitchen-partner/KitchenPartnerDashboard";
import { KitchenPartnerOnboarding } from "./pages/kitchen-partner/KitchenPartnerOnboarding";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import NotificationSignup from "./pages/NotificationSignup";

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
              <Route path="/search-chefs" element={<ChefSearch />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chef/onboarding" element={<ChefOnboarding />} />
              <Route path="/chef/application" element={<ChefApplication />} />
              <Route path="/chef/application-pending" element={<ApplicationPending />} />
              <Route path="/chef/dashboard" element={<ChefDashboard />} />
              <Route path="/kitchen-partner/dashboard" element={<KitchenPartnerDashboard />} />
              <Route path="/kitchen-partner/register" element={<KitchenPartnerOnboarding />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
