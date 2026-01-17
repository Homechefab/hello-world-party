import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Check } from "lucide-react";
import DishCard from "@/components/shared/DishCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface DishTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  ingredients: string[] | null;
  allergens: string[] | null;
  preparation_time: number | null;
  suggested_price: number | null;
  image_url?: string | null;
}

interface DishTemplatesProps {
  onDishAdded?: () => void;
}

const DishTemplates = ({ onDishAdded }: DishTemplatesProps) => {
  const [templates, setTemplates] = useState<DishTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DishTemplate | null>(null);
  const [customPrice, setCustomPrice] = useState<string>("");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Alla");
  
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTemplates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('dish_templates')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda rättmallar",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const categories = ["Alla", ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = activeCategory === "Alla" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  const handleSelectTemplate = (template: DishTemplate) => {
    setSelectedTemplate(template);
    setCustomPrice(template.suggested_price?.toString() || "");
    setCustomDescription(template.description || "");
    setIsDialogOpen(true);
  };

  const handleAddDish = async () => {
    if (!selectedTemplate || !user?.id) return;

    setLoading(true);
    try {
      // First get the chef_id for the current user
      const { data: chefData, error: chefError } = await supabase
        .from('chefs')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (chefError || !chefData) {
        throw new Error('Chef profile not found');
      }

      // Add the dish using the template data
      const { error } = await supabase
        .from('dishes')
        .insert({
          chef_id: chefData.id,
          name: selectedTemplate.name,
          description: customDescription,
          category: selectedTemplate.category,
          ingredients: selectedTemplate.ingredients || [],
          allergens: selectedTemplate.allergens || [],
          preparation_time: selectedTemplate.preparation_time || 30,
          price: parseFloat(customPrice),
          available: true
        });

      if (error) throw error;

      toast({
        title: "Rätt tillagd!",
        description: `${selectedTemplate.name} har lagts till i din meny`,
      });

      setIsDialogOpen(false);
      setSelectedTemplate(null);
      onDishAdded?.();
    } catch (error) {
      console.error('Error adding dish:', error);
      toast({
        title: "Fel",
        description: "Kunde inte lägga till rätten",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Använd färdiga recept</h2>
        <p className="text-muted-foreground">
          Välj bland våra populära rätter och anpassa priset efter ditt kök
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <DishCard
                key={template.id}
                name={template.name}
                price={template.suggested_price || 0}
                description={template.description}
                imageUrl={template.image_url}
                onAdd={() => handleSelectTemplate(template)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Anpassa och lägg till</DialogTitle>
            <DialogDescription>
              Sätt pris och anpassa beskrivningen för {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Pris (kr)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="149"
                  />
                </div>
                <div>
                  <Label>Tillaganstid</Label>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                    <Clock className="w-4 h-4" />
                    {selectedTemplate.preparation_time || 30} minuter
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Beskrivning</Label>
                <Textarea
                  id="description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Beskriv din rätt..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Ingredienser</Label>
                <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted">
                  {(selectedTemplate.ingredients || []).map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Allergener</Label>
                <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted">
                  {(selectedTemplate.allergens || []).map((allergen, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Avbryt
                </Button>
                <Button
                  onClick={handleAddDish}
                  disabled={loading || !customPrice}
                  className="flex-1 bg-gradient-primary text-white hover:opacity-90"
                >
                  {loading ? (
                    "Lägger till..."
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Lägg till rätt
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

export default DishTemplates;