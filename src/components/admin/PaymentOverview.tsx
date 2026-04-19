import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, Wallet, RefreshCw, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface SwishPayment {
  id: string;
  instruction_id: string;
  amount: number;
  payer_alias: string;
  payee_alias: string;
  status: string;
  message: string | null;
  created_at: string;
  date_paid: string | null;
}

interface KlarnaPayment {
  id: string;
  klarna_order_id: string | null;
  amount: number;
  currency: string;
  customer_email: string | null;
  status: string;
  payment_method: string | null;
  created_at: string;
}

interface StripePayment {
  id: string;
  customer_email: string;
  dish_name: string;
  quantity: number;
  total_amount: number;
  platform_fee: number;
  chef_earnings: number;
  currency: string;
  payment_status: string;
  receipt_url: string | null;
  stripe_session_id: string;
  created_at: string;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    CREATED: { variant: "secondary", label: "Skapad" },
    PAID: { variant: "default", label: "Betald" },
    paid: { variant: "default", label: "Betald" },
    DECLINED: { variant: "destructive", label: "Nekad" },
    ERROR: { variant: "destructive", label: "Fel" },
    CANCELLED: { variant: "outline", label: "Avbruten" },
    checkout_incomplete: { variant: "secondary", label: "Pågående" },
    checkout_complete: { variant: "default", label: "Slutförd" },
    authorized: { variant: "default", label: "Auktoriserad" },
    captured: { variant: "default", label: "Betald" },
    pending: { variant: "secondary", label: "Pågående" },
    refunded: { variant: "outline", label: "Återbetald" },
    failed: { variant: "destructive", label: "Misslyckad" },
  };

  const config = statusMap[status] || { variant: "outline" as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const PaymentOverview = () => {
  const [swishPayments, setSwishPayments] = useState<SwishPayment[]>([]);
  const [klarnaPayments, setKlarnaPayments] = useState<KlarnaPayment[]>([]);
  const [stripePayments, setStripePayments] = useState<StripePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ swish: 0, klarna: 0, stripe: 0 });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const [swishResult, klarnaResult, stripeResult] = await Promise.all([
        supabase
          .from("swish_payments")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("klarna_payments")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("payment_transactions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),
      ]);

      if (swishResult.data) {
        setSwishPayments(swishResult.data);
        const swishTotal = swishResult.data
          .filter((p) => p.status === "PAID")
          .reduce((sum, p) => sum + Number(p.amount), 0);
        setTotals((prev) => ({ ...prev, swish: swishTotal }));
      }

      if (klarnaResult.data) {
        setKlarnaPayments(klarnaResult.data);
        const klarnaTotal = klarnaResult.data
          .filter((p) => p.status === "captured" || p.status === "checkout_complete")
          .reduce((sum, p) => sum + Number(p.amount) / 100, 0);
        setTotals((prev) => ({ ...prev, klarna: klarnaTotal }));
      }

      if (stripeResult.data) {
        setStripePayments(stripeResult.data);
        const stripeTotal = stripeResult.data
          .filter((p) => p.payment_status === "paid")
          .reduce((sum, p) => sum + Number(p.total_amount), 0);
        setTotals((prev) => ({ ...prev, stripe: stripeTotal }));
      }
    } catch (error) {
      console.error("Fel vid hämtning av betalningar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMM yyyy HH:mm", { locale: sv });
  };

  const openCustomerReceipt = async (sessionId: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-customer-receipt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        console.error('Receipt error:', await response.text());
        return;
      }

      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('Failed to open receipt:', error);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith("46")) {
      return `0${phone.slice(2)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const stripePaidCount = stripePayments.filter((p) => p.payment_status === "paid").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stripe (kort)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.stripe.toFixed(2)} kr</div>
            <p className="text-xs text-muted-foreground">
              {stripePaidCount} genomförda betalningar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Swish</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.swish.toFixed(2)} kr</div>
            <p className="text-xs text-muted-foreground">
              {swishPayments.filter((p) => p.status === "PAID").length} genomförda betalningar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klarna</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.klarna.toFixed(2)} kr</div>
            <p className="text-xs text-muted-foreground">
              {klarnaPayments.filter((p) => p.status === "captured" || p.status === "checkout_complete").length} genomförda betalningar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Betalningsöversikt</CardTitle>
              <CardDescription>Alla betalningar via Stripe, Swish och Klarna</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPayments}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Uppdatera
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stripe">
            <TabsList>
              <TabsTrigger value="stripe" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Stripe ({stripePayments.length})
              </TabsTrigger>
              <TabsTrigger value="swish" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Swish ({swishPayments.length})
              </TabsTrigger>
              <TabsTrigger value="klarna" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Klarna ({klarnaPayments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stripe" className="mt-4">
              {stripePayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Inga Stripe-betalningar ännu
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Kund</TableHead>
                        <TableHead>Rätt</TableHead>
                        <TableHead className="text-right">Totalt</TableHead>
                        <TableHead className="text-right">Avgift</TableHead>
                        <TableHead className="text-right">Kockens andel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Kvitto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stripePayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(payment.created_at)}
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate">
                            {payment.customer_email}
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate">
                            {payment.dish_name}
                            {payment.quantity > 1 && (
                              <span className="text-muted-foreground"> × {payment.quantity}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {Number(payment.total_amount).toFixed(2)} kr
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {Number(payment.platform_fee).toFixed(2)} kr
                          </TableCell>
                          <TableCell className="text-right">
                            {Number(payment.chef_earnings).toFixed(2)} kr
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openCustomerReceipt(payment.stripe_session_id)}
                              className="inline-flex items-center gap-1 text-primary hover:underline h-auto p-0"
                            >
                              Visa <ExternalLink className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="swish" className="mt-4">
              {swishPayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Inga Swish-betalningar ännu
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Betalare</TableHead>
                        <TableHead>Belopp</TableHead>
                        <TableHead>Meddelande</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {swishPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(payment.created_at)}
                          </TableCell>
                          <TableCell>{formatPhoneNumber(payment.payer_alias)}</TableCell>
                          <TableCell className="font-medium">
                            {Number(payment.amount).toFixed(2)} kr
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {payment.message || "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="klarna" className="mt-4">
              {klarnaPayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Inga Klarna-betalningar ännu
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>E-post</TableHead>
                        <TableHead>Belopp</TableHead>
                        <TableHead>Betalmetod</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {klarnaPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(payment.created_at)}
                          </TableCell>
                          <TableCell>{payment.customer_email || "-"}</TableCell>
                          <TableCell className="font-medium">
                            {(Number(payment.amount) / 100).toFixed(2)} {payment.currency}
                          </TableCell>
                          <TableCell>{payment.payment_method || "-"}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
