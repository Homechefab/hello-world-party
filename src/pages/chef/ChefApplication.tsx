import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, FileText, Shield, Clock } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    id: 1,
    title: "Personlig information",
    description: "Berätta om dig själv"
  },
  {
    id: 2,
    title: "Matlagningsexpertis",
    description: "Dela din kulinariska bakgrund"
  },
  {
    id: 3,
    title: "Dokument & certifiering",
    description: "Ladda upp nödvändiga dokument"
  },
  {
    id: 4,
    title: "Granska & skicka",
    description: "Kontrollera din ansökan"
  }
];

const ChefApplication = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    experience: "",
    specialties: "",
    motivation: "",
    hasKitchen: false,
    hasHygieneCertificate: false,
    hasBusinessLicense: false,
    agreesToTerms: false,
    agreesToBackground: false
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Skicka ansökan
      toast({
        title: "Ansökan skickad!",
        description: "Vi granskar din ansökan och återkommer inom 2-3 arbetsdagar.",
        duration: 5000
      });
      // Här skulle man skicka data till backend
      setTimeout(() => {
        navigate("/chef/application-pending");
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.address;
      case 2:
        return formData.experience && formData.specialties && formData.motivation;
      case 3:
        return formData.hasKitchen && formData.hasHygieneCertificate;
      case 4:
        return formData.agreesToTerms && formData.agreesToBackground;
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
            <h1 className="text-4xl font-bold mb-4">Bli Homechef-kock</h1>
            <p className="text-lg text-muted-foreground">
              Ansök om att sälja din hemlagade mat till hungriga kunder i ditt område
            </p>
          </div>

          {/* Steg-indikator */}
          <div className="flex items-center justify-center mb-8 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center min-w-0">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white border-border text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 text-left hidden md:block">
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
                  <div className={`w-8 md:w-16 h-px mx-4 md:mx-6 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Steg {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Steg 1: Personlig information */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Fullständigt namn *</Label>
                      <Input
                        id="fullName"
                        placeholder="Anna Andersson"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-postadress *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="anna@exempel.se"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefonnummer *</Label>
                      <Input
                        id="phone"
                        placeholder="070-123 45 67"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Gatuadress *</Label>
                      <Input
                        id="address"
                        placeholder="Hemgatan 123"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Stad *</Label>
                      <Input
                        id="city"
                        placeholder="Stockholm"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postnummer *</Label>
                      <Input
                        id="postalCode"
                        placeholder="123 45"
                        value={formData.postalCode}
                        onChange={(e) => updateFormData('postalCode', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Steg 2: Matlagningsexpertis */}
              {currentStep === 2 && (
                <>
                  <div>
                    <Label htmlFor="experience">Matlagningsexpertis *</Label>
                    <Textarea
                      id="experience"
                      placeholder="Beskriv din erfarenhet av matlagning (hemkock, restaurangkök, kurser, etc.)"
                      rows={4}
                      value={formData.experience}
                      onChange={(e) => updateFormData('experience', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialties">Specialiteter & köksstil *</Label>
                    <Textarea
                      id="specialties"
                      placeholder="Vilka typer av mat och köksstilar är du bäst på? (t.ex. italiensk, svensk, vegetarisk, bakning)"
                      rows={3}
                      value={formData.specialties}
                      onChange={(e) => updateFormData('specialties', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="motivation">Varför vill du bli Homechef-kock? *</Label>
                    <Textarea
                      id="motivation"
                      placeholder="Berätta om din motivation och vad du hoppas uppnå"
                      rows={4}
                      value={formData.motivation}
                      onChange={(e) => updateFormData('motivation', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Steg 3: Dokument & certifiering */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Krävd utrustning och certifieringar</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hasKitchen"
                        checked={formData.hasKitchen}
                        onCheckedChange={(checked) => updateFormData('hasKitchen', checked as boolean)}
                      />
                      <Label htmlFor="hasKitchen" className="text-sm">
                        Jag har tillgång till ett fullt utrustat kök för matlagning *
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hasHygieneCertificate"
                        checked={formData.hasHygieneCertificate}
                        onCheckedChange={(checked) => updateFormData('hasHygieneCertificate', checked as boolean)}
                      />
                      <Label htmlFor="hasHygieneCertificate" className="text-sm">
                        Jag har eller åtar mig att skaffa livsmedelshygienbevis *
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hasBusinessLicense"
                        checked={formData.hasBusinessLicense}
                        onCheckedChange={(checked) => updateFormData('hasBusinessLicense', checked as boolean)}
                      />
                      <Label htmlFor="hasBusinessLicense" className="text-sm">
                        Jag har eller planerar att registrera näringsverksamhet
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dokumentuppladdning</h3>
                    <p className="text-sm text-muted-foreground">
                      Du kan ladda upp dessa dokument nu eller senare under granskningsprocessen.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <h4 className="font-medium">Livsmedelshygienbevis</h4>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Ladda upp
                        </Button>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="w-5 h-5 text-primary" />
                          <h4 className="font-medium">Näringsregistrering</h4>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Ladda upp
                        </Button>
                      </Card>
                    </div>
                  </div>
                </>
              )}

              {/* Steg 4: Granska & skicka */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Sammanfattning av din ansökan</h3>
                      <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                        <div>
                          <span className="font-medium">Namn:</span> {formData.fullName}
                        </div>
                        <div>
                          <span className="font-medium">E-post:</span> {formData.email}
                        </div>
                        <div>
                          <span className="font-medium">Plats:</span> {formData.city}
                        </div>
                        <div>
                          <span className="font-medium">Specialiteter:</span> {formData.specialties}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Villkor och samtycken</h3>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="agreesToTerms"
                          checked={formData.agreesToTerms}
                          onCheckedChange={(checked) => updateFormData('agreesToTerms', checked as boolean)}
                        />
                        <Label htmlFor="agreesToTerms" className="text-sm leading-relaxed">
                          Jag accepterar Homechefs användarvillkor och integritetspolicy. Jag förstår att jag är ansvarig för livsmedelssäkerhet och följer alla lokala regleringar. *
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="agreesToBackground"
                          checked={formData.agreesToBackground}
                          onCheckedChange={(checked) => updateFormData('agreesToBackground', checked as boolean)}
                        />
                        <Label htmlFor="agreesToBackground" className="text-sm leading-relaxed">
                          Jag samtycker till bakgrundskontroll och verifiering av mina uppgifter för att säkerställa kvalitet och säkerhet för våra kunder. *
                        </Label>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium text-blue-900">Nästa steg</h4>
                      </div>
                      <p className="text-sm text-blue-800">
                        Efter att du skickat in din ansökan kommer vårt team att granska den inom 2-3 arbetsdagar. 
                        Du får ett e-mail med besked om din ansökan godkänns eller om vi behöver ytterligare information.
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Tillbaka
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="min-w-[120px]"
                >
                  {currentStep === 4 ? 'Skicka ansökan' : 'Nästa'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChefApplication;