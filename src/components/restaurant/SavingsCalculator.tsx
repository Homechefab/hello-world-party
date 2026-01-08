import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingDown, Percent, Banknote } from "lucide-react";

const SavingsCalculator = () => {
  const [ordersPerDay, setOrdersPerDay] = useState(15);
  const [avgOrderValue, setAvgOrderValue] = useState(200);

  const calculations = useMemo(() => {
    const ordersPerMonth = ordersPerDay * 30;
    const monthlyRevenue = ordersPerMonth * avgOrderValue;
    
    // Competitor cost (30% commission)
    const competitorCommission = 0.30;
    const competitorMonthlyCost = monthlyRevenue * competitorCommission;
    const competitorYearlyCost = competitorMonthlyCost * 12;

    // Determine which Homechef plan fits
    let homechefPlan = "Liten";
    let homechefMonthlyCost = 5399;
    
    if (ordersPerDay > 30) {
      homechefPlan = "Stor";
      homechefMonthlyCost = 26999;
    } else if (ordersPerDay > 15) {
      homechefPlan = "Medelstor";
      homechefMonthlyCost = 13499;
    }

    const homechefYearlyCost = homechefMonthlyCost * 12;

    // Savings
    const monthlySavings = competitorMonthlyCost - homechefMonthlyCost;
    const yearlySavings = competitorYearlyCost - homechefYearlyCost;
    const savingsPercent = ((competitorMonthlyCost - homechefMonthlyCost) / competitorMonthlyCost) * 100;

    return {
      ordersPerMonth,
      monthlyRevenue,
      competitorMonthlyCost,
      competitorYearlyCost,
      homechefPlan,
      homechefMonthlyCost,
      homechefYearlyCost,
      monthlySavings,
      yearlySavings,
      savingsPercent: Math.max(0, savingsPercent)
    };
  }, [ordersPerDay, avgOrderValue]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', { 
      style: 'currency', 
      currency: 'SEK',
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="text-center">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-7 h-7 text-primary" />
        </div>
        <CardTitle className="text-2xl">Beräkna din besparing</CardTitle>
        <CardDescription>
          Se hur mycket ni kan spara jämfört med provisionsbaserade plattformar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Sliders */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Antal ordrar per dag</label>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {ordersPerDay} ordrar
              </Badge>
            </div>
            <Slider
              value={[ordersPerDay]}
              onValueChange={(value) => setOrdersPerDay(value[0])}
              min={1}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 order</span>
              <span>100 ordrar</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Genomsnittligt ordervärde</label>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {avgOrderValue} kr
              </Badge>
            </div>
            <Slider
              value={[avgOrderValue]}
              onValueChange={(value) => setAvgOrderValue(value[0])}
              min={50}
              max={500}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50 kr</span>
              <span>500 kr</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Competitor card */}
          <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Provisionsmodell (30%)</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(calculations.competitorMonthlyCost)}
              </p>
              <p className="text-xs text-muted-foreground">per månad</p>
              <p className="text-sm mt-2 text-red-600/80 dark:text-red-400/80">
                {formatCurrency(calculations.competitorYearlyCost)}/år
              </p>
            </CardContent>
          </Card>

          {/* Homechef card */}
          <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Homechef ({calculations.homechefPlan})</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(calculations.homechefMonthlyCost)}
              </p>
              <p className="text-xs text-muted-foreground">per månad</p>
              <p className="text-sm mt-2 text-green-600/80 dark:text-green-400/80">
                {formatCurrency(calculations.homechefYearlyCost)}/år
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Savings summary */}
        {calculations.monthlySavings > 0 && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <TrendingDown className="w-6 h-6 text-green-600" />
              <span className="text-lg font-medium">Er besparing</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <Banknote className="w-4 h-4" />
                  <span className="text-xs font-medium">Per månad</span>
                </div>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(calculations.monthlySavings)}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <Banknote className="w-4 h-4" />
                  <span className="text-xs font-medium">Per år</span>
                </div>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(calculations.yearlySavings)}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <Percent className="w-4 h-4" />
                  <span className="text-xs font-medium">Billigare</span>
                </div>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {calculations.savingsPercent.toFixed(0)}%
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Med {calculations.ordersPerMonth} ordrar/månad à {avgOrderValue} kr
            </p>
          </div>
        )}

        {calculations.monthlySavings <= 0 && (
          <div className="bg-muted/50 rounded-xl p-6 text-center">
            <p className="text-muted-foreground">
              Vid denna volym rekommenderar vi vår Liten-plan för {formatCurrency(5399)}/mån
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsCalculator;
