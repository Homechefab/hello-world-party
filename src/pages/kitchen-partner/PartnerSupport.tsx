import { Phone, Mail, MessageCircle, FileText, Clock, Users, HelpCircle, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PartnerSupport = () => {
  const supportChannels = [
    {
      icon: <Phone className="w-8 h-8 text-primary" />,
      title: "Telefonsupport",
      description: "Ring oss direkt för akuta frågor och direktsupport",
      contact: "0734-234-686",
      hours: "Måndag-Fredag 08:00-18:00"
    },
    {
      icon: <Mail className="w-8 h-8 text-primary" />,
      title: "E-postsupport",
      description: "Skicka detaljerade frågor och få svar inom 24 timmar",
      contact: "info@homechef.nu",
      hours: "Svar inom 24 timmar"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Livechatt",
      description: "Chatta med vårt supportteam i realtid",
      contact: "Tillgänglig på hemsidan",
      hours: "Måndag-Fredag 09:00-17:00"
    }
  ];

  const supportServices = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Onboarding & Utbildning",
      description: "Personlig genomgång av plattformen och bästa praxis för kökshyrning"
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Teknisk Support",
      description: "Hjälp med plattformen, betalningar och tekniska frågor"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Bokningshjälp",
      description: "Support med schemaläggning och hantering av bokningar"
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-primary" />,
      title: "Juridisk Rådgivning",
      description: "Hjälp med kontrakt, försäkring och juridiska frågor"
    }
  ];

  const resources = [
    "Partnermanual och bästa praxis",
    "Videoutbildningar och tutorials",
    "Webinarier för restaurangpartners",
    "Community-forum för partners",
    "Månadsrapporter och analytics",
    "Marknadsföringsmaterial",
    "API-dokumentation",
    "Säkerhetsguider och checklists"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Partnersupport
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vi är här för att hjälpa dig lyckas. Vårt dedikerade supportteam finns tillgängligt för att stödja dig genom hela din resa som restaurangpartner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {supportChannels.map((channel, index) => (
            <Card key={index} className="text-center border-2 hover:border-primary transition-all duration-300">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {channel.icon}
                </div>
                <CardTitle className="text-xl">{channel.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-base">
                  {channel.description}
                </CardDescription>
                <div className="font-semibold text-primary">{channel.contact}</div>
                <div className="text-sm text-muted-foreground">{channel.hours}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-16 bg-gradient-warm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Våra supporttjänster</CardTitle>
            <CardDescription>
              Vi erbjuder omfattande support för alla aspekter av kökshyrning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportServices.map((service, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg">
                  {service.icon}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Resurser & Utbildning</CardTitle>
              </div>
              <CardDescription>
                Tillgång till omfattande resurser för att maximera din framgång som partner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {resources.map((resource, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{resource}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Kontakta oss idag</CardTitle>
              <CardDescription className="text-white/80">
                Har du frågor om att bli partner? Vi hjälper dig gärna att komma igång.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>0734-234-686</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>partner@homechef.com</span>
                </div>
              </div>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/kitchen-partner/register">
                  Bli partner idag
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerSupport;