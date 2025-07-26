import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Upload, 
  FileText, 
  User, 
  Building,
  Shield,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const ChefOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      address: ''
    },
    business: {
      businessName: '',
      description: '',
      municipality: ''
    },
    documents: {
      selfControlPlan: null,
      businessLicense: null
    }
  });

  const steps = [
    { id: 1, title: 'Personlig Information', icon: User },
    { id: 2, title: 'Företagsinformation', icon: Building },
    { id: 3, title: 'Dokument & Certifikat', icon: FileText },
    { id: 4, title: 'Granskning', icon: Shield }
  ];

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName">Fullständigt namn</Label>
              <Input
                id="fullName"
                value={formData.personal.fullName}
                onChange={(e) => updateFormData('personal', 'fullName', e.target.value)}
                placeholder="Ange ditt fullständiga namn"
              />
            </div>
            <div>
              <Label htmlFor="email">E-postadress</Label>
              <Input
                id="email"
                type="email"
                value={formData.personal.email}
                onChange={(e) => updateFormData('personal', 'email', e.target.value)}
                placeholder="din@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                value={formData.personal.phone}
                onChange={(e) => updateFormData('personal', 'phone', e.target.value)}
                placeholder="+46 70 123 45 67"
              />
            </div>
            <div>
              <Label htmlFor="address">Adress</Label>
              <Textarea
                id="address"
                value={formData.personal.address}
                onChange={(e) => updateFormData('personal', 'address', e.target.value)}
                placeholder="Gata, postnummer, stad"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="businessName">Företagsnamn</Label>
              <Input
                id="businessName"
                value={formData.business.businessName}
                onChange={(e) => updateFormData('business', 'businessName', e.target.value)}
                placeholder="Ditt hemkök eller företagsnamn"
              />
            </div>
            <div>
              <Label htmlFor="municipality">Kommun</Label>
              <Input
                id="municipality"
                value={formData.business.municipality}
                onChange={(e) => updateFormData('business', 'municipality', e.target.value)}
                placeholder="Vilken kommun befinner sig ditt kök i?"
              />
            </div>
            <div>
              <Label htmlFor="description">Beskrivning</Label>
              <Textarea
                id="description"
                value={formData.business.description}
                onChange={(e) => updateFormData('business', 'description', e.target.value)}
                placeholder="Berätta om din matlagning och specialiteter..."
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Viktiga dokument krävs</h4>
              <p className="text-sm text-yellow-700">
                För att kunna sälja mat på vår plattform måste du ladda upp följande dokument. 
                Alla ansökningar granskas manuellt av våra administratörer innan godkännande.
              </p>
            </div>

            <div>
              <Label>Egenkontrollplan *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Dokument som visar hur du säkerställer livsmedelssäkerhet i ditt kök
              </p>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Ladda upp din egenkontrollplan (PDF eller bild)
                </p>
                <Button variant="outline" size="sm">Välj fil</Button>
              </div>
            </div>
            
            <div>
              <Label>Kommunens tillstånd för mathantering *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Tillstånd från din kommun att bedriva livsmedelsverksamhet i hemmet
              </p>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Ladda upp kommunens tillstånd (PDF)
                </p>
                <Button variant="outline" size="sm">Välj fil</Button>
              </div>
            </div>

            <div>
              <Label>F-skattsedel/Näringstillstånd *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Bevis på att du har rätt att bedriva näringsverksamhet i Sverige
              </p>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Ladda upp din F-skattsedel eller näringstillstånd (PDF)
                </p>
                <Button variant="outline" size="sm">Välj fil</Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Ansökan skickad!</h3>
              <p className="text-muted-foreground">
                Din ansökan är nu under granskning. Vi kommer att kontakta dig inom 2 arbetsdagar.
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <h4 className="font-medium mb-3">Nästa steg:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Granskning av dokument (1-2 dagar)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  Slutgodkännande och aktivering
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Välkommen som kock!</h1>
          <p className="text-muted-foreground">
            Följ stegen nedan för att komma igång med att sälja din hemlagade mat
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-primary text-white' :
                    isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs text-center ${
                    isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              Steg {currentStep} av {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Nästa
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={() => window.location.href = '/chef/dashboard'}>
              Gå till Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};