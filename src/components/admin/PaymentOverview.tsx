import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, Wallet, RefreshCw } from "lucide-react";
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

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    CREATED: { variant: "secondary", label: "Skapad" },
    PAID: { variant: "default", label: "Betald" },
    DECLINED: { variant: "destructive", label: "Nekad" },
    ERROR: { variant: "destructive", label: "Fel" },
    CANCELLED: { variant: "outline", label: "Avbruten" },
    checkout_incomplete: { variant: "secondary", label: "Pågående" },
    checkout_complete: { variant: "default", label: "Slutförd" },
    authorized: { variant: "default", label: "Auktoriserad" },
    captured: { variant: "default", label: "Betald" },
  };

  const config = statusMap[status] || { variant: "outline" as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const PaymentOverview = () => {
  const [swishPayments, setSwishPayments] = useState<SwishPayment[]>([]);
  const [klarnaPayments, setKlarnaPayments] = useState<KlarnaPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ swish: 0, klarna: 0 });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const [swishResult, klarnaResult] = await Promise.all([
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Swish-betalningar</CardTitle>
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
            <CardTitle className="text-sm font-medium">Klarna-betalningar</CardTitle>
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
              <CardDescription>Alla Swish- och Klarna-betalningar</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPayments}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Uppdatera
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="swish">
            <TabsList>
              <TabsTrigger value="swish" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Swish ({swishPayments.length})
              </TabsTrigger>
              <TabsTrigger value="klarna" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Klarna ({klarnaPayments.length})
              </TabsTrigger>
            </TabsList>

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
