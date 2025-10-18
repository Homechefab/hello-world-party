import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  FileText,
  PieChart,
  BarChart3,
  Receipt,
  Calculator
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface IncomeData {
  totalRevenue: number;
  ordersCount: number;
  averageOrder: number;
  taxableAmount: number;
  monthlyBreakdown: { month: string; amount: number; orders: number }[];
  dishBreakdown: { dish: string; amount: number; orders: number }[];
}

const IncomeReports = () => {
  const [incomeData, setIncomeData] = useState<IncomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchIncomeData();
    }
  }, [user, selectedPeriod]);

  const fetchIncomeData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Get chef_id first
      const { data: chefData, error: chefError } = await supabase
        .from('chefs')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (chefError || !chefData) {
        // No chef profile found, show empty state
        setIncomeData({
          totalRevenue: 0,
          ordersCount: 0,
          averageOrder: 0,
          taxableAmount: 0,
          monthlyBreakdown: [],
          dishBreakdown: []
        });
        setLoading(false);
        return;
      }

      // Calculate date range based on selected period
      const now = new Date();
      let startDate = new Date();
      
      switch (selectedPeriod) {
        case 'current-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last-month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          break;
        case 'current-year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'last-year':
          startDate = new Date(now.getFullYear() - 1, 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), 0, 1);
      }

      // Fetch orders for the period
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          created_at,
          status,
          order_items (
            dish_id,
            quantity,
            unit_price,
            total_price,
            dishes (
              name,
              category
            )
          )
        `)
        .eq('chef_id', chefData.id)
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      if (ordersError) throw ordersError;

      // Process the data
      const processedData = processIncomeData(orders || []);
      setIncomeData(processedData);

    } catch (error) {
      console.error('Error fetching income data:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda intäktsdata",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processIncomeData = (orders: any[]): IncomeData => {
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    const ordersCount = orders.length;
    const averageOrder = ordersCount > 0 ? totalRevenue / ordersCount : 0;
    const taxableAmount = totalRevenue * 0.75; // Rough estimate after expenses

    // Monthly breakdown
    const monthlyMap = new Map<string, { amount: number; orders: number }>();
    
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = date.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { amount: 0, orders: 0 });
      }
      
      const current = monthlyMap.get(monthKey)!;
      current.amount += parseFloat(order.total_amount || 0);
      current.orders += 1;
    });

    const monthlyBreakdown = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      amount: data.amount,
      orders: data.orders
    }));

    // Dish breakdown
    const dishMap = new Map<string, { amount: number; orders: number }>();
    
    orders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        const dishName = item.dishes?.name || 'Okänd rätt';
        
        if (!dishMap.has(dishName)) {
          dishMap.set(dishName, { amount: 0, orders: 0 });
        }
        
        const current = dishMap.get(dishName)!;
        current.amount += parseFloat(item.total_price || 0);
        current.orders += item.quantity;
      });
    });

    const dishBreakdown = Array.from(dishMap.entries())
      .map(([dish, data]) => ({
        dish,
        amount: data.amount,
        orders: data.orders
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalRevenue,
      ordersCount,
      averageOrder,
      taxableAmount,
      monthlyBreakdown,
      dishBreakdown
    };
  };

  const exportToCSV = () => {
    if (!incomeData) return;

    const csvData = [
      ['Period', selectedPeriod],
      ['Total Revenue', `${incomeData.totalRevenue.toFixed(2)} kr`],
      ['Orders Count', incomeData.ordersCount.toString()],
      ['Average Order', `${incomeData.averageOrder.toFixed(2)} kr`],
      ['Estimated Taxable Amount', `${incomeData.taxableAmount.toFixed(2)} kr`],
      [''],
      ['Monthly Breakdown:'],
      ['Month', 'Revenue', 'Orders'],
      ...incomeData.monthlyBreakdown.map(item => [
        item.month,
        `${item.amount.toFixed(2)} kr`,
        item.orders.toString()
      ]),
      [''],
      ['Dish Breakdown:'],
      ['Dish', 'Revenue', 'Orders'],
      ...incomeData.dishBreakdown.map(item => [
        item.dish,
        `${item.amount.toFixed(2)} kr`,
        item.orders.toString()
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `intaktsrapport-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export klar",
      description: "Intäktsrapporten har exporterats till CSV-fil",
    });
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'current-month': return 'Denna månad';
      case 'last-month': return 'Förra månaden';
      case 'current-year': return 'Detta år';
      case 'last-year': return 'Förra året';
      default: return 'Detta år';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Laddar intäktsdata...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Intäktsrapporter</h1>
          <p className="text-muted-foreground">
            Få en överblick över dina inkomster och hjälp med bokföring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Välj period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Denna månad</SelectItem>
              <SelectItem value="last-month">Förra månaden</SelectItem>
              <SelectItem value="current-year">Detta år</SelectItem>
              <SelectItem value="last-year">Förra året</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportera CSV
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Intäkt</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {incomeData?.totalRevenue.toLocaleString('sv-SE')} kr
            </div>
            <p className="text-xs text-muted-foreground">
              {getPeriodLabel(selectedPeriod)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beställningar</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incomeData?.ordersCount}</div>
            <p className="text-xs text-muted-foreground">
              Genomsnitt: {incomeData?.averageOrder.toFixed(0)} kr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skattepliktigt</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {incomeData?.taxableAmount.toLocaleString('sv-SE')} kr
            </div>
            <p className="text-xs text-muted-foreground">
              Uppskattat efter avdrag
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Aktiv</div>
            <p className="text-xs text-muted-foreground">
              Alla beställningar
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Översikt
          </TabsTrigger>
          <TabsTrigger value="monthly">
            <Calendar className="w-4 h-4 mr-2" />
            Månadsvis
          </TabsTrigger>
          <TabsTrigger value="dishes">
            <PieChart className="w-4 h-4 mr-2" />
            Per rätt
          </TabsTrigger>
          <TabsTrigger value="tax-help">
            <FileText className="w-4 h-4 mr-2" />
            Skattehjälp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intäktsöversikt - {getPeriodLabel(selectedPeriod)}</CardTitle>
              <CardDescription>
                Sammanfattning av dina intäkter och viktiga nyckeltal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {incomeData?.totalRevenue === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Inga intäkter än</h3>
                  <p className="text-muted-foreground">
                    Du har inga genomförda beställningar för vald period.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Försäljningsstatistik</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bruttointäkt:</span>
                        <span className="font-medium">{incomeData?.totalRevenue.toLocaleString('sv-SE')} kr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Antal beställningar:</span>
                        <span className="font-medium">{incomeData?.ordersCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Genomsnittlig beställning:</span>
                        <span className="font-medium">{incomeData?.averageOrder.toFixed(0)} kr</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Skatteuppskattning</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uppskattat skattepliktigt:</span>
                        <span className="font-medium">{incomeData?.taxableAmount.toLocaleString('sv-SE')} kr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preliminär skatt (30%):</span>
                        <span className="font-medium">{((incomeData?.taxableAmount || 0) * 0.3).toLocaleString('sv-SE')} kr</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * Detta är endast en uppskattning. Konsultera alltid en revisor för exakt beräkning.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Månadsvis uppdelning</CardTitle>
              <CardDescription>
                Intäkter och beställningar per månad
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incomeData?.monthlyBreakdown.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Inga data för vald period</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomeData?.monthlyBreakdown.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{month.month}</h4>
                        <p className="text-sm text-muted-foreground">{month.orders} beställningar</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{month.amount.toLocaleString('sv-SE')} kr</div>
                        <div className="text-sm text-muted-foreground">
                          Snitt: {(month.amount / (month.orders || 1)).toFixed(0)} kr
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dishes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intäkter per rätt</CardTitle>
              <CardDescription>
                Vilka rätter genererar mest intäkter
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incomeData?.dishBreakdown.length === 0 ? (
                <div className="text-center py-8">
                  <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Inga rätter sålda för vald period</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomeData?.dishBreakdown.map((dish, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div>
                          <h4 className="font-semibold">{dish.dish}</h4>
                          <p className="text-sm text-muted-foreground">{dish.orders} sålda</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{dish.amount.toLocaleString('sv-SE')} kr</div>
                        <div className="text-sm text-muted-foreground">
                          {((dish.amount / (incomeData?.totalRevenue || 1)) * 100).toFixed(1)}% av total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skattehjälp och bokföring</CardTitle>
              <CardDescription>
                Information och tips för att hantera skatter och bokföring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Viktiga avdrag för kockar</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Ingredienser och råvaror (100%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Köksredskap och utrustning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Förpackningsmaterial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Hemkontorskostnader (del av el, värme)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Utbildning och certifieringar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Marknadsföring och annonsering</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Bokföringstips</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Spara alla kvitton digitalt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Använd bankens kategorifunktion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Exportera denna rapport månadsvis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Dokumentera alla affärsresor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Håll privat och företag isär</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-blue-800 mb-1">Rekommendation</h5>
                    <p className="text-sm text-blue-700">
                      Konsultera alltid en kvalificerad revisor eller skatterådgivare för personlig vägledning. 
                      Denna information är endast vägledande och ersätter inte professionell rådgivning.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={exportToCSV} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Exportera för revisor
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Kontakta revisor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncomeReports;