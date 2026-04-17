import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Save,
  ChefHat,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRequireEmailVerified } from "@/hooks/useRequireEmailVerified";
import DishTemplates from "./DishTemplates";
import DishCardManage from "@/components/shared/DishCardManage";
import { DishScheduleManager } from "./DishScheduleManager";

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

interface MenuManagerProps {
  chefId?: string | null;
}

const MenuManager = ({ chefId: overrideChefId }: MenuManagerProps = {}) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [scheduleDish, setScheduleDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("my-menu");
  const [newIngredient, setNewIngredient] = useState("");
  const [newAllergen, setNewAllergen] = useState("");
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { isVerified, requireVerified } = useRequireEmailVerified();

  const fetchMyDishes = useCallback(async () => {
    if (!overrideChefId && !user?.id) return;

    try {
      let chefId: string | null = null;

      if (overrideChefId) {
        chefId = overrideChefId;
      } else {
        const { data: chefData, error: chefError } = await supabase
          .from('chefs')
          .select('id')
          .eq('user_id', user!.id!)
          .maybeSingle();

        if (chefError || !chefData) return;
        chefId = chefData.id;
      }

      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('chef_id', chefId)
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
    setNewIngredient("");
    setNewAllergen("");
    setIsEditDialogOpen(true);
  };

  const handleSaveDish = async () => {
    if (!editingDish) return;
    if (!requireVerified('publicera maträtter')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('dishes')
        .update({
          name: editingDish.name,
          description: editingDish.description,
          price: editingDish.price,
          available: editingDish.available,
          preparation_time: editingDish.preparation_time,
          ingredients: editingDish.ingredients || [],
          allergens: editingDish.allergens || []
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

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna rätt?")) return;

    try {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', dishId);

      if (error) throw error;

      toast({
        title: "Rätt borttagen",
        description: "Rätten har tagits bort från din meny",
      });

      fetchMyDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ta bort rätten",
        variant: "destructive",
      });
    }
  };

  const updatePrepTime = async (dishId: string, minutes: number) => {
    try {
      const { error } = await supabase
        .from('dishes')
        .update({ preparation_time: minutes })
        .eq('id', dishId);

      if (error) throw error;

      toast({
        title: "Uppdaterat!",
        description: `Tillagningstid satt till ${minutes} minuter`,
      });
      fetchMyDishes();
    } catch (error) {
      console.error('Error updating prep time:', error);
      toast({ title: "Fel", description: "Kunde inte uppdatera tillagningstiden", variant: "destructive" });
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
                        preparationTime={dish.preparation_time}
                        onEdit={() => handleEditDish(dish)}
                        onToggleAvailability={() => toggleDishAvailability(dish.id, !dish.available)}
                        onDelete={() => handleDeleteDish(dish.id)}
                        onSchedule={() => setScheduleDish(dish)}
                        onUpdatePrepTime={(mins) => updatePrepTime(dish.id, mins)}
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

              {/* Ingredients */}
              <div>
                <Label>Ingredienser</Label>
                <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted min-h-[40px]">
                  {(editingDish.ingredients || []).map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-xs gap-1">
                      {ingredient}
                      <button type="button" onClick={() => setEditingDish({...editingDish, ingredients: (editingDish.ingredients || []).filter((_, i) => i !== index)})} className="ml-0.5 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Lägg till ingrediens..."
                    className="text-sm h-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = newIngredient.trim();
                        if (val && !(editingDish.ingredients || []).includes(val)) {
                          setEditingDish({...editingDish, ingredients: [...(editingDish.ingredients || []), val]});
                          setNewIngredient("");
                        }
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" className="h-8 px-3" onClick={() => {
                    const val = newIngredient.trim();
                    if (val && !(editingDish.ingredients || []).includes(val)) {
                      setEditingDish({...editingDish, ingredients: [...(editingDish.ingredients || []), val]});
                      setNewIngredient("");
                    }
                  }}>Lägg till</Button>
                </div>
              </div>

              {/* Allergens */}
              <div>
                <Label>Allergener</Label>
                <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted min-h-[40px]">
                  {(editingDish.allergens || []).map((allergen, index) => (
                    <Badge key={index} variant="outline" className="text-xs gap-1">
                      {allergen}
                      <button type="button" onClick={() => setEditingDish({...editingDish, allergens: (editingDish.allergens || []).filter((_, i) => i !== index)})} className="ml-0.5 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newAllergen}
                    onChange={(e) => setNewAllergen(e.target.value)}
                    placeholder="Lägg till allergen..."
                    className="text-sm h-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = newAllergen.trim();
                        if (val && !(editingDish.allergens || []).includes(val)) {
                          setEditingDish({...editingDish, allergens: [...(editingDish.allergens || []), val]});
                          setNewAllergen("");
                        }
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" className="h-8 px-3" onClick={() => {
                    const val = newAllergen.trim();
                    if (val && !(editingDish.allergens || []).includes(val)) {
                      setEditingDish({...editingDish, allergens: [...(editingDish.allergens || []), val]});
                      setNewAllergen("");
                    }
                  }}>Lägg till</Button>
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

      {/* Schedule dialog */}
      <Dialog open={!!scheduleDish} onOpenChange={(open) => !open && setScheduleDish(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schemalägg rätt</DialogTitle>
            <DialogDescription>
              Välj vilka dagar rätten ska vara tillgänglig
            </DialogDescription>
          </DialogHeader>
          {scheduleDish && (
            <DishScheduleManager
              dishId={scheduleDish.id}
              dishName={scheduleDish.name}
              onClose={() => setScheduleDish(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManager;