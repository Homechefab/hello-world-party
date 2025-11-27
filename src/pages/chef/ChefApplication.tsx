import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Upload, FileText, Shield, Clock } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DocumentUpload } from "@/components/DocumentUpload";



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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [chefId, setChefId] = useState<string | null>(null);
  const [documentsUploaded, setDocumentsUploaded] = useState({
    municipalPermit: false,
    hygieneCertificate: false
  });
  const [formData, setFormData] = useState({
    fullName: "",
    contactEmail: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    experience: "",
    specialties: "",
    businessName: "",
    hasMunicipalPermit: false,
    agreesToTerms: false,
    agreesToBackground: false
  });

  const handleNext = async () => {
    // När man går från steg 2 till 3, skapa chef-ansökan så att chefId finns för dokumentuppladdning
    if (currentStep === 2) {
      try {
        // Skapa ny chef-ansökan utan user_id (kommer att sättas vid godkännande)
        const { data: newChef, error } = await supabase
          .from('chefs')
          .insert({
            business_name: formData.businessName || 'Mitt kök',
            user_id: null,
            kitchen_approved: false,
            application_status: 'pending',
            full_name: formData.fullName,
            contact_email: formData.contactEmail,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postal_code: formData.postalCode,
            experience: formData.experience,
            specialties: formData.specialties
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        setChefId(newChef.id);
        setCurrentStep(3);

      } catch (err) {
        console.error(err);
        toast({
          title: "Fel vid skapande av ansökan",
          description: "Något gick fel. Försök igen senare.",
          variant: "destructive"
        });
      }
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Steg 4 - Skicka in ansökan
      try {
        if (!chefId) {
          toast({
            title: "Fel",
            description: "Något gick fel med ansökan. Försök igen.",
            variant: "destructive"
          });
          return;
        }

        // Uppdatera chef-ansökan till "under review"
        const { error } = await supabase
          .from('chefs')
          .update({ 
            application_status: 'under_review',
            business_name: formData.businessName || 'Mitt företag',
            full_name: formData.fullName,
            contact_email: formData.contactEmail,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postal_code: formData.postalCode,
            experience: formData.experience,
            specialties: formData.specialties
          })
          .eq('id', chefId);

        if (error) {
          throw error;
        }

        // Skicka notifiering till admin via edge function
        try {
          await supabase.functions.invoke('notify-admin-application', {
            body: {
              type: 'chef',
              application_id: chefId,
              applicant_name: formData.fullName,
              applicant_email: formData.contactEmail,
              business_name: formData.businessName || 'Mitt företag'
            }
          });
        } catch (notifyError) {
          console.error('Failed to send admin notification:', notifyError);
          // Fortsätt även om notifieringen misslyckas
        }

        toast({
          title: "Ansökan skickad!",
          description: "Vi granskar din ansökan och återkommer via email inom 2-3 arbetsdagar.",
          duration: 5000
        });
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        console.error(err);
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
        return formData.fullName && 
               formData.contactEmail && 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail) &&
               formData.phone && 
               formData.address;
      case 2:
        return formData.experience && formData.specialties;
      case 3:
        return formData.hasMunicipalPermit && documentsUploaded.municipalPermit;
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
          </div>

          {/* Application Section Heading */}
          <div className="text-center mb-8">
            <p className="text-base text-muted-foreground mb-2">
              För att sälja mat krävs tillstånd från kommun
            </p>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Har du redan tillstånd från kommunen?
            </h2>
            <p className="text-lg text-foreground">
              Skicka in ansökan och kom igång inom 24h
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
                      <Label htmlFor="contactEmail">
                        Kontakt-email *
                        <span className="text-xs text-muted-foreground block">
                          (Hit skickas dina inloggningsuppgifter när ansökan godkänns)
                        </span>
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="anna@exempel.se"
                        value={formData.contactEmail}
                        onChange={(e) => updateFormData('contactEmail', e.target.value)}
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

                </>
              )}

              {/* Steg 3: Dokument & certifiering */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Bekräftelse</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hasMunicipalPermit"
                        checked={formData.hasMunicipalPermit}
                        onCheckedChange={(checked) => updateFormData('hasMunicipalPermit', checked as boolean)}
                      />
                      <Label htmlFor="hasMunicipalPermit" className="text-sm">
                        Jag har tillstånd från kommunen *
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dokumentuppladdning</h3>
                    <p className="text-sm text-muted-foreground">
                      Ladda upp ditt kommunbeslut (obligatoriskt). Hygienbeviset kan laddas upp senare.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 border-2 border-primary/20">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <h4 className="font-medium">Kommunbeslut *</h4>
                          {documentsUploaded.municipalPermit && (
                            <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                          )}
                        </div>
                        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant={documentsUploaded.municipalPermit ? "outline" : "default"} 
                              size="sm" 
                              className="w-full"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {documentsUploaded.municipalPermit ? "Uppladdad" : "Ladda upp"}
                            </Button>
                          </DialogTrigger>
                           <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Ladda upp kommunbeslut</DialogTitle>
                            </DialogHeader>
                            {chefId ? (
                              <DocumentUpload 
                                chefId={chefId}
                                onSuccess={() => {
                                  setUploadDialogOpen(false);
                                  setDocumentsUploaded(prev => ({ ...prev, municipalPermit: true }));
                                  toast({
                                    title: "Dokument uppladdad",
                                    description: "Ditt kommunbeslut har laddats upp."
                                  });
                                }}
                              />
                            ) : (
                              <div className="p-6 text-center">
                                <p className="text-muted-foreground">
                                  Laddar...
                                </p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="w-5 h-5 text-primary" />
                          <h4 className="font-medium">Livsmedelshygienbevis (valfritt)</h4>
                          {documentsUploaded.hygieneCertificate && (
                            <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                          )}
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant={documentsUploaded.hygieneCertificate ? "outline" : "secondary"} 
                              size="sm" 
                              className="w-full"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {documentsUploaded.hygieneCertificate ? "Uppladdad" : "Ladda upp"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Ladda upp hygienbevis</DialogTitle>
                            </DialogHeader>
                            <DocumentUpload 
                              chefId={chefId || undefined}
                              onSuccess={() => {
                                setDocumentsUploaded(prev => ({ ...prev, hygieneCertificate: true }));
                                toast({
                                  title: "Dokument uppladdad",
                                  description: "Ditt hygienbevis har laddats upp."
                                });
                              }}
                            />
                          </DialogContent>
                        </Dialog>
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