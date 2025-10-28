import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
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

      <Tabs defaultValue="chefs" className="w-full px-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chefs" className="text-sm">Kock-ansökningar</TabsTrigger>
          <TabsTrigger value="partners" className="text-sm">Kökspartner-ansökningar</TabsTrigger>
          <TabsTrigger value="users" className="text-sm">Användarhantering</TabsTrigger>
          <TabsTrigger value="complaints" className="text-sm">Klagomål</TabsTrigger>
          <TabsTrigger value="settings" className="text-sm">Inställningar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chefs" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Kock-ansökningar</h3>
            <p className="text-sm text-muted-foreground">Ansökningar från kockar</p>
          </div>
          
          <div className="h-[120px] flex items-center justify-center border rounded-lg">
            <p className="text-sm text-muted-foreground">Inga ansökningar att visa</p>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Kökspartner-ansökningar</h3>
            <p className="text-sm text-muted-foreground">Nya kökspartners</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center py-3 px-2 border rounded-lg">
                <p className="text-amber-500 text-lg font-medium mb-1">0</p>
                <p className="text-xs text-muted-foreground">Väntar</p>
              </div>
              <div className="text-center py-3 px-2 border rounded-lg">
                <p className="text-emerald-500 text-lg font-medium mb-1">0</p>
                <p className="text-xs text-muted-foreground">Godk.</p>
              </div>
              <div className="text-center py-3 px-2 border rounded-lg">
                <p className="text-rose-500 text-lg font-medium mb-1">0</p>
                <p className="text-xs text-muted-foreground">Nekade</p>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              <p>Inga ansökningar väntar</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Användarhantering</h3>
            <p className="text-sm text-muted-foreground">Hantera användare</p>
          </div>

          <div className="h-[120px] flex items-center justify-center border rounded-lg">
            <p className="text-sm text-muted-foreground">Ingen data att visa</p>
          </div>
        </TabsContent>

        <TabsContent value="complaints" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Klagomål</h3>
            <p className="text-sm text-muted-foreground">Rapporter och klagomål</p>
          </div>

          <div className="h-[120px] flex items-center justify-center border rounded-lg">
            <p className="text-sm text-muted-foreground">Inga klagomål just nu</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Inställningar</h3>
            <p className="text-sm text-muted-foreground">Systeminställningar</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-4 py-3 border rounded-lg">
              <span className="text-sm">Godkännande</span>
              <span className="text-sm font-medium">Manuell</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border rounded-lg">
              <span className="text-sm">Provision</span>
              <span className="text-sm font-medium">15%</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
};