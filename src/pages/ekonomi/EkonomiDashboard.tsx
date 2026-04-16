import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Download, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  dish_name: string;
  quantity: number;
  total_amount: number;
  platform_fee: number;
  chef_earnings: number;
  currency: string;
  payment_status: string;
  created_at: string;
  chef_id: string | null;
}

interface Chef {
  id: string;
  business_name: string;
  contact_email: string | null;
  full_name: string | null;
}

interface ChefMonthlySummary {
  chefName: string;
  chefId: string;
  contactEmail: string;
  totalEarnings: number;
  platformFees: number;
  totalSales: number;
  transactionCount: number;
  dishes: string[];
}

export const EkonomiDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedChef, setSelectedChef] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, chefRes] = await Promise.all([
        supabase.from('payment_transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('chefs').select('id, business_name, contact_email, full_name')
      ]);
      if (txRes.error) throw txRes.error;
      if (chefRes.error) throw chefRes.error;
      setTransactions(txRes.data || []);
      setChefs(chefRes.data || []);
    } catch (error) {
      console.error('Fel vid hämtning:', error);
      toast({ title: 'Kunde inte hämta data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const chefMap = useMemo(() => {
    const map = new Map<string, Chef>();
    chefs.forEach(c => map.set(c.id, c));
    return map;
  }, [chefs]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    transactions.forEach(t => {
      const d = new Date(t.created_at);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.created_at);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (month !== selectedMonth) return false;
      if (selectedChef !== 'all' && t.chef_id !== selectedChef) return false;
      return true;
    });
  }, [transactions, selectedMonth, selectedChef]);

  const chefSummaries: ChefMonthlySummary[] = useMemo(() => {
    const map = new Map<string, ChefMonthlySummary>();

    filteredTransactions.forEach(t => {
      const key = t.chef_id || 'unknown';
      const chef = t.chef_id ? chefMap.get(t.chef_id) : null;
      const existing = map.get(key) || {
        chefName: chef?.business_name || chef?.full_name || 'Okänd säljare',
        chefId: key,
        contactEmail: chef?.contact_email || '',
        totalEarnings: 0,
        platformFees: 0,
        totalSales: 0,
        transactionCount: 0,
        dishes: [],
      };
      existing.totalEarnings += t.chef_earnings;
      existing.platformFees += t.platform_fee;
      existing.totalSales += t.total_amount;
      existing.transactionCount += 1;
      if (!existing.dishes.includes(t.dish_name)) {
        existing.dishes.push(t.dish_name);
      }
      map.set(key, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.totalEarnings - a.totalEarnings);
  }, [filteredTransactions, chefMap]);

  const monthTotals = useMemo(() => ({
    revenue: filteredTransactions.reduce((s, t) => s + t.total_amount, 0),
    platformFees: filteredTransactions.reduce((s, t) => s + t.platform_fee, 0),
    chefEarnings: filteredTransactions.reduce((s, t) => s + t.chef_earnings, 0),
    count: filteredTransactions.length,
  }), [filteredTransactions]);

  const formatMonth = (m: string) => {
    const [year, month] = m.split('-');
    const months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const exportCSV = () => {
    const header = 'Kock,Mejl,Datum,Kund,Rätt,Antal,Totalt,Homechef avgift,Till säljare,Valuta,Status\n';
    const rows = filteredTransactions.map(t => {
      const chef = t.chef_id ? chefMap.get(t.chef_id) : null;
      const chefName = chef?.business_name || chef?.full_name || 'Okänd';
      const chefEmail = chef?.contact_email || '';
      return `${chefName},${chefEmail},${new Date(t.created_at).toLocaleDateString('sv-SE')},${t.customer_email},${t.dish_name},${t.quantity},${t.total_amount},${t.platform_fee},${t.chef_earnings},${t.currency},${t.payment_status}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ekonomi-rapport-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ekonomi</h1>
          <p className="text-muted-foreground">Automatiskt ekonomiskt underlag per kock och månad</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map(m => (
                <SelectItem key={m} value={m}>{formatMonth(m)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedChef} onValueChange={setSelectedChef}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Alla kockar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla kockar</SelectItem>
              {chefs.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.business_name || c.full_name || 'Okänd'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total omsättning</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthTotals.revenue.toFixed(2)} SEK</div>
            <p className="text-xs text-muted-foreground">{monthTotals.count} transaktioner</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Homechef intäkter</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{monthTotals.platformFees.toFixed(2)} SEK</div>
            <p className="text-xs text-muted-foreground">6% kundavgift + 19% provision</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Säljarnas intäkter</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">{monthTotals.chefEarnings.toFixed(2)} SEK</div>
            <p className="text-xs text-muted-foreground">81% av angivna priser</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Aktiva kockar</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chefSummaries.length}</div>
            <p className="text-xs text-muted-foreground">med försäljning denna månad</p>
          </CardContent>
        </Card>
      </div>

      {/* Chef earnings summary */}
      <Card>
        <CardHeader>
          <CardTitle>Kockrapport — {formatMonth(selectedMonth)}</CardTitle>
          <CardDescription>Intäkter per kock denna månad. Rapporten skickas automatiskt till kockens mejl i slutet av varje månad.</CardDescription>
        </CardHeader>
        <CardContent>
          {chefSummaries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Inga transaktioner denna månad</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kock</TableHead>
                    <TableHead>Mejl</TableHead>
                    <TableHead>Rätter</TableHead>
                    <TableHead className="text-right">Antal köp</TableHead>
                    <TableHead className="text-right">Total försäljning</TableHead>
                    <TableHead className="text-right">Homechef avgift</TableHead>
                    <TableHead className="text-right">Kockens intäkt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chefSummaries.map((summary) => (
                    <TableRow key={summary.chefId}>
                      <TableCell className="font-medium">{summary.chefName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">{summary.contactEmail || '—'}</TableCell>
                      <TableCell className="text-sm max-w-[200px]">
                        {summary.dishes.slice(0, 3).join(', ')}
                        {summary.dishes.length > 3 && ` +${summary.dishes.length - 3}`}
                      </TableCell>
                      <TableCell className="text-right">{summary.transactionCount}</TableCell>
                      <TableCell className="text-right">{summary.totalSales.toFixed(2)} SEK</TableCell>
                      <TableCell className="text-right text-primary">{summary.platformFees.toFixed(2)} SEK</TableCell>
                      <TableCell className="text-right font-semibold">{summary.totalEarnings.toFixed(2)} SEK</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Detaljerade transaktioner</CardTitle>
          <CardDescription>Alla betalningar för {formatMonth(selectedMonth)}</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Inga transaktioner denna månad</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Kock</TableHead>
                    <TableHead>Kund</TableHead>
                    <TableHead>Rätt</TableHead>
                    <TableHead className="text-right">Totalt</TableHead>
                    <TableHead className="text-right">Homechef</TableHead>
                    <TableHead className="text-right">Till kock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((t) => {
                    const chef = t.chef_id ? chefMap.get(t.chef_id) : null;
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(t.created_at).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}
                        </TableCell>
                        <TableCell className="font-medium">{chef?.business_name || chef?.full_name || '—'}</TableCell>
                        <TableCell className="max-w-[120px] truncate">{t.customer_email}</TableCell>
                        <TableCell>{t.dish_name} × {t.quantity}</TableCell>
                        <TableCell className="text-right font-medium">{t.total_amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-primary">{t.platform_fee.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold">{t.chef_earnings.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={t.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {t.payment_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EkonomiDashboard;
