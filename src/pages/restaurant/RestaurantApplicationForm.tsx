import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  ArrowLeft,
  CheckCircle,
  Phone,
  Mail,
  Upload
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DocumentUpload } from "@/components/DocumentUpload";

interface RestaurantApplicationData {
  restaurantName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  organizationNumber: string;
  restaurantType: string;
  yearsInBusiness: string;
  dailyOrderCapacity: string;
  description: string;
  specialties: string;
  hasDeliveryLicense: boolean;
  hasInsurance: boolean;
  hasFoodSafetyCert: boolean;
  acceptTerms: boolean;
}

const RestaurantApplicationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);
  const [formData, setFormData] = useState<RestaurantApplicationData>({
    restaurantName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    organizationNumber: "",
    restaurantType: "",
    yearsInBusiness: "",
    dailyOrderCapacity: "",
    description: "",
    specialties: "",
    hasDeliveryLicense: false,
    hasInsurance: false,
    hasFoodSafetyCert: false,
    acceptTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof RestaurantApplicationData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      'restaurantName', 'contactPerson', 'email', 'phone', 'address', 
      'city', 'postalCode', 'organizationNumber', 'restaurantType', 
      'yearsInBusiness', 'dailyOrderCapacity', 'description'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof RestaurantApplicationData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Fält saknas",
        description: "Vänligen fyll i alla obligatoriska fält",
        variant: "destructive"
      });
      return;
    }

    if (!formData.hasDeliveryLicense || !formData.hasInsurance || !formData.hasFoodSafetyCert) {
      toast({
        title: "Certifieringar saknas",
        description: "Alla certifieringar och tillstånd måste vara på plats",
        variant: "destructive"
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Villkor",
        description: "Du måste acceptera villkoren för att fortsätta",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
        
      if (!user) {
        toast({
          title: "Fel",
          description: "Du måste vara inloggad för att skicka in ansökan.",
          variant: "destructive"
        });
        return;
      }

      // Check if user already has an application
      const { data: existingApplication } = await supabase
        .from('restaurants')
        .select('id, application_status')
        .eq('user_id', user.id)
        .maybeSingle();

      // If user has an active or approved application, block new application
      if (existingApplication && ['pending', 'under_review', 'approved'].includes(existingApplication.application_status || '')) {
        toast({
          title: "Ansökan finns redan",
          description: `Du har redan en ${existingApplication.application_status === 'approved' ? 'godkänd' : 'pågående'} ansökan.`,
          variant: "destructive"
        });
        return;
      }

      // If user has a rejected application, delete it first
      if (existingApplication && existingApplication.application_status === 'rejected') {
        await supabase
          .from('restaurants')
          .delete()
          .eq('id', existingApplication.id);
        
        toast({
          title: "Tidigare ansökan borttagen",
          description: "Din nekade ansökan har tagits bort. Du kan nu skicka in en ny.",
        });
      }

      // Create restaurant application
      const { data: newRestaurant, error } = await supabase
        .from('restaurants')
        .insert({
          business_name: formData.restaurantName,
          user_id: user.id,
          full_name: formData.contactPerson,
          contact_email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          restaurant_description: formData.description,
          cuisine_types: formData.specialties,
          application_status: 'pending',
          approved: false
        })
        .select()
        .single();

      if (error) throw error;
      
      // Save restaurant ID and move to document upload step
      setRestaurantId(newRestaurant.id);
      setCurrentStep(2);
      
      toast({
        title: "Uppgifter sparade!",
        description: "Ladda nu upp dina dokument för att slutföra ansökan.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Något gick fel. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUploaded = () => {
    setDocumentsUploaded(true);
  };

  const handleFinalSubmit = async () => {
    if (!restaurantId) return;
    
    try {
      // Update application status to under_review
      const { error } = await supabase
        .from('restaurants')
        .update({ application_status: 'under_review' })
        .eq('id', restaurantId);

      if (error) throw error;

      // Send email notification to admin
      try {
        await supabase.functions.invoke('send-application-notification', {
          body: {
            type: 'restaurant',
            application_id: restaurantId,
            applicant_name: formData.contactPerson,
            applicant_email: formData.email,
            business_name: formData.restaurantName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city
          }
        });
        console.log('Admin notification sent successfully');
      } catch (notifyError) {
        console.error('Failed to send admin notification:', notifyError);
        // Fortsätt även om notifieringen misslyckas
      }

      // Send onboarding guide to applicant
      try {
        await supabase.functions.invoke('send-onboarding-email', {
          body: {
            type: 'restaurant',
            applicant_name: formData.contactPerson,
            applicant_email: formData.email,
            business_name: formData.restaurantName
          }
        });
        console.log('Onboarding email sent successfully');
      } catch (onboardingError) {
        console.error('Failed to send onboarding email:', onboardingError);
        // Fortsätt även om onboarding-mejlet misslyckas
      }

      toast({
        title: "Ansökan skickad!",
        description: "Vi återkommer inom 2-3 arbetsdagar.",
      });
      
      setTimeout(() => {
        navigate("/restaurant/partnership");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Något gick fel. Försök igen senare.",
        variant: "destructive"
      });
    }
  };

  const requirements = [
    "Giltigt restaurangtillstånd",
    "Livsmedelsförsäkring", 
    "HACCP-certifiering",
    "Minst 1 års verksamhet",
    "Kapacitet för 20+ beställningar/dag"
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/restaurant/partnership" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till partnerskap
          </Link>
          
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Store className="w-4 h-4 mr-2" />
              Restaurangansökan
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Ansök som restaurangpartner
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fyll i formuläret så återkommer vi inom 2-3 arbetsdagar.
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= 1 ? 'bg-primary border-primary text-white' : 'bg-white border-border'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <span className="ml-2 mr-4 text-sm font-medium">Uppgifter</span>
            <div className={`w-12 h-px ${currentStep > 1 ? 'bg-primary' : 'bg-border'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ml-4 ${
              currentStep >= 2 ? 'bg-primary border-primary text-white' : 'bg-white border-border'
            }`}>
              {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <span className="ml-2 text-sm font-medium">Dokument</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application Form - Step 1 */}
          {currentStep === 1 && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Steg 1: Restauranguppgifter</CardTitle>
                <CardDescription>
                  Fält med * måste fyllas i
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Restaurant Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Restauranginformation</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="restaurantName">Restaurangnamn *</Label>
                        <Input
                          id="restaurantName"
                          value={formData.restaurantName}
                          onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                          placeholder="Namnet på er restaurang"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="organizationNumber">Organisationsnummer *</Label>
                        <Input
                          id="organizationNumber"
                          value={formData.organizationNumber}
                          onChange={(e) => handleInputChange('organizationNumber', e.target.value)}
                          placeholder="XXXXXX-XXXX"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="restaurantType">Typ av restaurang *</Label>
                        <Select onValueChange={(value) => handleInputChange('restaurantType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Välj typ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fine-dining">Fine dining</SelectItem>
                            <SelectItem value="casual">Casual dining</SelectItem>
                            <SelectItem value="fast-casual">Fast casual</SelectItem>
                            <SelectItem value="ethnic">Etnisk</SelectItem>
                            <SelectItem value="pizza">Pizzeria</SelectItem>
                            <SelectItem value="asian">Asiatisk</SelectItem>
                            <SelectItem value="other">Annat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="yearsInBusiness">År i verksamhet *</Label>
                        <Select onValueChange={(value) => handleInputChange('yearsInBusiness', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Välj antal år" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 år</SelectItem>
                            <SelectItem value="3-5">3-5 år</SelectItem>
                            <SelectItem value="6-10">6-10 år</SelectItem>
                            <SelectItem value="10+">Över 10 år</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Beskrivning av restaurangen *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Beskriv er restaurang, er inriktning och vad som gör er speciella..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialties">Specialiteter och signaturrätter</Label>
                      <Textarea
                        id="specialties"
                        value={formData.specialties}
                        onChange={(e) => handleInputChange('specialties', e.target.value)}
                        placeholder="Era mest populära rätter..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Kontaktinformation</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Kontaktperson *</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          placeholder="För- och efternamn"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Telefon *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="070-123 45 67"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">E-post *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="kontakt@restaurang.se"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Adress *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Gatunummer och gatunamn"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Stad *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Stockholm"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="postalCode">Postnummer *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          placeholder="123 45"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Kapacitet</h3>
                    
                    <div>
                      <Label htmlFor="dailyOrderCapacity">Daglig beställningskapacitet *</Label>
                      <Select onValueChange={(value) => handleInputChange('dailyOrderCapacity', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Antal beställningar per dag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20-50">20-50 beställningar</SelectItem>
                          <SelectItem value="50-100">50-100 beställningar</SelectItem>
                          <SelectItem value="100-200">100-200 beställningar</SelectItem>
                          <SelectItem value="200+">Över 200 beställningar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Certifieringar och tillstånd</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasDeliveryLicense"
                          checked={formData.hasDeliveryLicense}
                          onCheckedChange={(checked) => handleInputChange('hasDeliveryLicense', !!checked)}
                        />
                        <Label htmlFor="hasDeliveryLicense">
                          Vi har giltigt restaurangtillstånd och tillstånd för hemkörning *
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasInsurance"
                          checked={formData.hasInsurance}
                          onCheckedChange={(checked) => handleInputChange('hasInsurance', !!checked)}
                        />
                        <Label htmlFor="hasInsurance">
                          Vi har livsmedelsförsäkring och ansvarsförsäkring *
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasFoodSafetyCert"
                          checked={formData.hasFoodSafetyCert}
                          onCheckedChange={(checked) => handleInputChange('hasFoodSafetyCert', !!checked)}
                        />
                        <Label htmlFor="hasFoodSafetyCert">
                          Vi har HACCP-certifiering och följer livsmedelsregler *
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange('acceptTerms', !!checked)}
                      />
                      <Label htmlFor="acceptTerms">
                        Jag accepterar Homechefs villkor för restaurangpartners *
                      </Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Sparar..." : "Nästa: Ladda upp dokument"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Document Upload - Step 2 */}
          {currentStep === 2 && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Steg 2: Ladda upp dokument
                </CardTitle>
                <CardDescription>
                  Ladda upp era tillstånd och certifikat för granskning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <DocumentUpload 
                  restaurantId={restaurantId || undefined}
                  documentType="restaurant_license"
                  title="Ladda upp restaurangtillstånd"
                  description="Ladda upp ert restaurangtillstånd och relaterade certifikat."
                  onSuccess={handleDocumentUploaded}
                />
                
                {documentsUploaded && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">Dokument uppladdat!</span>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Tillbaka
                  </Button>
                  <Button 
                    onClick={handleFinalSubmit}
                    disabled={!documentsUploaded}
                    className="flex-1"
                    size="lg"
                  >
                    Skicka ansökan
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Du kan ladda upp fler dokument om du behöver. Klicka "Skicka ansökan" när du är klar.
                </p>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Krav för godkännande
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Behöver du hjälp?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>0734-23 46 86</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>info@homechef.nu</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vi svarar på ansökningar inom 2-3 arbetsdagar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantApplicationForm;