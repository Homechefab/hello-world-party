import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReceiptText, Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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
  receipt_url: string | null;
}

export const CommissionReports = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Fel vid hämtning av transaktioner:', error);
      toast({
        title: 'Kunde inte hämta transaktioner',
        description: error instanceof Error ? error.message : 'Okänt fel',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-commission-report', {
        body: { sessionId }
      });
      if (error) throw error;
      
      // Open HTML report in new window for printing as PDF
      const blob = new Blob([data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      
      // Add print dialog after content loads
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 250);
        };
      }
      
      toast({
        title: 'Rapport öppnad',
        description: 'Använd Ctrl+P eller Cmd+P för att spara som PDF'
      });
      
      // Clean up after a delay
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      toast({ 
        title: 'Kunde inte generera rapport', 
        description: err instanceof Error ? err.message : 'Okänt fel',
        variant: 'destructive' 
      });
    }
  };

  const totalPlatformFees = transactions.reduce((sum, t) => sum + t.platform_fee, 0);
  const totalChefEarnings = transactions.reduce((sum, t) => sum + t.chef_earnings, 0);
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total_amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total omsättning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} SEK</div>
            <p className="text-xs text-muted-foreground">{transactions.length} transaktioner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Homechef intäkter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalPlatformFees.toFixed(2)} SEK</div>
            <p className="text-xs text-muted-foreground">6% kundavgift + 19% säljarprovisioner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Säljarnas intäkter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalChefEarnings.toFixed(2)} SEK</div>
            <p className="text-xs text-muted-foreground">81% av angivna priser</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provisionsunderlag</CardTitle>
          <CardDescription>Alla transaktioner med provisionsfördelning</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Inga transaktioner än</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Kund</TableHead>
                    <TableHead>Rätt</TableHead>
                    <TableHead className="text-right">Totalt</TableHead>
                    <TableHead className="text-right">Homechef</TableHead>
                    <TableHead className="text-right">Till säljare</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(transaction.created_at).toLocaleString('sv-SE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>{transaction.customer_email}</TableCell>
                      <TableCell>
                        {transaction.dish_name} × {transaction.quantity}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {transaction.total_amount.toFixed(2)} {transaction.currency}
                      </TableCell>
                      <TableCell className="text-right text-primary font-medium">
                        {transaction.platform_fee.toFixed(2)} {transaction.currency}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {transaction.chef_earnings.toFixed(2)} {transaction.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {transaction.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {transaction.receipt_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(transaction.receipt_url!, '_blank')}
                            >
                              <ReceiptText className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => generateReport(transaction.stripe_session_id)}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
