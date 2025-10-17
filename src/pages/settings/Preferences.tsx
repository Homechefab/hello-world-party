import { useState, useEffect } from "react";
import { Heart, Save, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface UserPreference {
  id: string;
  allergies: string[];
  favorite_dishes: string[];
  language: string;
  dietary_restrictions: string[];
}

const Preferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [language, setLanguage] = useState('sv');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [favoriteDishes, setFavoriteDishes] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  
  // Input states for adding new items
  const [newAllergy, setNewAllergy] = useState('');
  const [newFavoriteDish, setNewFavoriteDish] = useState('');
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id as string)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPreferences({
          id: data.id,
          allergies: data.allergies || [],
          favorite_dishes: data.favorite_dishes || [],
          language: data.language || 'sv',
          dietary_restrictions: data.dietary_restrictions || [],
        });
        setLanguage(data.language || 'sv');
        setAllergies(data.allergies || []);
        setFavoriteDishes(data.favorite_dishes || []);
        setDietaryRestrictions(data.dietary_restrictions || []);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Kunde inte hämta preferenser');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
  setSaving(true);
  
  if (!user?.id) {
    toast.error('Du måste vara inloggad för att spara preferenser.');
    setSaving(false);
    return;
  }
  
  try {
      const preferencesData = {
        user_id: user.id,
        language,
        allergies,
        favorite_dishes: favoriteDishes,
        dietary_restrictions: dietaryRestrictions
      };

      if (preferences) {
        const { error } = await supabase
          .from('user_preferences')
          .update(preferencesData)
          .eq('id', preferences.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_preferences')
          .insert([preferencesData]);
        
        if (error) throw error;
      }

      toast.success('Preferenser sparade');
      fetchPreferences();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Kunde inte spara preferenser');
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type: 'allergy' | 'favorite' | 'dietary') => {
    if (type === 'allergy' && newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    } else if (type === 'favorite' && newFavoriteDish.trim()) {
      setFavoriteDishes([...favoriteDishes, newFavoriteDish.trim()]);
      setNewFavoriteDish('');
    } else if (type === 'dietary' && newDietaryRestriction.trim()) {
      setDietaryRestrictions([...dietaryRestrictions, newDietaryRestriction.trim()]);
      setNewDietaryRestriction('');
    }
  };

  const removeItem = (type: 'allergy' | 'favorite' | 'dietary', index: number) => {
    if (type === 'allergy') {
      setAllergies(allergies.filter((_, i) => i !== index));
    } else if (type === 'favorite') {
      setFavoriteDishes(favoriteDishes.filter((_, i) => i !== index));
    } else if (type === 'dietary') {
      setDietaryRestrictions(dietaryRestrictions.filter((_, i) => i !== index));
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
              <div className="h-32 bg-secondary rounded"></div>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Personliga preferenser</h1>
            <p className="text-muted-foreground">Anpassa din upplevelse efter dina behov</p>
          </div>
          
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Sparar...' : 'Spara ändringar'}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Språkinställningar</CardTitle>
              <CardDescription>Välj ditt föredragna språk för webbplatsen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-xs">
                <Label htmlFor="language">Språk</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sv">Svenska</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fi">Suomi</SelectItem>
                    <SelectItem value="no">Norsk</SelectItem>
                    <SelectItem value="da">Dansk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle>Allergier</CardTitle>
              <CardDescription>Lägg till allergier så vi kan visa relevanta varningar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Lägg till allergi..."
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('allergy')}
                />
                <Button onClick={() => addItem('allergy')} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {allergy}
                    <button onClick={() => removeItem('allergy', index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dietary Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle>Kostpreferenser</CardTitle>
              <CardDescription>Ange dina kostpreferenser och restriktioner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Lägg till kostpreferens..."
                  value={newDietaryRestriction}
                  onChange={(e) => setNewDietaryRestriction(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('dietary')}
                />
                <Button onClick={() => addItem('dietary')} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {dietaryRestrictions.map((restriction, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {restriction}
                    <button onClick={() => removeItem('dietary', index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {/* Quick add common dietary restrictions */}
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">Vanliga kostpreferenser:</p>
                <div className="flex flex-wrap gap-2">
                  {['Vegetarian', 'Vegan', 'Glutenfri', 'Laktosfri', 'LCHF', 'Keto'].map((restriction) => (
                    <Button
                      key={restriction}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!dietaryRestrictions.includes(restriction)) {
                          setDietaryRestrictions([...dietaryRestrictions, restriction]);
                        }
                      }}
                      disabled={dietaryRestrictions.includes(restriction)}
                    >
                      {restriction}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Dishes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Favoriträtter
              </CardTitle>
              <CardDescription>Lägg till rätter du älskar för personliga rekommendationer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Lägg till favoriträtt..."
                  value={newFavoriteDish}
                  onChange={(e) => setNewFavoriteDish(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('favorite')}
                />
                <Button onClick={() => addItem('favorite')} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {favoriteDishes.map((dish, index) => (
                  <Badge key={index} variant="default" className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {dish}
                    <button onClick={() => removeItem('favorite', index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Preferences;