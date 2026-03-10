import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Upload, X, CalendarDays } from "lucide-react";
import DishCard from "@/components/shared/DishCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const WEEKDAYS = [
  { value: 1, label: 'Måndag', short: 'Mån' },
  { value: 2, label: 'Tisdag', short: 'Tis' },
  { value: 3, label: 'Onsdag', short: 'Ons' },
  { value: 4, label: 'Torsdag', short: 'Tor' },
  { value: 5, label: 'Fredag', short: 'Fre' },
  { value: 6, label: 'Lördag', short: 'Lör' },
  { value: 0, label: 'Söndag', short: 'Sön' },
];

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
  const [customName, setCustomName] = useState<string>("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customPrepTime, setCustomPrepTime] = useState<string>("");
  const [scheduleDays, setScheduleDays] = useState<{ [day: number]: boolean }>({});
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
    setCustomName(template.name);
    setCustomPrice(template.suggested_price?.toString() || "");
    setCustomDescription(template.description || "");
    setCustomPrepTime(template.preparation_time?.toString() || "30");
    setCustomImage(null);
    setCustomImagePreview(null);
    setScheduleDays({});
    setIsDialogOpen(true);
  };

  const toggleScheduleDay = (day: number) => {
    setScheduleDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setCustomImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCustomImage(null);
    setCustomImagePreview(null);
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

      // Upload image if provided
      let imageUrl: string | null = null;
      if (customImage) {
        const fileExt = customImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-dish.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('chef-profiles')
          .upload(fileName, customImage);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from('chef-profiles')
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      }

      const dishName = customName.trim() || selectedTemplate.name;

      // Add the dish using the template data
      const { data: dishData, error } = await supabase
        .from('dishes')
        .insert({
          chef_id: chefData.id,
          name: dishName,
          description: customDescription,
          category: selectedTemplate.category,
          ingredients: selectedTemplate.ingredients || [],
          allergens: selectedTemplate.allergens || [],
          preparation_time: parseInt(customPrepTime) || selectedTemplate.preparation_time || 30,
          price: parseFloat(customPrice),
          available: true,
          image_url: imageUrl
        })
        .select('id')
        .single();

      if (error) throw error;

      // Save weekly schedule if any days were selected
      const selectedDays = WEEKDAYS.filter(d => scheduleDays[d.value]);
      if (selectedDays.length > 0 && dishData) {
        const scheduleData = WEEKDAYS.map(d => ({
          dish_id: dishData.id,
          day_of_week: d.value,
          is_available: scheduleDays[d.value] ?? false,
        }));

        await supabase
          .from('dish_weekly_schedule')
          .upsert(scheduleData, { onConflict: 'dish_id,day_of_week' });
      }

      toast({
        title: "Rätt tillagd!",
        description: `${dishName} har lagts till i din meny${selectedDays.length > 0 ? ` (${selectedDays.map(d => d.short).join(', ')})` : ''}`,
      });

      setIsDialogOpen(false);
      setSelectedTemplate(null);
      setCustomImage(null);
      setCustomImagePreview(null);
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
        <TabsList className="flex flex-wrap gap-1 h-auto">
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Anpassa och lägg till</DialogTitle>
            <DialogDescription>
              Sätt pris och anpassa beskrivningen för {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="dish-name">Namn på rätten</Label>
                <Input
                  id="dish-name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ange eget namn eller behåll mallens"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ändra till eget namn eller behåll mallens: {selectedTemplate.name}
                </p>
              </div>

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
                  <Label htmlFor="prepTime">Tillagningstid (min)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={customPrepTime}
                    onChange={(e) => setCustomPrepTime(e.target.value)}
                    placeholder={String(selectedTemplate.preparation_time || 30)}
                    min={1}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Beskrivning</Label>
                <Textarea
                  id="description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Beskriv din rätt..."
                  rows={2}
                />
              </div>

              {/* Image upload */}
              <div>
                <Label>Bild på rätten</Label>
                {customImagePreview ? (
                  <div className="relative mt-2">
                    <img
                      src={customImagePreview}
                      alt="Förhandsgranskning"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors mt-1">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Klicka för att ladda upp bild</span>
                    <span className="text-xs text-muted-foreground mt-1">Rekommenderad storlek: 800×600px, max 2MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
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

              {/* Weekly schedule */}
              <div>
                <Label className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Tillgängliga dagar (valfritt)
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Välj vilka dagar rätten ska säljas. Lämna tomt = alla dagar.
                </p>
                <div className="grid grid-cols-7 gap-1.5">
                  {WEEKDAYS.map(day => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleScheduleDay(day.value)}
                      className={`flex flex-col items-center gap-0.5 p-2 rounded-lg border transition-colors text-xs font-medium ${
                        scheduleDays[day.value]
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>

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