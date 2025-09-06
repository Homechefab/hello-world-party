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
  Upload,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      toast.error("Vänligen fyll i alla obligatoriska fält");
      return;
    }

    if (!formData.hasDeliveryLicense || !formData.hasInsurance || !formData.hasFoodSafetyCert) {
      toast.error("Alla certifieringar och tillstånd måste vara på plats");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Du måste acceptera villkoren för att fortsätta");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Din ansökan har skickats! Vi återkommer inom 2-3 arbetsdagar.");
      navigate("/restaurant/partnership");
    } catch (error) {
      toast.error("Något gick fel. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
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
              Fyll i formuläret nedan för att ansöka om att bli partner. Vi granskar alla ansökningar noggrant.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ansökningsformulär</CardTitle>
                <CardDescription>
                  Alla fält markerade med * är obligatoriska
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
                        placeholder="Berätta om er restaurang, koncept och vad som gör er unika..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialties">Specialiteter och signaturrätta</Label>
                      <Textarea
                        id="specialties"
                        value={formData.specialties}
                        onChange={(e) => handleInputChange('specialties', e.target.value)}
                        placeholder="Lista era mest populära rätter och specialiteter..."
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
                    {isSubmitting ? "Skickar ansökan..." : "Skicka ansökan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

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
                  <span>08-123 45 67</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>restaurants@homechef.se</span>
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