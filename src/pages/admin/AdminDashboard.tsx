import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChefApprovalManager } from '@/components/admin/ChefApprovalManager';
import { KitchenPartnerApprovalManager } from '@/components/admin/KitchenPartnerApprovalManager';
import { LoginLogsViewer } from '@/components/admin/LoginLogsViewer';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export const AdminDashboard = () => {
  
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

      // Hämta godkända användare
      const { count: approvedChefs } = await supabase
        .from('chefs')
        .select('*', { count: 'exact', head: true })
        .eq('kitchen_approved', true);

      const { count: approvedPartners } = await supabase
        .from('kitchen_partners')
        .select('*', { count: 'exact', head: true })
        .eq('approved', true);

      setStats({
        totalUsers: userCount || 0,
        pendingApprovals: (pendingChefs || 0) + (pendingPartners || 0),
        activeComplaints: 0, // Detta kan vi implementera senare
        completedOnboardings: (approvedChefs || 0) + (approvedPartners || 0),
        totalRevenue: 0, // Implementera när vi har orders
        activeOrders: 0 // Implementera när vi har orders
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-8">
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

      <Tabs defaultValue="chefs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="chefs">Kock-ansökningar</TabsTrigger>
          <TabsTrigger value="kitchen-partners">Kökspartner-ansökningar</TabsTrigger>
          <TabsTrigger value="users">Användarhantering</TabsTrigger>
          <TabsTrigger value="logins">Inloggningar</TabsTrigger>
          <TabsTrigger value="complaints">Klagomål</TabsTrigger>
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
        </TabsList>

        <TabsContent value="chefs">
          <ChefApprovalManager />
        </TabsContent>

        <TabsContent value="kitchen-partners">
          <KitchenPartnerApprovalManager />
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Användarhantering</CardTitle>
              <CardDescription>Se alla användare på plattformen</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funktionen kommer snart...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logins">
          <LoginLogsViewer />
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
                  <span>Provision (%)</span>
                  <Button variant="outline" size="sm">15%</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
};