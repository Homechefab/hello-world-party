import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

const SellerGuide = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    cookingMethod: "",
    cleaningMethod: "",
    dishName: "",
    allergies: [],
    kitchenType: "",
    experience: "",
    specialties: [],
    availability: "",
    priceRange: "",
    hygieneCertificate: false,
    termsAccepted: false
  });

  const totalSteps = 8;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to chef application or handle submission
      console.log("Form completed", formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-8">
        {currentStep > 1 && (
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4 p-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Tillbaka
          </Button>
        )}

        <Card className="border-none shadow-none">
          <CardContent className="p-6">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="text-center space-y-6">
                <h1 className="text-2xl font-bold">Välkommen!</h1>
                <p className="text-muted-foreground">
                  Vill du börja sälja mat? Vi hjälper dig med allt från tillstånd till etiketter.
                </p>
                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                >
                  Börja
                </Button>
              </div>
            )}

            {/* Step 2: Choose cooking method */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Välj hur du lagar</h2>
                <p className="text-muted-foreground">Var lagar du maten?</p>
                
                <RadioGroup value={formData.cookingMethod} onValueChange={(value) => updateFormData('cookingMethod', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hemmakök" id="hemmakök" />
                    <Label htmlFor="hemmakök">Hemmakök</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uthyrt" id="uthyrt" />
                    <Label htmlFor="uthyrt">Uthyrt kök (välj från lista)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="annat" id="annat" />
                    <Label htmlFor="annat">Annat (ex: food truck)</Label>
                  </div>
                </RadioGroup>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Visa min kommun
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ladda ner mallar
                  </Button>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                  disabled={!formData.cookingMethod}
                >
                  Fortsätt
                </Button>
              </div>
            )}

            {/* Step 3: Hygiene plan */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Bygg din hygienplan</h2>
                <div>
                  <p className="text-muted-foreground mb-4">
                    Hur rengör du köket innan matlagning?
                  </p>
                  
                  <RadioGroup value={formData.cleaningMethod} onValueChange={(value) => updateFormData('cleaningMethod', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="allrengöring" id="allrengöring" />
                      <Label htmlFor="allrengöring">Allrengöring</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vatten" id="vatten" />
                      <Label htmlFor="vatten">Endast vatten</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="annat-clean" id="annat-clean" />
                      <Label htmlFor="annat-clean">Annat</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                  disabled={!formData.cleaningMethod}
                >
                  Fortsätt
                </Button>
              </div>
            )}

            {/* Step 4: First dish */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Publicera din första maträtt</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Namn på rätt</p>
                    <Input 
                      placeholder="Dumpla Linssoppa"
                      value={formData.dishName}
                      onChange={(e) => updateFormData('dishName', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <Button variant="outline" size="sm">Ingredienser</Button>
                    <Button variant="outline" size="sm">Allergener</Button>
                  </div>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                  disabled={!formData.dishName}
                >
                  Fortsätt
                </Button>
              </div>
            )}

            {/* Step 5: Experience & Specialties */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Berätta om din matlagning</h2>
                <div>
                  <p className="text-muted-foreground mb-4">Hur länge har du lagat mat?</p>
                  
                  <RadioGroup value={formData.experience} onValueChange={(value) => updateFormData('experience', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nybörjare" id="nybörjare" />
                      <Label htmlFor="nybörjare">Nybörjare (mindre än 1 år)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="erfaren" id="erfaren" />
                      <Label htmlFor="erfaren">Erfaren (1-5 år)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="expert" id="expert" />
                      <Label htmlFor="expert">Expert (över 5 år)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professionell" id="professionell" />
                      <Label htmlFor="professionell">Professionell kock</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                  disabled={!formData.experience}
                >
                  Fortsätt
                </Button>
              </div>
            )}

            {/* Step 6: Availability */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">När kan du laga mat?</h2>
                <div>
                  <p className="text-muted-foreground mb-4">Välj din tillgänglighet</p>
                  
                  <RadioGroup value={formData.availability} onValueChange={(value) => updateFormData('availability', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vardagar" id="vardagar" />
                      <Label htmlFor="vardagar">Vardagar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="helger" id="helger" />
                      <Label htmlFor="helger">Helger</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexibel" id="flexibel" />
                      <Label htmlFor="flexibel">Flexibel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="endast-helger" id="endast-helger" />
                      <Label htmlFor="endast-helger">Endast helger</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                  disabled={!formData.availability}
                >
                  Fortsätt
                </Button>
              </div>
            )}

            {/* Step 7: Pricing */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Sätt dina priser</h2>
                <div>
                  <p className="text-muted-foreground mb-4">Ungefär vilken prisnivå siktar du på?</p>
                  
                  <RadioGroup value={formData.priceRange} onValueChange={(value) => updateFormData('priceRange', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="budget" id="budget" />
                      <Label htmlFor="budget">Budget (50-99 kr/portion)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mellan" id="mellan" />
                      <Label htmlFor="mellan">Mellan (100-149 kr/portion)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="premium" id="premium" />
                      <Label htmlFor="premium">Premium (150+ kr/portion)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Tips:</strong> Räkna ingredienser + tid + 30-50% vinst för bästa resultat.
                  </p>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                  disabled={!formData.priceRange}
                >
                  Fortsätt
                </Button>
              </div>
            )}

            {/* Step 8: Final confirmation */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Nästan klar!</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Bekräfta att du förstår kraven för att sälja mat:
                  </p>
                  
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        checked={formData.hygieneCertificate}
                        onChange={(e) => updateFormData('hygieneCertificate', e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm">
                        Jag förstår att jag behöver ett giltigt hygienintyg för att sälja mat
                      </span>
                    </label>
                    
                    <label className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        checked={formData.termsAccepted}
                        onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm">
                        Jag accepterar användarvillkor och integritetspolicy
                      </span>
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                  disabled={!formData.hygieneCertificate || !formData.termsAccepted}
                >
                  Skicka ansökan
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Vi återkommer inom 24 timmar med besked om din ansökan
                </p>
              </div>
            )}

            {/* Progress indicator */}
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i + 1 <= currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="text-center text-sm text-muted-foreground mt-2">
              Steg {currentStep} av {totalSteps}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerGuide;