import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefApprovalManager } from '@/components/admin/ChefApprovalManager';
import { KitchenPartnerApprovalManager } from '@/components/admin/KitchenPartnerApprovalManager';
import { RestaurantApprovalManager } from '@/components/admin/RestaurantApprovalManager';
import { BusinessApprovalManager } from '@/components/admin/BusinessApprovalManager';
import { LoginLogsViewer } from '@/components/admin/LoginLogsViewer';
import { UserManagement } from '@/components/admin/UserManagement';
import { CommissionReports } from '@/components/admin/CommissionReports';
import { PaymentOverview } from '@/components/admin/PaymentOverview';
import { EarlyAccessSignups } from '@/components/admin/EarlyAccessSignups';
import { OnboardingMaterials } from '@/components/admin/OnboardingMaterials';
import Visitors from '@/pages/admin/Visitors';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  CreditCard,
  Bell,
  Building2,
  FileText,
  Eye
} from 'lucide-react';

export const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'chefs';
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeComplaints: 0,
    completedOnboardings: 0,
    totalRevenue: 0,
    activeOrders: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Hämta användarstatistik
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Hämta väntande ansökningar
      const { count: pendingChefs } = await supabase
        .from('chefs')
        .select('*', { count: 'exact', head: true })
        .eq('kitchen_approved', false);

      const { count: pendingPartners } = await supabase
        .from('kitchen_partners')
        .select('*', { count: 'exact', head: true })
        .eq('approved', false);

      const { count: pendingRestaurants } = await supabase
        .from('restaurants')
        .select('*', { count: 'exact', head: true })
        .eq('approved', false);

      const { count: pendingBusiness } = await supabase
        .from('business_partners')
        .select('*', { count: 'exact', head: true })
        .eq('application_status', 'pending');

      // Hämta godkända användare
      const { count: approvedChefs } = await supabase
        .from('chefs')
        .select('*', { count: 'exact', head: true })
        .eq('kitchen_approved', true);

      const { count: approvedPartners } = await supabase
        .from('kitchen_partners')
        .select('*', { count: 'exact', head: true })
        .eq('approved', true);

      const { count: approvedRestaurants } = await supabase
        .from('restaurants')
        .select('*', { count: 'exact', head: true })
        .eq('approved', true);

      const { count: approvedBusiness } = await supabase
        .from('business_partners')
        .select('*', { count: 'exact', head: true })
        .eq('application_status', 'approved');

      setStats({
        totalUsers: userCount || 0,
        pendingApprovals: (pendingChefs || 0) + (pendingPartners || 0) + (pendingRestaurants || 0) + (pendingBusiness || 0),
        activeComplaints: 0,
        completedOnboardings: (approvedChefs || 0) + (approvedPartners || 0) + (approvedRestaurants || 0) + (approvedBusiness || 0),
        totalRevenue: 0,
        activeOrders: 0
      });
    } catch (error) {
      console.error('Fel vid hämtning av statistik:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Adminpanel</h1>
        <p className="text-muted-foreground">Översikt och hantering av plattformen</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Antal användare</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Aktiva användare</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Väntar på granskning</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Ansökningar att kolla</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klagomål</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeComplaints}</div>
            <p className="text-xs text-muted-foreground">Behöver åtgärdas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Godkända</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOnboardings}</div>
            <p className="text-xs text-muted-foreground">Godkända användare</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Omsättning</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue} kr</div>
            <p className="text-xs text-muted-foreground">Denna månad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pågående beställningar</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">Just nu</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="inline-flex w-full overflow-x-auto flex-nowrap justify-start h-auto p-1">
          <TabsTrigger value="chefs" className="whitespace-nowrap">
            <span className="hidden sm:inline">Kock-ansökningar</span>
            <span className="sm:hidden">Kockar</span>
          </TabsTrigger>
          <TabsTrigger value="kitchen-partners" className="whitespace-nowrap">
            <span className="hidden sm:inline">Kökspartner-ansökningar</span>
            <span className="sm:hidden">Kökspartners</span>
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="whitespace-nowrap">
            <span className="hidden sm:inline">Restaurang-ansökningar</span>
            <span className="sm:hidden">Restauranger</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="whitespace-nowrap">
            <Building2 className="h-4 w-4 mr-1 hidden sm:inline" />
            <span className="hidden sm:inline">Företag</span>
            <span className="sm:hidden">Företag</span>
          </TabsTrigger>
          <TabsTrigger value="archive" className="whitespace-nowrap">Arkiv</TabsTrigger>
          <TabsTrigger value="early-access" className="whitespace-nowrap">
            <Bell className="h-4 w-4 mr-1 hidden sm:inline" />
            <span className="hidden sm:inline">Early Access</span>
            <span className="sm:hidden">Early</span>
          </TabsTrigger>
          <TabsTrigger value="commission" className="whitespace-nowrap">Provisionsunderlag</TabsTrigger>
          <TabsTrigger value="payments" className="whitespace-nowrap">
            <CreditCard className="h-4 w-4 mr-1 hidden sm:inline" />
            <span className="hidden sm:inline">Betalningar</span>
            <span className="sm:hidden">Betal.</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="whitespace-nowrap">
            <span className="hidden sm:inline">Användarhantering</span>
            <span className="sm:hidden">Användare</span>
          </TabsTrigger>
          <TabsTrigger value="logins" className="whitespace-nowrap">Inloggningar</TabsTrigger>
          <TabsTrigger value="onboarding" className="whitespace-nowrap">
            <FileText className="h-4 w-4 mr-1 hidden sm:inline" />
            <span className="hidden sm:inline">Onboarding</span>
            <span className="sm:hidden">Onb.</span>
          </TabsTrigger>
          <TabsTrigger value="complaints" className="whitespace-nowrap">Klagomål</TabsTrigger>
          <TabsTrigger value="visitors" className="whitespace-nowrap">
            <Eye className="h-4 w-4 mr-1 hidden sm:inline" />
            <span className="hidden sm:inline">Besökare</span>
            <span className="sm:hidden">Besök</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="whitespace-nowrap">
            <span className="hidden sm:inline">Inställningar</span>
            <span className="sm:hidden">Inst.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chefs">
          <ChefApprovalManager showArchived={false} />
        </TabsContent>

        <TabsContent value="kitchen-partners">
          <KitchenPartnerApprovalManager />
        </TabsContent>

        <TabsContent value="restaurants">
          <RestaurantApprovalManager />
        </TabsContent>

        <TabsContent value="business">
          <BusinessApprovalManager />
        </TabsContent>

        <TabsContent value="archive">
          <Card>
            <CardHeader>
              <CardTitle>Arkiverade ansökningar</CardTitle>
              <CardDescription>Alla hanterade ansökningar (godkända och nekade)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChefApprovalManager showArchived={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="early-access">
          <EarlyAccessSignups />
        </TabsContent>

        <TabsContent value="commission">
          <CommissionReports />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentOverview />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="logins">
          <LoginLogsViewer />
        </TabsContent>

        <TabsContent value="onboarding">
          <OnboardingMaterials />
        </TabsContent>

        <TabsContent value="complaints">
          <Card>
            <CardHeader>
              <CardTitle>Klagomålshantering</CardTitle>
              <CardDescription>Se och hantera klagomål</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inga klagomål just nu.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitors">
          <Visitors />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Inställningar</CardTitle>
              <CardDescription>Ställ in systemparametrar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Automatiskt godkännande av kockar</span>
                  <Button variant="outline" size="sm">Inaktiverad</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Minimipris per rätt</span>
                  <Button variant="outline" size="sm">50 kr</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kundavgift</span>
                  <Button variant="outline" size="sm">6%</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Säljarprovisioner</span>
                  <Button variant="outline" size="sm">19%</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
};