import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefApprovalManager } from '@/components/admin/ChefApprovalManager';
import { KitchenPartnerApprovalManager } from '@/components/admin/KitchenPartnerApprovalManager';
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

  const statsCards = [
    { title: 'Antal användare', icon: Users, value: stats.totalUsers, subtitle: 'Aktiva användare' },
    { title: 'Väntar på granskning', icon: Clock, value: stats.pendingApprovals, subtitle: 'Ansökningar att kolla' },
    { title: 'Klagomål', icon: AlertTriangle, value: stats.activeComplaints, subtitle: 'Behöver åtgärdas' },
    { title: 'Godkända', icon: CheckCircle, value: stats.completedOnboardings, subtitle: 'Godkända användare' },
    { title: 'Omsättning', icon: DollarSign, value: `${stats.totalRevenue} kr`, subtitle: 'Denna månad' },
    { title: 'Pågående beställningar', icon: TrendingUp, value: stats.activeOrders, subtitle: 'Just nu' }
  ];

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
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-5 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Kock-ansökningar</CardTitle>
              <CardDescription>Ansökningar från kockar</CardDescription>
            </CardHeader>
            <CardContent>
              <ChefApprovalManager />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Kökspartner-ansökningar</CardTitle>
              <CardDescription>Nya kökspartners</CardDescription>
            </CardHeader>
            <CardContent>
              <KitchenPartnerApprovalManager />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Användarhantering</CardTitle>
              <CardDescription>Hantera användare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Ingen data att visa
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Klagomål</CardTitle>
              <CardDescription>Rapporter och klagomål</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Inga klagomål just nu
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Inställningar</CardTitle>
              <CardDescription>Systeminställningar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Godkännande</span>
                  <Button variant="outline" size="sm">Manuell</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Provision</span>
                  <Button variant="outline" size="sm">15%</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};