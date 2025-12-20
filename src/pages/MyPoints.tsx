import { useState, useEffect, useCallback } from "react";
import { Gift, Star, TrendingUp, ShoppingBag, Calendar, Award, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface UserPoints {
  id: string;
  total_points: number | null;
  current_points: number | null;
  points_used: number | null;
  total_purchases: number | null;
  next_discount_at: number | null;
}

interface PointsTransaction {
  id: string;
  transaction_type: string;
  points_amount: number;
  description: string | null;
  created_at: string;
}

const MyPoints = () => {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPoints = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setUserPoints(data);
      } else {
        // Create initial points record if doesn't exist
        const { data: newRecord, error: insertError } = await supabase
          .from('user_points')
          .insert([{
            user_id: user.id,
            total_points: 0,
            current_points: 0,
            points_used: 0,
            total_purchases: 0,
            next_discount_at: 5
          }])
          .select()
          .maybeSingle();

        if (insertError) throw insertError;
        setUserPoints(newRecord);
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
      toast.error('Kunde inte hämta poänginformation');
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Kunde inte hämta transaktioner');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserPoints();
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [fetchTransactions, fetchUserPoints, user]);

  const getProgressToNextDiscount = () => {
    if (!userPoints) return 0;
    const purchasesToNext = (userPoints.next_discount_at || 5) - (userPoints.total_purchases || 0);
    const progress = Math.max(0, 100 - (purchasesToNext / 5) * 100);
    return progress;
  };

  const getPurchasesToNextDiscount = () => {
    if (!userPoints) return 5;
    return Math.max(0, (userPoints.next_discount_at || 5) - (userPoints.total_purchases || 0));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'used': return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'discount_applied': return <Award className="w-4 h-4 text-purple-600" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-600';
      case 'used': return 'text-blue-600';
      case 'discount_applied': return 'text-purple-600';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-32 bg-secondary rounded"></div>
              <div className="h-48 bg-secondary rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Mina poäng</h1>
            <p className="text-muted-foreground">Samla poäng och få rabatter på dina köp</p>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Points Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {userPoints?.current_points || 0}
                </div>
                <p className="text-sm text-muted-foreground text-center">Tillgängliga poäng</p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">1 poäng = 10 kr</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {userPoints?.total_points || 0}
                </div>
                <p className="text-sm text-muted-foreground text-center">Totalt intjänade poäng</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {userPoints?.total_purchases || 0}
                </div>
                <p className="text-sm text-muted-foreground text-center">Totalt antal köp</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress to Next Discount */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Nästa rabatt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Framsteg till 10% rabatt</span>
                    <span className="text-sm text-muted-foreground">
                      {getPurchasesToNextDiscount()} köp kvar
                    </span>
                  </div>
                  <Progress value={getProgressToNextDiscount()} className="w-full" />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {getPurchasesToNextDiscount() === 0 ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <Award className="w-4 h-4" />
                      Du får 10% rabatt på ditt nästa köp!
                    </div>
                  ) : (
                    `Köp ${getPurchasesToNextDiscount()} till för att få 10% rabatt på ditt nästa köp (varje 5:e köp)`
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How Points Work */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-blue-600" />
                Så fungerar poängsystemet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Tjäna poäng</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>1 poäng för varje 10 kr du handlar</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Poäng läggs till automatiskt efter köp</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Få rabatter</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>10% rabatt på varje 5:e köp</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Rabatten tillämpas automatiskt</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Senaste transaktioner
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Inga transaktioner än</p>
                  <p className="text-sm text-muted-foreground">
                    Gör ditt första köp för att börja samla poäng!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.transaction_type)}
                        <div>
                          <p className="font-medium text-sm">{transaction.description || 'Transaktion'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString('sv-SE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className={`font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
                        {transaction.transaction_type === 'earned' ? '+' : ''}
                        {transaction.points_amount} poäng
                      </div>
                    </div>
                  ))}
                  
                  {transactions.length > 10 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" size="sm">
                        Visa alla transaktioner
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Snabblänkar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <Link to="/">
                    <ShoppingBag className="w-5 h-5 mb-2" />
                    <span className="text-sm">Handla mat</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <Link to="/my-orders">
                    <Calendar className="w-5 h-5 mb-2" />
                    <span className="text-sm">Mina köp</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <Link to="/settings/preferences">
                    <Star className="w-5 h-5 mb-2" />
                    <span className="text-sm">Preferenser</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <Link to="/settings">
                    <Gift className="w-5 h-5 mb-2" />
                    <span className="text-sm">Inställningar</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyPoints;
