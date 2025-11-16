import { useState, useEffect } from "react";
import { Plus, MapPin, Edit, Trash2, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DeliveryAddress {
  id: string;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const DeliveryAddresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    is_default: false
  });

  const fetchAddresses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select('*')
        .eq('user_id', user?.id as string)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses((data || []).map((d) => ({
        id: d.id,
        name: d.name,
        address_line1: d.address_line1,
        address_line2: d.address_line2 ?? null,
        city: d.city,
        postal_code: d.postal_code,
        country: d.country ?? 'Sweden',
        is_default: d.is_default ?? false,
      })));

    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Kunde inte hämta adresser');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [fetchAddresses, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('Du måste vara inloggad för att spara en adress.');
      return;
    }

    try {
      const addressData = {
        ...formData,
        user_id: user.id,
        country: 'Sweden',
      };

      if (editingAddress) {
        const { error } = await supabase
          .from('delivery_addresses')
          .update(addressData)
          .eq('id', editingAddress.id);
        
        if (error) throw error;
        toast.success('Adress uppdaterad');
      } else {
        const { error } = await supabase
          .from('delivery_addresses')
          .insert([addressData]);
        
        if (error) throw error;
        toast.success('Adress tillagd');
      }

      setIsDialogOpen(false);
      setEditingAddress(null);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Kunde inte spara adress');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { error } = await supabase
        .from('delivery_addresses')
        .update({ is_default: true })
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Standardadress uppdaterad');
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default:', error);
      toast.error('Kunde inte uppdatera standardadress');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('delivery_addresses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Adress borttagen');
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Kunde inte ta bort adress');
    }
  };

  const handleEdit = (address: DeliveryAddress) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      postal_code: address.postal_code,
      is_default: address.is_default
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      is_default: false
    });
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Leveransadresser</h1>
            <p className="text-muted-foreground">Hantera dina leveransadresser</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Lägg till adress
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? 'Redigera adress' : 'Lägg till ny adress'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Namn på adress</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="t.ex. Hem, Kontor"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address_line1">Adress</Label>
                  <Input
                    id="address_line1"
                    value={formData.address_line1}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_line1: e.target.value }))}
                    placeholder="Gatuadress och nummer"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address_line2">Adress rad 2 (valfri)</Label>
                  <Input
                    id="address_line2"
                    value={formData.address_line2}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_line2: e.target.value }))}
                    placeholder="Lägenhet, våning, etc."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postal_code">Postnummer</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                      placeholder="123 45"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Stad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Stockholm"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="is_default">Gör till standardadress</Label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button type="submit">
                    {editingAddress ? 'Uppdatera' : 'Lägg till'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Inga adresser än</h3>
              <p className="text-muted-foreground text-center mb-4">
                Lägg till din första leveransadress för att börja beställa mat.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Lägg till adress
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <Card key={address.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{address.name}</CardTitle>
                      {address.is_default && (
                        <Badge variant="default" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Standard
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(address)}
                        className="h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(address.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>{address.postal_code} {address.city}</p>
                    <p>{address.country}</p>
                  </div>
                  
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="mt-3"
                    >
                      Gör till standard
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryAddresses;