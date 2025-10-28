import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
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

      {selectedSection === 'partners' ? (
        <div className="px-4">
          <div className="bg-background rounded-lg p-6 border">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Ansökningar från kökspartners</h2>
              <p className="text-sm text-muted-foreground">Se och hantera ansökningar</p>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-amber-500 text-2xl font-medium mb-1">0</p>
                <p className="text-sm text-muted-foreground">Väntar</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-emerald-500 text-2xl font-medium mb-1">0</p>
                <p className="text-sm text-muted-foreground">Godkända</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-rose-500 text-2xl font-medium mb-1">0</p>
                <p className="text-sm text-muted-foreground">Nekade</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2">
                <span>Väntar (0)</span>
                <span>Godkända (0)</span>
                <span>Avslagna (0)</span>
              </div>
              
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                Inga ansökningar väntar
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4 px-4">
          <div className="space-y-4">
            <button 
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
              onClick={() => setSelectedSection('chefs')}
            >
              <h3 className="text-sm font-medium">Kock-ansökningar</h3>
              <p className="text-xs text-muted-foreground mt-1">Ansökningar från kockar</p>
            </button>
            
            <div className="text-sm text-muted-foreground text-center p-4 border rounded-lg">
              Inga ansökningar att visa
            </div>
          </div>

          <div className="space-y-4">
            <button 
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
              onClick={() => setSelectedSection('partners')}
            >
              <h3 className="text-sm font-medium">Kökspartner-ansökningar</h3>
              <p className="text-xs text-muted-foreground mt-1">Nya kökspartners</p>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 border rounded-lg">
                <p className="text-amber-500 text-lg font-medium">0</p>
                <p className="text-xs text-muted-foreground">Väntar</p>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <p className="text-emerald-500 text-lg font-medium">0</p>
                <p className="text-xs text-muted-foreground">Godk.</p>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <p className="text-rose-500 text-lg font-medium">0</p>
                <p className="text-xs text-muted-foreground">Nekade</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
              onClick={() => setSelectedSection('users')}
            >
              <h3 className="text-sm font-medium">Användarhantering</h3>
              <p className="text-xs text-muted-foreground mt-1">Hantera användare</p>
            </button>

            <div className="text-sm text-muted-foreground text-center p-4 border rounded-lg">
              Ingen data att visa
            </div>
          </div>

          <div className="space-y-4">
            <button 
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
              onClick={() => setSelectedSection('complaints')}
            >
              <h3 className="text-sm font-medium">Klagomål</h3>
              <p className="text-xs text-muted-foreground mt-1">Rapporter och klagomål</p>
            </button>

            <div className="text-sm text-muted-foreground text-center p-4 border rounded-lg">
              Inga klagomål just nu
            </div>
          </div>

          <div className="space-y-4">
            <button 
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
              onClick={() => setSelectedSection('settings')}
            >
              <h3 className="text-sm font-medium">Inställningar</h3>
              <p className="text-xs text-muted-foreground mt-1">Systeminställningar</p>
            </button>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm">Godkännande</span>
                <span className="text-sm font-medium">Manuell</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm">Provision</span>
                <span className="text-sm font-medium">15%</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};