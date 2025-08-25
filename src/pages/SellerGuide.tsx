import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChefHat, 
  DollarSign, 
  Shield, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  TrendingUp,
  Clock,
  Camera,
  MapPin,
  Heart,
  Award,
  MessageCircle
} from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const SellerGuide = () => {
  useEffect(() => {
    console.log('SellerGuide component mounted');
  }, []);
  const steps = [
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Ansök som kock",
      description: "Skicka in din ansökan med hygienintyg och provkök",
      details: ["Fyll i ansökningsformulär", "Ladda upp hygienintyg", "Skicka in provkök-video"]
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Få godkännande",
      description: "Vi granskar din ansökan och återkommer inom 24h",
      details: ["Kvalitetsgranskning", "Hygienverifiering", "Smakprovning"]
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Skapa annonser",
      description: "Ladda upp bilder och beskriv dina rätter",
      details: ["Ta aptitliga bilder", "Skriv lockande beskrivningar", "Sätt rätt pris"]
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Börja sälja",
      description: "Ta emot beställningar och tjäna pengar",
      details: ["Hantera beställningar", "Organisera upphämtning", "Få betalt direkt"]
    }
  ];

  const pricingTips = [
    {
      category: "Förrätter",
      priceRange: "49-89 kr",
      tips: "Perfekt som aptitretare. Räkna med mindre portioner men högre marginaler."
    },
    {
      category: "Huvudrätter",
      priceRange: "99-199 kr",
      tips: "Din huvudinkomst. Sätt pris baserat på ingredienser + tid + 30-50% vinst."
    },
    {
      category: "Efterrätter",
      priceRange: "39-79 kr",
      tips: "Populära tilläggsköp. Ofta högre marginaler än huvudrätter."
    },
    {
      category: "Vegetariskt/Veganskt",
      priceRange: "79-149 kr",
      tips: "Växande marknad. Premiumprissättning för specialkost är accepterat."
    }
  ];

  const safetyRules = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Hygienintyg krävs",
      description: "Alla kockar måste ha giltigt hygienintyg från Livsmedelsverket"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Hållbarhetstider",
      description: "Ange korrekt hållbarhet och förvaring för alla rätter"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Allergiinformation",
      description: "Lista alla allergener tydligt enligt EU:s regler"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Säker upphämtning",
      description: "Organisera säkra upphämtningsplatser och -tider"
    }
  ];

  const communityFeatures = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Kockforum",
      description: "Diskutera recept, tips och utmaningar med andra kockar",
      action: "Gå med i diskussionen"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Månadens kock",
      description: "Tävla om att bli månadens kock med extra exponering",
      action: "Se aktuell tävling"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Försäljningsstatistik",
      description: "Jämför din prestanda med andra kockar anonymt",
      action: "Visa statistik"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Mentorskap",
      description: "Få hjälp av erfarna kockar eller hjälp nybörjare",
      action: "Hitta mentor"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero sektion */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Börja sälja hemlagad mat</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Förvandla din passion för matlagning till en lönsam verksamhet
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm">
                <Star className="w-4 h-4 mr-1" />
                4.8/5 i snittbetyg
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                2000+ aktiva kockar
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <DollarSign className="w-4 h-4 mr-1" />
                Snittinkomst 8000 kr/månad
              </Badge>
            </div>
            <Link to="/chef/application">
              <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90">
                Kom igång nu <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Hur det fungerar */}
          <section id="säljguide" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Så här fungerar det</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                      {step.icon}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Prissättningsguide */}
          <section id="prissättning" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Prissättningsguide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {pricingTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tip.category}</CardTitle>
                      <Badge variant="outline" className="font-bold">
                        {tip.priceRange}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.tips}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Prissättningsformel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium mb-2">
                  Ingredienskostnad + Arbetskostnad + Vinstmarginal = Slutpris
                </div>
                <p className="text-muted-foreground">
                  <strong>Tumregel:</strong> Ingredienser 30%, arbete 40%, vinst 30%. 
                  För en rätt som kostar 40 kr i ingredienser: (40 ÷ 0.3) = 133 kr slutpris.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Säkerhetsregler */}
          <section id="säkerhetsregler" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Säkerhetsregler & Krav</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {safetyRules.map((rule, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        {rule.icon}
                      </div>
                      {rule.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{rule.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Shield className="w-5 h-5" />
                  Viktigt att komma ihåg
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-red-600 font-medium">• All mat måste tillagas i godkänt kök</p>
                <p className="text-red-600 font-medium">• Temperaturkontroll är obligatorisk</p>
                <p className="text-red-600 font-medium">• Dokumentera alla ingredienser</p>
                <p className="text-red-600 font-medium">• Följ HACCP-principerna</p>
              </CardContent>
            </Card>
          </section>

          {/* Säljarcommunityn */}
          <section id="community" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Säljarcommunityn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                      {feature.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA sektion */}
          <section className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">Redo att börja din resa?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Gå med i tusentals kockar som redan tjänar pengar på sin passion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chef/application" onClick={() => console.log('Navigating to chef application')}>
                <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90">
                  Ansök som kock
                </Button>
              </Link>
              <Link to="/sell" onClick={() => console.log('Navigating to sell page')}>
                <Button size="lg" variant="outline">
                  Kom igång och sälj din mat om du har ett godkänt beslut från din kommun
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SellerGuide;