import { useState } from "react";
import { Building2, Truck, Store, Users, ShoppingCart, Star, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ContactForm {
  name: string;
  email: string;
  company: string;
  partnership: string;
  message: string;
}

const PartnershipPage = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    company: "",
    partnership: "",
    message: ""
  });

  const partnerships = [
    {
      id: "corporate",
      icon: Building2,
      title: "Företagssamarbeten",
      description: "Catering och personalmat för ditt företag",
      benefits: ["Daglig lunch för anställda", "Mötescatering", "Företagsevent", "Hälsosamma alternativ"],
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "restaurants",
      icon: Store,
      title: "Restaurangsamarbeten",
      description: "Etablerade restauranger på vår plattform",
      benefits: ["Nå nya kunder", "Hemkörning av mat", "Marknadsföring", "Teknisk support"],
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "events",
      icon: Users,
      title: "Event & Catering",
      description: "Större event och tillställningar",
      benefits: ["Bröllop och fester", "Företagsevent", "Privata sammankomster", "Volymrabatter"],
      color: "from-orange-500 to-orange-600"
    },
    {
      id: "retail",
      icon: ShoppingCart,
      title: "Matvarukedjor",
      description: "Samarbete med butiker för ingredienser",
      benefits: ["Ingrediensleveranser", "Specialprodukter", "Bulk-inköp", "Logistiksamarbete"],
      color: "from-red-500 to-red-600"
    },
    {
      id: "influencer",
      icon: Star,
      title: "Influencer-program",
      description: "Matbloggers och kockar med stora följare",
      benefits: ["Marknadsföringssamarbeten", "Produktplaceringar", "Event-hosting", "Provisionssystem"],
      color: "from-pink-500 to-pink-600"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Partnership inquiry:", form);
    // Här skulle man skicka till backend
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Samarbeta med Homechef
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Bli en del av Sveriges största marknadsplats för hemlagad mat och väx tillsammans med oss
            </p>
            <Button size="lg" variant="hero" className="bg-white/20 hover:bg-white/30 border-white/30">
              Starta samarbete
            </Button>
          </div>
        </div>
      </section>

      {/* Partnership Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Samarbetsmöjligheter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vi erbjuder olika typer av partnerskap för att tillsammans skapa en bättre matupplevelse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnerships.map((partnership) => {
              const IconComponent = partnership.icon;
              return (
                <Card key={partnership.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className={`w-16 h-16 bg-gradient-to-r ${partnership.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {partnership.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 flex-grow">
                      {partnership.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {partnership.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full mt-auto"
                      onClick={() => setForm({...form, partnership: partnership.id})}
                    >
                      Läs mer
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Kontakta oss
              </h2>
              <p className="text-muted-foreground">
                Berätta om ditt företag och hur vi kan samarbeta
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Namn *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ditt fullständiga namn"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        E-post *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="din@email.se"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Företag/Organisation
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({...form, company: e.target.value})}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Företagsnamn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Typ av samarbete *
                    </label>
                    <select
                      required
                      value={form.partnership}
                      onChange={(e) => setForm({...form, partnership: e.target.value})}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Välj samarbetstyp</option>
                      <option value="corporate">Företagssamarbeten</option>
                      <option value="restaurants">Restaurangsamarbete</option>
                      <option value="events">Event & Catering</option>
                      <option value="retail">Matvarukedja</option>
                      <option value="influencer">Influencer-program</option>
                      <option value="other">Annat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meddelande *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Berätta mer om ditt företag och hur ni vill samarbeta med oss..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Skicka förfrågan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    E-post
                  </h3>
                  <p className="text-muted-foreground">
                    partners@homechef.se
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Telefon
                  </h3>
                  <p className="text-muted-foreground">
                    08-123 45 67
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnershipPage;