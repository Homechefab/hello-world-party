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
import Dashboard from "./pages/Dashboard";
import { ChefDashboard } from "./pages/chef/ChefDashboard";
import { ChefOnboarding } from "./pages/chef/ChefOnboarding";
import { KitchenPartnerDashboard } from "./pages/kitchen-partner/KitchenPartnerDashboard";
import { KitchenPartnerOnboarding } from "./pages/kitchen-partner/KitchenPartnerOnboarding";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface AppContentProps {
  user: any;
  isChef: boolean;
  isKitchenPartner: boolean;
  isAdmin: boolean;
}

const AppContent = ({ user, isChef, isKitchenPartner, isAdmin }: AppContentProps) => {
  console.log('AppContent: user=', user, 'isChef=', isChef, 'isKitchenPartner=', isKitchenPartner, 'isAdmin=', isAdmin);

  // Role-based routing
  if (isChef && !user?.onboarding_completed) {
    return <ChefOnboarding />;
  }

  if (isChef) {
    return (
      <Routes>
        <Route path="/" element={<ChefDashboard />} />
        <Route path="/chef/dashboard" element={<ChefDashboard />} />
        <Route path="/chef/onboarding" element={<ChefOnboarding />} />
        <Route path="*" element={<ChefDashboard />} />
      </Routes>
    );
  }

  if (isKitchenPartner) {
    return (
      <Routes>
        <Route path="/" element={<KitchenPartnerDashboard />} />
        <Route path="/kitchen-partner/dashboard" element={<KitchenPartnerDashboard />} />
        <Route path="*" element={<KitchenPartnerDashboard />} />
      </Routes>
    );
  }

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<AdminDashboard />} />
      </Routes>
    );
  }

  // Customer routes (default)
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dish/:id" element={<DishPage />} />
      <Route path="/sell" element={<SellPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chef/dashboard" element={<ChefDashboard />} />
              <Route path="/chef/onboarding" element={<ChefOnboarding />} />
              <Route path="/kitchen-partner/dashboard" element={<KitchenPartnerDashboard />} />
              <Route path="/kitchen-partner/register" element={<KitchenPartnerOnboarding />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
