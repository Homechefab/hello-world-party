import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const ReceiptFlowTester = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: unknown } | null>(null);

  const runTest = async () => {
    if (!email) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("test-receipt-flow", {
        body: { email },
      });
      if (error) throw error;
      setResult({
        success: true,
        message: `Test-kvitto skickat till ${email}. Kolla inkorgen (och skräppost).`,
        details: data,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setResult({ success: false, message: `Test misslyckades: ${msg}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Test: Kvitto- & bekräftelseflöde
        </CardTitle>
        <CardDescription>
          Skapar en simulerad transaktion och skickar ett riktigt kvittomejl via Resend.
          Verifierar att e-postmallen, Edge-funktionen och databasen fungerar – utan riktig betalning.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-email">E-postadress att skicka test-kvitto till</Label>
          <Input
            id="test-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.se"
          />
        </div>

        <Button onClick={runTest} disabled={loading || !email} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Skickar test...
            </>
          ) : (
            "Kör test"
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? "Lyckades!" : "Misslyckades"}</AlertTitle>
            <AlertDescription>
              {result.message}
              {result.success && (
                <p className="mt-2 text-xs text-muted-foreground">
                  En testtransaktion på 159 kr ("TEST – Hemgjord glass 4 dl") har skapats i payment_transactions.
                  Du kan radera den manuellt senare om du vill.
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
