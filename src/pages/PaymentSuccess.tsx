import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ReceiptText, Loader2 } from "lucide-react";
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
                  <span>Belopp:</span>
                  <span className="font-medium">
                    {result?.amount_total ? (result.amount_total / 100).toLocaleString('sv-SE') : '--'} {result?.currency?.toUpperCase?.() || 'SEK'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">{result?.payment_status || 'okänd'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kund:</span>
                  <span className="font-medium">{result?.customer_email || '—'}</span>
                </div>
              </div>


              <div className="flex gap-3 pt-2 flex-wrap">
                {result?.receipt_url && (
                  <a href={result.receipt_url} target="_blank" rel="noreferrer">
                    <Button className="gap-2">
                      <ReceiptText className="w-4 h-4" /> Visa kvitto
                    </Button>
                  </a>
                )}
                <Link to="/">
                  <Button variant="outline">Till startsidan</Button>
                </Link>
                <Link to="/payment-demo">
                  <Button variant="ghost">Testa en betalning till</Button>
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
