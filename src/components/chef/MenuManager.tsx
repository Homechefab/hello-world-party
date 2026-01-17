import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Save,
  ChefHat
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import DishTemplates from "./DishTemplates";
import DishCardManage from "@/components/shared/DishCardManage";

interface Dish {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  ingredients: string[] | null;
  allergens: string[] | null;
  preparation_time: number | null;
  price: number;
  available: boolean | null;
  image_url?: string | null;
}

const MenuManager = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("my-menu");
  
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchMyDishes = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get chef_id first
      const { data: chefData, error: chefError } = await supabase
        .from('chefs')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (chefError || !chefData) return;

      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('chef_id', chefData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDishes(data || []);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda dina rätter",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  useEffect(() => {
    if (activeTab === "my-menu") {
      fetchMyDishes();
    }
  }, [activeTab, fetchMyDishes]);

  const handleEditDish = (dish: Dish) => {
    setEditingDish({ ...dish });
    setIsEditDialogOpen(true);
  };

  const handleSaveDish = async () => {
    if (!editingDish) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('dishes')
        .update({
          name: editingDish.name,
          description: editingDish.description,
          price: editingDish.price,
          available: editingDish.available,
          preparation_time: editingDish.preparation_time
        })
        .eq('id', editingDish.id);

      if (error) throw error;

      toast({
        title: "Uppdaterat!",
        description: "Rätten har uppdaterats",
      });

      setIsEditDialogOpen(false);
      setEditingDish(null);
      fetchMyDishes();
    } catch (error) {
      console.error('Error updating dish:', error);
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera rätten",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDishAvailability = async (dishId: string, available: boolean) => {
    try {
      const { error } = await supabase
        .from('dishes')
        .update({ available })
        .eq('id', dishId);

      if (error) throw error;

      toast({
        title: available ? "Rätt aktiverad" : "Rätt inaktiverad",
        description: available ? "Rätten är nu synlig för kunder" : "Rätten är nu dold för kunder",
      });

      fetchMyDishes();
    } catch (error) {
      console.error('Error toggling dish availability:', error);
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera rätten",
        variant: "destructive",
      });
    }
  };

  const categories = ["Alla", ...Array.from(new Set(dishes.map(d => d.category)))];
  const [activeCategory, setActiveCategory] = useState("Alla");
  const filteredDishes = activeCategory === "Alla" 
    ? dishes 
    : dishes.filter(d => d.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Hantera din meny</h1>
        <p className="text-muted-foreground">
          Lägg till rätter från våra mallar eller hantera dina befintliga rätter
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">
            <Plus className="w-4 h-4 mr-2" />
            Lägg till rätter
          </TabsTrigger>
          <TabsTrigger value="my-menu">
            <ChefHat className="w-4 h-4 mr-2" />
            Min meny ({dishes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <DishTemplates onDishAdded={() => {
            fetchMyDishes();
            setActiveTab("my-menu");
          }} />
        </TabsContent>

        <TabsContent value="my-menu" className="mt-6">
          {dishes.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Ingen meny än</h3>
                <p className="text-muted-foreground mb-4">
                  Lägg till dina första rätter från våra fördefinierade mallar
                </p>
                <Button 
                  onClick={() => setActiveTab("templates")}
                  className="bg-gradient-primary text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Lägg till rätter
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category || 'Okategoriserad'}>
                      {category || 'Okategoriserad'}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeCategory} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDishes.map((dish) => (
                      <DishCardManage
                        key={dish.id}
                        name={dish.name}
                        price={dish.price}
                        description={dish.description}
                        imageUrl={dish.image_url}
                        category={dish.category}
                        available={dish.available ?? true}
                        onEdit={() => handleEditDish(dish)}
                        onToggleAvailability={() => toggleDishAvailability(dish.id, !dish.available)}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Redigera rätt</DialogTitle>
            <DialogDescription>
              Uppdatera information för {editingDish?.name}
            </DialogDescription>
          </DialogHeader>

          {editingDish && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Namn</Label>
                <Input
                  id="edit-name"
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({...editingDish, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Beskrivning</Label>
                <Textarea
                  id="edit-description"
                  value={editingDish.description || ""}
                  onChange={(e) => setEditingDish({...editingDish, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Pris (kr)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingDish.price}
                    onChange={(e) => setEditingDish({...editingDish, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time">Tillaganstid (min)</Label>
                  <Input
                    id="edit-time"
                    type="number"
                    value={editingDish.preparation_time || ""}
                    onChange={(e) => setEditingDish({...editingDish, preparation_time: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingDish.available || false}
                  onCheckedChange={(checked) => setEditingDish({...editingDish, available: checked})}
                />
                <Label>Synlig för kunder</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsEditDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Avbryt
                </Button>
                <Button
                  onClick={handleSaveDish}
                  disabled={loading}
                  className="flex-1 bg-gradient-primary text-white hover:opacity-90"
                >
                  {loading ? (
                    "Sparar..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Spara ändringar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManager;