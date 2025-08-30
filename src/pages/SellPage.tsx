import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, DollarSign, Clock, MapPin, Star, ImageIcon, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  {
    id: 1,
    title: "Grundinfo",
    description: "Berätta om din rätt"
  },
  {
    id: 2,
    title: "Pris & tillgänglighet",
    description: "Sätt pris och när du kan leverera"
  },
  {
    id: 3,
    title: "Bilder & beskrivning",
    description: "Ladda upp bilder och skriv en lockande beskrivning"
  }
];

const categories = [
  "Huvudrätter",
  "Förrätter", 
  "Efterrätter",
  "Sallader",
  "Soppor",
  "Pasta",
  "Vegetariskt",
  "Veganskt",
  "Glutenfritt"
];

const SellPage = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    ingredients: "",
    allergens: "",
    price: "",
    portions: "",
    prepTime: "",
    availableFrom: "",
    availableUntil: "",
    pickupAddress: "",
    pickupInstructions: ""
  });

  const handleImageUpload = async (files: FileList) => {
    const imageUrls: string[] = [];
    
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fil för stor",
          description: "Bilden får max vara 5MB",
          variant: "destructive"
        });
        continue;
      }

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `dishes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) {
          toast({
            title: "Uppladdning misslyckades",
            description: "Kunde inte ladda upp bilden",
            variant: "destructive"
          });
          continue;
        }

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrls.push(data.publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    setUploadedImages([...uploadedImages, ...imageUrls]);
  };

  const saveDishToDatabase = async () => {
    try {
      setIsSubmitting(true);

      // Convert to proper database format
      const formattedDishes = [{
        chef_id: 'chef1', // Using mock user ID
        name: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        ingredients: formData.ingredients.split(',').map((i: string) => i.trim()),
        allergens: formData.allergens.split(',').map((a: string) => a.trim()),
        preparation_time: parseInt(formData.prepTime) || 30,
        available: true,
        image_url: uploadedImages[0] || null
      }];

      const { error } = await supabase
        .from('dishes')
        .insert(formattedDishes);

      if (error) {
        throw error;
      }

      toast({
        title: "Annons skapad!",
        description: "Din rätt är nu tillgänglig för beställning."
      });

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        ingredients: "",
        allergens: "",
        price: "",
        portions: "",
        prepTime: "",
        availableFrom: "",
        availableUntil: "",
        pickupAddress: "",
        pickupInstructions: ""
      });
      setUploadedImages([]);
      setCurrentStep(1);

    } catch (error) {
      console.error('Error saving dish:', error);
      toast({
        title: "Fel uppstod",
        description: "Kunde inte spara annonsen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      saveDishToDatabase();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.category && formData.description;
      case 2:
        return formData.price && formData.portions && formData.availableFrom && 
               formData.availableUntil && formData.pickupAddress;
      case 3:
        return uploadedImages.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Sälj din hemlagade mat</h1>
            <p className="text-lg text-muted-foreground">
              Dela din passion för matlagning och tjäna pengar på det du älskar
            </p>
          </div>

          {/* Steg-indikator */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white border-border text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <div className="ml-3 text-left">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-6 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Steg {currentStep}: {steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Namn på rätten *</Label>
                      <Input
                        id="title"
                        placeholder="T.ex. Mormors köttbullar"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori *</Label>
                      <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Välj kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Beskrivning *</Label>
                    <Textarea
                      id="description"
                      placeholder="Beskriv din rätt på ett aptitretande sätt..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ingredients">Huvudingredienser</Label>
                    <Input
                      id="ingredients"
                      placeholder="Separera med komma: kött, potatis, grädde..."
                      value={formData.ingredients}
                      onChange={(e) => updateFormData('ingredients', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="allergens">Allergener</Label>
                    <Input
                      id="allergens"
                      placeholder="T.ex. gluten, mjölk, ägg"
                      value={formData.allergens}
                      onChange={(e) => updateFormData('allergens', e.target.value)}
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Pris per portion (kr) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="89"
                          className="pl-9"
                          value={formData.price}
                          onChange={(e) => updateFormData('price', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="portions">Antal portioner *</Label>
                      <Input
                        id="portions"
                        type="number"
                        placeholder="5"
                        value={formData.portions}
                        onChange={(e) => updateFormData('portions', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="prepTime">Förberedelsetid</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="prepTime"
                          placeholder="30 min"
                          className="pl-9"
                          value={formData.prepTime}
                          onChange={(e) => updateFormData('prepTime', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="availableFrom">Tillgänglig från *</Label>
                      <Input
                        id="availableFrom"
                        type="datetime-local"
                        value={formData.availableFrom}
                        onChange={(e) => updateFormData('availableFrom', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="availableUntil">Tillgänglig till *</Label>
                      <Input
                        id="availableUntil"
                        type="datetime-local"
                        value={formData.availableUntil}
                        onChange={(e) => updateFormData('availableUntil', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pickupAddress">Hämtadress *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="pickupAddress"
                        placeholder="Hornsgatan 45, 118 49 Stockholm"
                        className="pl-9"
                        value={formData.pickupAddress}
                        onChange={(e) => updateFormData('pickupAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pickupInstructions">Hämtinstruktioner</Label>
                    <Textarea
                      id="pickupInstructions"
                      placeholder="T.ex. Ring på porttelefon, tredje våningen..."
                      value={formData.pickupInstructions}
                      onChange={(e) => updateFormData('pickupInstructions', e.target.value)}
                    />
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div>
                    <Label>Ladda upp bilder *</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleImageUpload(e.target.files);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center block cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Dra och släpp dina bilder här eller klicka för att välja
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rekommenderat: 2-4 bilder, max 5MB per bild
                        </p>
                        <Button type="button" variant="outline" className="mt-4">
                          Välj bilder
                        </Button>
                      </label>
                    </div>
                    
                    {uploadedImages.length > 0 && (
                      <div className="mt-4">
                        <Label>Uppladdade bilder ({uploadedImages.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Bild ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => {
                                  setUploadedImages(uploadedImages.filter((_, i) => i !== index));
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {uploadedImages.length === 0 && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <p className="text-sm text-yellow-800">
                            Du måste ladda upp minst en bild för att kunna publicera annonsen.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Tips för bra matbilder:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Använd naturligt ljus när det är möjligt</li>
                      <li>• Ta bilder från olika vinklar - ovanifrån och från sidan</li>
                      <li>• Visa portionsstorlek med en tallrik eller bestick</li>
                      <li>• Ta en bild av ingredienserna eller tillagningsprocessen</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Förhandsvisning av din annons:</h3>
                    <Card className="border-2 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{formData.title || "Namn på rätten"}</h4>
                          <Badge variant="secondary">{formData.category || "Kategori"}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {formData.description || "Beskrivning av rätten..."}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">
                            {formData.price || "0"} kr
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formData.portions || "0"} portioner kvar
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Tillbaka
                </Button>
                <Button 
                  variant="food"
                  onClick={handleNext}
                >
                  {currentStep === 3 ? 'Publicera annons' : 'Nästa'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellPage;