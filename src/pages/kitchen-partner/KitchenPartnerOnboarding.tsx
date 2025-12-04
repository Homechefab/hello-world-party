import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface KitchenData {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  kitchenSize: string;
  postalCode: string;
  kitchenType: string;
  capacity: string;
  hourlyRate: string;
  description: string;
  facilities: string[];
  availability: string[];
  businessLicense: File | null;
  kitchenImages: File[];
}

export const KitchenPartnerOnboarding = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<KitchenData>({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    kitchenSize: '',
    postalCode: '',
    kitchenType: '',
    capacity: '',
    hourlyRate: '',
    description: '',
    facilities: [],
    availability: [],
    businessLicense: null,
    kitchenImages: []
  });

  // Check for existing application on mount
  useEffect(() => {
    const checkExistingApplication = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: existingApplication } = await supabase
          .from('kitchen_partners')
          .select('application_status, approved')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingApplication) {
          if (existingApplication.approved || existingApplication.application_status === 'approved') {
            toast({
              title: "Redan godkänd",
              description: "Du har redan en godkänd kökspartner-ansökan",
            });
            navigate('/kitchen-partner/dashboard');
            return;
          } else if (existingApplication.application_status === 'pending') {
            navigate('/kitchen-partner/application-pending');
            return;
          }
          // If rejected, allow resubmission - we'll delete the old application first
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking existing application:', error);
        setIsLoading(false);
      }
    };

    checkExistingApplication();
  }, [navigate, toast]);

  const facilityOptions = [
    'Professionell spis',
    'Ugn',
    'Kylskåp',
    'Frys',
    'Diskmaskin',
    'Arbetsytor i rostfritt stål',
    'Parkering',
    'Leveransområde',
    'Förvaring'
  ];

  const availabilityOptions = [
    'Måndag-Fredag morgon',
    'Måndag-Fredag eftermiddag',
    'Måndag-Fredag kväll',
    'Helger',
    'Natt (22:00-06:00)',
    'Hela dygnet'
  ];

  const handleInputChange = (field: keyof KitchenData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFacilityChange = (facility: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      facilities: checked 
        ? [...prev.facilities, facility]
        : prev.facilities.filter(f => f !== facility)
    }));
  };

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: checked 
        ? [...prev.availability, availability]
        : prev.availability.filter(a => a !== availability)
    }));
  };

  const handleFileUpload = (field: 'businessLicense' | 'kitchenImages', files: FileList | null) => {
    if (!files) return;
    
    if (field === 'businessLicense') {
      setFormData(prev => ({ ...prev, businessLicense: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, kitchenImages: Array.from(files) }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.businessName || !formData.contactPerson || !formData.email) {
      toast({
        title: "Obligatoriska fält saknas",
        description: "Fyll i alla obligatoriska fält för att fortsätta",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Autentiseringsfel",
          description: "Du måste vara inloggad för att skicka en ansökan",
          variant: "destructive"
        });
        return;
      }

      // Delete any rejected application before creating new one
      await supabase
        .from('kitchen_partners')
        .delete()
        .eq('user_id', user.id)
        .eq('application_status', 'rejected');

      const { data: insertedData, error } = await supabase.from('kitchen_partners').insert({
        business_name: formData.businessName,
        address: `${formData.address}, ${formData.city}`,
        kitchen_size: parseInt(formData.kitchenSize) || 0,
        hourly_rate: parseFloat(formData.hourlyRate) || 0,
        kitchen_description: formData.description,
        equipment_details: formData.facilities.join(', '),
        municipality: formData.city,
        approved: false,
        application_status: 'pending',
        user_id: user.id
      }).select().single();

      if (error) {
        throw error;
      }

      // Upload business license if provided
      if (formData.businessLicense) {
        try {
          const fileExt = formData.businessLicense.name.split('.').pop();
          const fileName = `${user.id}/${insertedData.id}/business-license-${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, formData.businessLicense);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

          // Save document metadata
          await supabase.from('document_submissions').insert({
            user_id: user.id,
            document_type: 'business_license',
            document_url: publicUrl,
            municipality: formData.city,
            status: 'pending'
          });
        } catch (uploadError) {
          console.error('Failed to upload business license:', uploadError);
        }
      }

      // Upload kitchen images if provided
      if (formData.kitchenImages.length > 0) {
        try {
          for (const image of formData.kitchenImages) {
            const fileExt = image.name.split('.').pop();
            const fileName = `${user.id}/${insertedData.id}/kitchen-image-${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
              .from('documents')
              .upload(fileName, image);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('documents')
              .getPublicUrl(fileName);

            // Save document metadata
            await supabase.from('document_submissions').insert({
              user_id: user.id,
              document_type: 'kitchen_image',
              document_url: publicUrl,
              municipality: formData.city,
              status: 'pending'
            });
          }
        } catch (uploadError) {
          console.error('Failed to upload kitchen images:', uploadError);
        }
      }

      // Send notification to admin
      try {
        await supabase.functions.invoke('notify-admin-kitchen-partner', {
          body: {
            businessName: formData.businessName,
            contactPerson: formData.contactPerson,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}`,
            municipality: formData.city,
            hourlyRate: parseFloat(formData.hourlyRate) || 0,
            applicationId: insertedData?.id || 'unknown'
          }
        });
        console.log('Admin notification sent successfully');
      } catch (notificationError) {
        console.error('Failed to send admin notification:', notificationError);
        // Don't fail the whole process if notification fails
      }

      toast({
        title: "Ansökan skickad!",
        description: "Vi kommer att granska din ansökan och återkomma inom 2-3 arbetsdagar"
      });

      // Redirect to pending page
      window.location.href = '/kitchen-partner/application-pending';
    } catch (err) {
      console.error(err);
      toast({
        title: "Fel vid skickning", 
        description: "Något gick fel. Försök igen senare.",
        variant: "destructive"
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bli Kökspartner
          </h1>
          <p className="text-muted-foreground">
            Hyr ut ditt kök till kockar och tjäna extra pengar
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {currentStep === 1 && "Grundläggande information"}
              {currentStep === 2 && "Köksinformation"}
              {currentStep === 3 && "Faciliteter & Tillgänglighet"}
              {currentStep === 4 && "Dokument & Slutföra"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Info om ditt företag och kontaktuppgifter"}
              {currentStep === 2 && "Beskriv ditt kök och sätt pris"}
              {currentStep === 3 && "Vad finns i köket och när är det ledigt"}
              {currentStep === 4 && "Ladda upp dokument och skicka ansökan"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Steg 1: Grundläggande information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Företagsnamn *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="T.ex. Marias Restaurang AB"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPerson">Kontaktperson *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="För- och efternamn"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-post *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="kontakt@dittforetag.se"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="070-123 45 67"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adress</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Gatuadress"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Stad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Stockholm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postnummer</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="123 45"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Steg 2: Köksinformation */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="kitchenType">Typ av kök</Label>
                  <Select onValueChange={(value) => handleInputChange('kitchenType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kökstyp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurangkök</SelectItem>
                      <SelectItem value="catering">Cateringkök</SelectItem>
                      <SelectItem value="bakery">Bageri</SelectItem>
                      <SelectItem value="commercial">Kommersiellt kök</SelectItem>
                      <SelectItem value="shared">Delat kök</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="capacity">Kapacitet (antal personer som kan arbeta samtidigt)</Label>
                  <Select onValueChange={(value) => handleInputChange('capacity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kapacitet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 personer</SelectItem>
                      <SelectItem value="3-5">3-5 personer</SelectItem>
                      <SelectItem value="6-10">6-10 personer</SelectItem>
                      <SelectItem value="10+">Fler än 10 personer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Timkostnad (kr/timme)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    placeholder="250"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Beskrivning av köket</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Beskriv ditt kök, vilken utrustning som finns och vad som är speciellt..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Steg 3: Faciliteter & Tillgänglighet */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Tillgängliga faciliteter</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {facilityOptions.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={facility}
                          checked={formData.facilities.includes(facility)}
                          onCheckedChange={(checked) => 
                            handleFacilityChange(facility, checked as boolean)
                          }
                        />
                        <Label htmlFor={facility} className="text-sm">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Tillgänglighet</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {availabilityOptions.map((availability) => (
                      <div key={availability} className="flex items-center space-x-2">
                        <Checkbox
                          id={availability}
                          checked={formData.availability.includes(availability)}
                          onCheckedChange={(checked) => 
                            handleAvailabilityChange(availability, checked as boolean)
                          }
                        />
                        <Label htmlFor={availability} className="text-sm">
                          {availability}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Steg 4: Dokument */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="businessLicense">Näringstillstånd (valfritt)</Label>
                  <Input
                    id="businessLicense"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('businessLicense', e.target.files)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, JPG eller PNG. Max 10MB.
                  </p>
                </div>

                <div>
                  <Label htmlFor="kitchenImages">Bilder på köket</Label>
                  <Input
                    id="kitchenImages"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('kitchenImages', e.target.files)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Välj flera bilder som visar ditt kök. JPG eller PNG.
                  </p>
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Vad händer nu:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Vi kollar din ansökan inom 2-3 dagar</li>
                    <li>• Du får svar via mejl</li>
                    <li>• När du är godkänd får du tillgång till din dashboard</li>
                    <li>• Då kan kockar börja boka ditt kök</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Tillbaka
              </Button>

              {currentStep < 4 ? (
                <Button onClick={nextStep}>
                  Nästa steg
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Skicka ansökan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};