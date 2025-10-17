import { useState, useEffect } from "react";
import { Plus, CreditCard, Star, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  last_four: string | null;
  is_default: boolean;
}

const PaymentMethods = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'card',
    last_four: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id as string)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setPaymentMethods((data || []).map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        last_four: d.last_four ?? null,
        is_default: d.is_default ?? false,
      })));

    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Kunde inte hämta betalningsmetoder');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('Du måste vara inloggad för att spara en betalningsmetod.');
      return;
    }

    try {
      const paymentData = {
        ...formData,
        user_id: user.id,
      };

      const { error } = await supabase
        .from('payment_methods')
        .insert([paymentData]);
      
      if (error) throw error;
      
      toast.success('Betalningsmetod tillagd');
      setIsDialogOpen(false);
      resetForm();
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Kunde inte spara betalningsmetod');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Standardbetalning uppdaterad');
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error setting default:', error);
      toast.error('Kunde inte uppdatera standardbetalning');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Betalningsmetod borttagen');
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Kunde inte ta bort betalningsmetod');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'card',
      last_four: '',
      is_default: false
    });
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'card': return 'Kreditkort';
      case 'swish': return 'Swish';
      case 'paypal': return 'PayPal';
      case 'klarna': return 'Klarna';
      default: return type;
    }
  };

  const getPaymentIcon = () => {
    return <CreditCard className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-24 bg-secondary rounded"></div>
              <div className="h-24 bg-secondary rounded"></div>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Betalningsmetoder</h1>
            <p className="text-muted-foreground">Hantera dina sparade betalningsmetoder</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Lägg till betalningsmetod
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Lägg till betalningsmetod</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Namn</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="t.ex. Mitt Visa-kort"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Typ</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Kreditkort</SelectItem>
                      <SelectItem value="swish">Swish</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="klarna">Klarna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.type === 'card' && (
                  <div>
                    <Label htmlFor="last_four">Sista fyra siffror</Label>
                    <Input
                      id="last_four"
                      value={formData.last_four}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_four: e.target.value }))}
                      placeholder="1234"
                      maxLength={4}
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="is_default">Gör till standardbetalning</Label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button type="submit">
                    Lägg till
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Inga betalningsmetoder än</h3>
              <p className="text-muted-foreground text-center mb-4">
                Lägg till en betalningsmetod för att göra beställningar snabbare.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Lägg till betalningsmetod
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="relative">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-secondary rounded-lg">
                      {getPaymentIcon()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{method.name}</h3>
                        {method.is_default && (
                          <Badge variant="default" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Standard
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getPaymentTypeLabel(method.type)}
                        {method.last_four && ` •••• ${method.last_four}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Gör till standard
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(method.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;