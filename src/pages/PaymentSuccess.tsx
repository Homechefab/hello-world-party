import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ReceiptText, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = useMemo(() => {
    const fromUrl = searchParams.get("session_id");
    if (fromUrl) return fromUrl;
    try {
      return typeof window !== 'undefined' ? window.sessionStorage.getItem('last_checkout_session_id') : null;
    } catch {
      return null;
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(true);
  const [generatingReceipt, setGeneratingReceipt] = useState(false);
  
  type PaymentLineItem = {
    description: string;
    quantity: number;
    amount_total: number;
    currency?: string;
  };

  type PaymentResult = {
    amount_total?: number;
    currency?: string;
    payment_status?: string;
    customer_email?: string;
    commission_report?: {
      total_amount: number;
      platform_fee: number;
      chef_earnings: number;
    };
    receipt_url?: string;
    line_items?: PaymentLineItem[];
  };

  const [result, setResult] = useState<PaymentResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        console.log("No session_id found in URL");
        setLoading(false);
        return;
      }
      console.log("Calling verify-payment with sessionId:", sessionId);
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId }
        });
        console.log("verify-payment response:", { data, error });
        if (error) throw new Error(error.message);
        setResult(data);
      } catch (err) {
        console.error("verify-payment error", err);
        toast({ title: "Kunde inte hämta kvitto", description: err instanceof Error ? err.message : "Okänt fel", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [sessionId, toast]);

  const handleViewCustomerReceipt = async () => {
    if (!sessionId) return;
    
    setGeneratingReceipt(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-customer-receipt", {
        body: { sessionId }
      });
      
      if (error) throw new Error(error.message);
      
      // Open HTML receipt in new window
      const blob = new Blob([data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      }
      
      toast({
        title: 'Kvitto öppnat',
        description: 'Använd Ctrl+P eller Cmd+P för att spara som PDF'
      });
      
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Error generating receipt:", err);
      toast({ 
        title: "Kunde inte generera kvitto", 
        description: err instanceof Error ? err.message : "Okänt fel", 
        variant: "destructive" 
      });
    } finally {
      setGeneratingReceipt(false);
    }
  };

  // Calculate displayed amounts
  const totalAmount = result?.amount_total ? result.amount_total / 100 : 0;
  const basePrice = totalAmount / 1.06;
  const serviceFee = totalAmount - basePrice;

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
            Betalning genomförd
          </CardTitle>
          <CardDescription>
            Tack! Din betalning har slutförts. Nedan finns sammanfattning och kvitto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Hämtar kvitto...
            </div>
          ) : (
            <>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Varupris:</span>
                  <span className="font-medium">
                    {basePrice.toLocaleString('sv-SE', { minimumFractionDigits: 2 })} kr
                  </span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Serviceavgift (6%):</span>
                  <span className="font-medium">
                    +{serviceFee.toLocaleString('sv-SE', { minimumFractionDigits: 2 })} kr
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Totalt betalt:</span>
                  <span>
                    {totalAmount.toLocaleString('sv-SE', { minimumFractionDigits: 2 })} kr
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>Status:</span>
                  <span className="font-medium text-green-600">{result?.payment_status === 'paid' ? 'Betald' : result?.payment_status || 'okänd'}</span>
                </div>
                <div className="flex justify-between">
                  <span>E-post:</span>
                  <span className="font-medium">{result?.customer_email || '—'}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 flex-wrap">
                <Button 
                  onClick={handleViewCustomerReceipt} 
                  disabled={generatingReceipt}
                  className="gap-2"
                >
                  {generatingReceipt ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ReceiptText className="w-4 h-4" />
                  )}
                  Visa & skriv ut kvitto
                </Button>
                {result?.receipt_url && (
                  <a href={result.receipt_url} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="gap-2">
                      <FileText className="w-4 h-4" /> Stripe-kvitto
                    </Button>
                  </a>
                )}
                <Link to="/">
                  <Button variant="outline">Till startsidan</Button>
                </Link>
              </div>

              {result?.line_items?.length ? (
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Artiklar</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {result.line_items.map((it: PaymentLineItem, idx: number) => (
                      <li key={idx}>
                        {it.description} × {it.quantity} — {(it.amount_total / 100).toLocaleString('sv-SE')} {it.currency?.toUpperCase?.()}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
