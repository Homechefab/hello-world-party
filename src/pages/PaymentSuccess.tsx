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
  const [result, setResult] = useState<any>(null);
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

              {result?.commission_report && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h3 className="font-semibold text-sm">Provisionsfördelning</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Totalt:</p>
                      <p className="font-medium">{result.commission_report.total_amount.toFixed(2)} {result.currency?.toUpperCase?.()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Provision (20%):</p>
                      <p className="font-medium text-blue-600">{result.commission_report.platform_fee.toFixed(2)} {result.currency?.toUpperCase?.()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kock (80%):</p>
                      <p className="font-medium text-green-600">{result.commission_report.chef_earnings.toFixed(2)} {result.currency?.toUpperCase?.()}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2 flex-wrap">
                {result?.receipt_url && (
                  <a href={result.receipt_url} target="_blank" rel="noreferrer">
                    <Button className="gap-2">
                      <ReceiptText className="w-4 h-4" /> Kundkvitto
                    </Button>
                  </a>
                )}
                {sessionId && (
                  <a 
                    href={`${import.meta.env.VITE_SUPABASE_URL || 'https://rkucenozpmaixfphpiub.supabase.co'}/functions/v1/generate-commission-report`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const { data, error } = await supabase.functions.invoke('generate-commission-report', {
                          body: { sessionId }
                        });
                        if (error) throw error;
                        // Open in new window
                        const blob = new Blob([data], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                      } catch (err) {
                        toast({ 
                          title: "Kunde inte generera provisionsunderlag", 
                          description: err instanceof Error ? err.message : "Okänt fel",
                          variant: "destructive" 
                        });
                      }
                    }}
                  >
                    <Button variant="outline" className="gap-2">
                      <ReceiptText className="w-4 h-4" /> Provisionsunderlag
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
                    {result.line_items.map((it: any, idx: number) => (
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
