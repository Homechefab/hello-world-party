import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Store, 
  TrendingUp, 
  Package,
  Star,
  Plus,
  Edit,
  Trash2,
  Loader2
} from "lucide-react";

interface Restaurant {
  id: string;
  business_name: string;
  approved: boolean | null;
  application_status: string | null;
}

interface Dish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  available: boolean | null;
  preparation_time: number | null;
}

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [dishDialogOpen, setDishDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [savingDish, setSavingDish] = useState(false);
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparation_time: ''
  });

  useEffect(() => {
    checkRestaurantStatus();
  }, []);

  const checkRestaurantStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: restaurantData, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!restaurantData) {
        navigate('/restaurant/apply');
        return;
      }

      if (restaurantData.application_status === 'pending') {
        toast({
          title: "Ansökan väntar",
          description: "Din ansökan granskas fortfarande",
        });
        navigate('/restaurant/partnership');
        return;
      }

      if (!restaurantData.approved) {
        toast({
          title: "Inte godkänd",
          description: "Din restaurang har inte godkänts än",
          variant: "destructive"
        });
        navigate('/restaurant/partnership');
        return;
      }

      setRestaurant({
        ...restaurantData,
        approved: restaurantData.approved ?? false,
        application_status: restaurantData.application_status ?? 'pending'
      });
      loadDishes(restaurantData.id);
    } catch (error) {
      console.error('Error checking restaurant status:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda restaurangdata",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDishes = async (restaurantId: string) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_dishes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Transform to match Dish interface with default values
      const transformedDishes = (data || []).map(d => ({
        ...d,
        available: d.available ?? true
      }));
      setDishes(transformedDishes);
    } catch (error) {
      console.error('Error loading dishes:', error);
    }
  };

  const openDishDialog = (dish?: Dish) => {
    if (dish) {
      setEditingDish(dish);
      setDishForm({
        name: dish.name,
        description: dish.description || '',
        price: dish.price.toString(),
        category: dish.category || '',
        preparation_time: dish.preparation_time?.toString() || ''
      });
    } else {
      setEditingDish(null);
      setDishForm({
        name: '',
        description: '',
        price: '',
        category: '',
        preparation_time: ''
      });
    }
    setDishDialogOpen(true);
  };

  const saveDish = async () => {
    if (!restaurant || !dishForm.name || !dishForm.price) {
      toast({
        title: "Fält saknas",
        description: "Namn och pris måste fyllas i",
        variant: "destructive"
      });
      return;
    }

    setSavingDish(true);
    try {
      const dishData = {
        restaurant_id: restaurant.id,
        name: dishForm.name,
        description: dishForm.description,
        price: parseFloat(dishForm.price),
        category: dishForm.category,
        preparation_time: dishForm.preparation_time ? parseInt(dishForm.preparation_time) : null,
        available: true
      };

      if (editingDish) {
        const { error } = await supabase
          .from('restaurant_dishes')
          .update(dishData)
          .eq('id', editingDish.id);

        if (error) throw error;

        toast({
          title: "Uppdaterad!",
          description: "Rätten har uppdaterats"
        });
      } else {
        const { error } = await supabase
          .from('restaurant_dishes')
          .insert(dishData);

        if (error) throw error;

        toast({
          title: "Skapad!",
          description: "Rätten har lagts till"
        });
      }

      setDishDialogOpen(false);
      loadDishes(restaurant.id);
    } catch (error) {
      console.error('Error saving dish:', error);
      toast({
        title: "Fel",
        description: "Kunde inte spara rätt",
        variant: "destructive"
      });
    } finally {
      setSavingDish(false);
    }
  };

  const toggleDishAvailability = async (dishId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('restaurant_dishes')
        .update({ available: !currentStatus })
        .eq('id', dishId);

      if (error) throw error;

      setDishes(prev => prev.map(d => 
        d.id === dishId ? { ...d, available: !currentStatus } : d
      ));

      toast({
        title: "Uppdaterad",
        description: `Rätten är nu ${!currentStatus ? 'tillgänglig' : 'otillgänglig'}`
      });
    } catch (error) {
      console.error('Error toggling dish:', error);
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera rätt",
        variant: "destructive"
      });
    }
  };

  const deleteDish = async (dishId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna rätt?')) return;

    try {
      const { error } = await supabase
        .from('restaurant_dishes')
        .delete()
        .eq('id', dishId);

      if (error) throw error;

      setDishes(prev => prev.filter(d => d.id !== dishId));
      toast({
        title: "Borttagen",
        description: "Rätten har tagits bort"
      });
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ta bort rätt",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  const stats = {
    totalDishes: dishes.length,
    availableDishes: dishes.filter(d => d.available).length,
    totalOrders: 0,
    avgRating: 4.7
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{restaurant.business_name}</h1>
          <p className="text-muted-foreground">Restaurangdashboard</p>
        </div>
        <Button onClick={() => openDishDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Lägg till rätt
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala rätter</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDishes}</div>
            <p className="text-xs text-muted-foreground">Varav {stats.availableDishes} tillgängliga</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beställningar</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Denna månad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Betyg</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating}/5</div>
            <p className="text-xs text-muted-foreground">Genomsnitt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500">Godkänd</Badge>
            <p className="text-xs text-muted-foreground mt-2">Kan sälja mat</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Management */}
      <Tabs defaultValue="dishes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dishes">Mina rätter</TabsTrigger>
          <TabsTrigger value="orders">Beställningar</TabsTrigger>
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
        </TabsList>

        <TabsContent value="dishes" className="space-y-6">
          {dishes.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">Du har inga rätter än</p>
                <Button onClick={() => openDishDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Lägg till din första rätt
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dishes.map(dish => (
                <Card key={dish.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{dish.description}</CardDescription>
                      </div>
                      <Badge variant={dish.available ? "default" : "secondary"}>
                        {dish.available ? 'Tillgänglig' : 'Ej tillgänglig'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{dish.price} kr</span>
                        {dish.category && (
                          <Badge variant="outline">{dish.category}</Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openDishDialog(dish)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Redigera
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleDishAvailability(dish.id, dish.available ?? false)}
                        >
                          {dish.available ? 'Inaktivera' : 'Aktivera'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteDish(dish.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Beställningar</CardTitle>
              <CardDescription>Kommande beställningar visas här</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inga beställningar än...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Restauranginställningar</CardTitle>
              <CardDescription>Hantera din restaurangprofil</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inställningar kommer här...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dish Dialog */}
      <Dialog open={dishDialogOpen} onOpenChange={setDishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDish ? 'Redigera rätt' : 'Lägg till rätt'}</DialogTitle>
            <DialogDescription>
              Fyll i information om rätten
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="dishName">Namn *</Label>
              <Input
                id="dishName"
                value={dishForm.name}
                onChange={(e) => setDishForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Pasta Carbonara"
              />
            </div>

            <div>
              <Label htmlFor="dishDescription">Beskrivning</Label>
              <Textarea
                id="dishDescription"
                value={dishForm.description}
                onChange={(e) => setDishForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beskriv rätten..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dishPrice">Pris (kr) *</Label>
                <Input
                  id="dishPrice"
                  type="number"
                  value={dishForm.price}
                  onChange={(e) => setDishForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="150"
                />
              </div>

              <div>
                <Label htmlFor="dishCategory">Kategori</Label>
                <Input
                  id="dishCategory"
                  value={dishForm.category}
                  onChange={(e) => setDishForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Pasta"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="prepTime">Tillagningstid (min)</Label>
              <Input
                id="prepTime"
                type="number"
                value={dishForm.preparation_time}
                onChange={(e) => setDishForm(prev => ({ ...prev, preparation_time: e.target.value }))}
                placeholder="30"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDishDialogOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={saveDish} disabled={savingDish}>
              {savingDish ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sparar...</>
              ) : (
                editingDish ? 'Uppdatera' : 'Lägg till'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantDashboard;