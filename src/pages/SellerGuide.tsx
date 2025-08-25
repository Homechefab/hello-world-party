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
  const [cookingMethod, setCookingMethod] = useState("");
  const [cleaningMethod, setCleaningMethod] = useState("");
  const [dishName, setDishName] = useState("");

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to chef application or handle submission
      console.log("Form completed", { cookingMethod, cleaningMethod, dishName });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
                
                <RadioGroup value={cookingMethod} onValueChange={setCookingMethod}>
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
                  
                  <RadioGroup value={cleaningMethod} onValueChange={setCleaningMethod}>
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
                >
                  Fortsätt
                </Button>

                <div className="space-y-4">
                  <h3 className="font-semibold">Publicera din första maträtt</h3>
                  <p className="text-sm text-muted-foreground">Namn på rätt</p>
                  <Input 
                    placeholder="Dumpla Linssoppa"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <span>Ingredienser</span>
                    <span>Allergener</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerGuide;