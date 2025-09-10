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
import MunicipalitySearch from "@/components/MunicipalitySearch";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import approvedKitchenImage from "@/assets/two-sinks-clear-labels-kitchen.jpg";

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
    businessName: "",
    motivation: "",
    hasKitchen: false,
    hasHygieneCertificate: false,
    hasBusinessLicense: false,
    agreesToTerms: false,
    agreesToBackground: false
  });

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Skicka ansökan till databasen
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Ej inloggad",
            description: "Du måste logga in för att skicka en ansökan.",
            variant: "destructive"
          });
          return;
        }

        const { error } = await supabase.from('chefs').insert({
          business_name: formData.businessName,
          user_id: user.id,
          municipality_approved: false,
          kitchen_approved: false
        });

        if (error) {
          throw error;
        }

        toast({
          title: "Ansökan skickad!",
          description: "Vi granskar din ansökan och återkommer inom 2-3 arbetsdagar.",
          duration: 5000
        });
        
        setTimeout(() => {
          navigate("/chef/application-pending");
        }, 2000);
      } catch (error) {
        toast({
          title: "Fel vid skickning",
          description: "Något gick fel. Försök igen senare.",
          variant: "destructive"
        });
      }
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Bli Homechef-kock
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Förvandla din passion för matlagning till en inkomstkälla
            </p>
            
            {/* Fördelar sektion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <Card className="p-6 text-center border-2 hover:border-primary/20 transition-colors">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Tjäna extra pengar</h3>
                <p className="text-sm text-muted-foreground">
                  Sätt ditt eget pris och bestäm hur mycket du vill arbeta
                </p>
              </Card>
              
              <Card className="p-6 text-center border-2 hover:border-primary/20 transition-colors">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Nå fler kunder</h3>
                <p className="text-sm text-muted-foreground">
                  Vi hjälper dig hitta hungriga kunder i ditt område
                </p>
              </Card>
              
              <Card className="p-6 text-center border-2 hover:border-primary/20 transition-colors">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Säker plattform</h3>
                <p className="text-sm text-muted-foreground">
                  Säkra betalningar, försäkring och support från vårt team
                </p>
              </Card>
            </div>

            {/* Krav sektion */}
            <div className="bg-secondary/30 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">Krav för att bli kock</h2>
              <p className="text-muted-foreground text-center mb-6">
                För att sälja mat via Homechef måste du uppfylla följande krav enligt svensk livsmedelslagstiftning
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vänster kolumn - Tillstånd och registrering */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Tillstånd och registrering
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Tillstånd från kommunen</p>
                        <p className="text-xs text-muted-foreground">
                          Du måste ansöka om tillstånd hos din lokala kommun för att bedriva livsmedelsverksamhet från hemmet. Kontakta miljö- och hälsoskyddsförvaltningen.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Registrerad näringsverksamhet</p>
                        <p className="text-xs text-muted-foreground">
                          Registrera din verksamhet hos Skatteverket och Bolagsverket för att kunna fakturera kunder lagligt.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Spårbarhetssystem</p>
                        <p className="text-xs text-muted-foreground">
                          Dokumentera alla ingredienser med leverantör och bäst-före-datum för att kunna spåra mat vid eventuella problem.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Höger kolumn - Hygienrutiner och kök */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Hygienrutiner och utrustning
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">HACCP-rutiner</p>
                        <p className="text-xs text-muted-foreground">
                          Du måste följa systematiska hygienrutiner för temperaturkontroll, rengöring och dokumentation av alla moment i matlagningen.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Godkänt kök</p>
                        <p className="text-xs text-muted-foreground">
                          Köket måste inspekteras och godkännas av kommunen. Det ska ha separata ytor för rå och tillagad mat, samt tillräcklig kyl- och fryskapacitet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 text-sm">Viktigt att veta</p>
                    <p className="text-amber-700 text-xs">
                      Processen för att få alla tillstånd kan ta 4-8 veckor. Vi hjälper dig genom hela processen och du kan börja din ansökan redan nu. Kontakta oss för vägledning!
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Kommunsök sektion */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 text-sm mb-3">Hitta din kommuns ansökningsblanketter</h3>
                <p className="text-blue-700 text-xs mb-4">
                  Sök på din adress för att få direktlänkar till ansökningsblanketter och e-tjänster för livsmedelsregistrering från din kommun.
                </p>
                <MunicipalitySearch />
              </div>
            </div>

            {/* Approved Kitchen Information Section */}
            <div className="mt-12 bg-white/50 rounded-lg p-6 border">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Så här ser ett godkänt kök ut
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  För att få sälja mat från ditt kök måste det uppfylla kommunens krav för livsmedelssäkerhet. 
                  Här är ett exempel på hur ett godkänt kök kan se ut.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
                {/* Kitchen Image */}
                <div className="relative">
                  <img 
                    src={approvedKitchenImage} 
                    alt="Exempel på godkänt kök enligt kommunala krav"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Godkänt kök
                  </div>
                </div>

                {/* Requirements List */}
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold">Kommunala krav</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        "Separering mellan verksamhet och privat användning - i tid eller rum",
                        "Handhygien - möjlighet att tvätta händer mellan olika moment", 
                        "Rutiner för sjukdom - vad som gäller när någon i hemmet är sjuk",
                        "Rengöringsrutiner för redskap, ytor och utrustning",
                        "Rutiner för familjemedlemmar och husdjur under verksamhet",
                        "Tillräckligt med ytor för att separera råvaror och färdiga produkter",
                        "Lämplig utrustning för temperaturkontroll och hygien",
                        "HACCP-analys av risker i din specifika verksamhet",
                        "Extra noggrannhet vid hantering av fisk, kött och animaliska produkter",
                        "Rutiner för arbetskläder, kökshanddukar och städmaterial",
                        "Vattenkvalitet - extra rutiner vid egen brunn"
                      ].map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{requirement}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-200/20">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                            Enligt livsmedelslagstiftningen
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            "Det måste finnas ordentlig separation mellan det som tillhör din livsmedelsverksamhet 
                            och det som hör till dina normala hushållsaktiviteter. I vissa fall kan separering ske i tid, 
                            förutsatt att du har goda rutiner för detta."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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