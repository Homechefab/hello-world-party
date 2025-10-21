import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calendar, Clock, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import cateringImage from "@/assets/catering-service.jpg";

const cateringTypes = [
  { value: "corporate", label: "Företagsevent / Konferens" },
  { value: "wedding", label: "Bröllop" },
  { value: "birthday", label: "Födelsedag" },
  { value: "graduation", label: "Studenten" },
  { value: "other", label: "Annat privat event" }
];

const guestRanges = [
  { value: "10-20", label: "10-20 gäster" },
  { value: "20-50", label: "20-50 gäster" },
  { value: "50-100", label: "50-100 gäster" },
  { value: "100+", label: "100+ gäster" }
];

const benefits = [
  "Hemlagad mat av professionella kockar",
  "Skräddarsydda menyer efter dina önskemål",
  "Flexibla leveranstider",
  "Konkurrenskraftiga priser",
  "Försäkrade och godkända kök",
  "Support från bokning till leverans"
];

const CateringPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    guestCount: "",
    eventDate: "",
    location: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Förfrågan skickad!",
      description: "Vi återkommer inom 24 timmar med ett skräddarsytt erbjudande."
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      guestCount: "",
      eventDate: "",
      location: "",
      message: ""
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src={cateringImage} 
          alt="Catering services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Beställ catering för ditt event
              </h1>
              <p className="text-lg md:text-xl mb-6">
                Hemlagad mat från professionella kockar, perfekt för alla tillfällen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Varför välja Homechef för catering?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Request Form Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Begär offert för catering
              </h2>
              <p className="text-muted-foreground">
                Fyll i formuläret så återkommer vi med ett skräddarsytt förslag
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cateringförfrågan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Kontaktinformation */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Kontaktinformation
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Namn *</Label>
                        <Input 
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                          placeholder="Ditt namn"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            required
                            placeholder="070-123 45 67"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-post *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                          placeholder="din@email.se"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Eventinformation */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Eventinformation
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="eventType">Typ av event *</Label>
                        <Select value={formData.eventType} onValueChange={(value) => handleChange("eventType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Välj typ av event" />
                          </SelectTrigger>
                          <SelectContent>
                            {cateringTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guestCount">Antal gäster *</Label>
                        <Select value={formData.guestCount} onValueChange={(value) => handleChange("guestCount", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Välj antal gäster" />
                          </SelectTrigger>
                          <SelectContent>
                            {guestRanges.map((range) => (
                              <SelectItem key={range.value} value={range.value}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Datum för event *</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => handleChange("eventDate", e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Plats / Ort *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleChange("location", e.target.value)}
                          required
                          placeholder="Stockholm, Göteborg, etc."
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Meddelande */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Övriga önskemål eller information</Label>
                    <Textarea 
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Berätta om dina önskemål för maten, allergier, speciella behov, etc."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Skicka förfrågan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Så fungerar det
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Fyll i formulär", desc: "Berätta om ditt event och behov" },
              { step: 2, title: "Få offert", desc: "Vi matchar dig med rätt kock" },
              { step: 3, title: "Bekräfta bokning", desc: "Godkänn offerten och betala" },
              { step: 4, title: "Njut av maten", desc: "Maten levereras på utsatt tid" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CateringPage;
