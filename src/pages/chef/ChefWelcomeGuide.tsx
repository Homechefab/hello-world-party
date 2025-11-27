import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChefHat,
  Utensils,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Camera,
  DollarSign,
  Clock,
  Bell,
  BarChart3,
  MessageCircle,
  Star
} from 'lucide-react';
import Header from '@/components/Header';

interface GuideStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  tasks: {
    title: string;
    description: string;
    actionText: string;
    actionLink: string;
  }[];
}

const ChefWelcomeGuide = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const guideSteps: GuideStep[] = [
    {
      id: 1,
      title: "Lägg upp din första rätt",
      description: "Börja med att lägga upp en eller flera rätter som dina kunder kan beställa",
      icon: Utensils,
      tasks: [
        {
          title: "Välj en populär rätt",
          description: "Börja med en rätt du är riktigt bra på och som är lätt att laga i större mängder",
          actionText: "Skapa rätt",
          actionLink: "/chef/dashboard"
        },
        {
          title: "Ta professionella bilder",
          description: "Bra bilder ökar försäljningen med upp till 300%! Använd naturligt ljus och fotografera rakt uppifrån",
          actionText: "Tips för fotografering",
          actionLink: "/chef/dashboard"
        },
        {
          title: "Sätt rätt pris",
          description: "Räkna in alla kostnader: ingredienser, el, förpackning och din tid. Glöm inte vår 15% plattformsavgift",
          actionText: "Priskalkylator",
          actionLink: "/chef/dashboard"
        }
      ]
    },
    {
      id: 2,
      title: "Hantera dina beställningar",
      description: "Lär dig hur du tar emot, förbereder och levererar beställningar",
      icon: ShoppingBag,
      tasks: [
        {
          title: "Aktivera notifikationer",
          description: "Få direktmeddelanden när du får nya beställningar via push, email eller SMS",
          actionText: "Aktivera notiser",
          actionLink: "/chef/dashboard"
        },
        {
          title: "Sätt dina tillgängliga tider",
          description: "Välj när du vill ta emot beställningar och när maten kan hämtas",
          actionText: "Ställ in tider",
          actionLink: "/chef/dashboard"
        },
        {
          title: "Förbered maten",
          description: "Du får 24-48 timmars förvarning innan upphämtning. Följ din egen egenkontrollplan",
          actionText: "Visa egenkontroll",
          actionLink: "/chef/dashboard"
        }
      ]
    },
    {
      id: 3,
      title: "Följ din försäljning",
      description: "Håll koll på intäkter, populära rätter och kundrecensioner",
      icon: TrendingUp,
      tasks: [
        {
          title: "Se din försäljningsstatistik",
          description: "Dashboard visar dagens, veckans och månadens försäljning i realtid",
          actionText: "Öppna dashboard",
          actionLink: "/chef/dashboard"
        },
        {
          title: "Läs kundrecensioner",
          description: "Få feedback från nöjda kunder och förbättra dina rätter kontinuerligt",
          actionText: "Se recensioner",
          actionLink: "/chef/dashboard"
        },
        {
          title: "Få utbetalningar",
          description: "Vi betalar ut dina intäkter varje vecka till ditt bankkonto",
          actionText: "Ställ in bankuppgifter",
          actionLink: "/chef/dashboard"
        }
      ]
    },
    {
      id: 4,
      title: "Tips för framgång",
      description: "Så blir du en toppsäljande kock på Homechef",
      icon: Star,
      tasks: [
        {
          title: "Håll hög kvalitet",
          description: "Använd alltid färska ingredienser och följ recept noggrant. Kvalitet ger återkommande kunder",
          actionText: "Kvalitetsguide",
          actionLink: "/chef/dashboard"
        },
        {
          title: "Kommunicera med kunder",
          description: "Svara snabbt på frågor och var tydlig med allergiinformation",
          actionText: "Meddelandecenter",
          actionLink: "/chef/dashboard"
        },
        {
          title: "Experimentera & utvecklas",
          description: "Testa nya rätter baserat på säsong och kundönskemål. Våra bästa kockar uppdaterar sin meny varje månad",
          actionText: "Inspireras av andra",
          actionLink: "/chef/dashboard"
        }
      ]
    }
  ];

  const progress = ((completedSteps.length) / guideSteps.length) * 100;

  const handleCompleteStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleSkipGuide = () => {
    navigate('/chef/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Välkommen som Homechef-kock! 🎉
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Grattis! Din ansökan har godkänts. Låt oss hjälpa dig komma igång.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-1">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Verifierad kock
            </Badge>
            <Badge variant="outline" className="px-4 py-1">
              {completedSteps.length} av {guideSteps.length} steg klara
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Din framgång</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rätter</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Utensils className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Beställningar</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Intjänat</p>
                  <p className="text-2xl font-bold">0 kr</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Betyg</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
                <Star className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guide Steps */}
        <div className="space-y-6 mb-8">
          {guideSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === index;

            return (
              <Card 
                key={step.id} 
                className={`border-2 transition-all ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50/50' 
                    : isCurrent 
                    ? 'border-primary shadow-lg' 
                    : 'border-border hover:border-primary/20'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-100' 
                          : 'bg-gradient-primary'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <StepIcon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Steg {step.id}: {step.title}
                          {isCompleted && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Klar!
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                    {!isCompleted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentStep(index);
                          handleCompleteStep(step.id);
                        }}
                      >
                        Markera som klar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 ml-16">
                    {step.tasks.map((task, taskIndex) => (
                      <div 
                        key={taskIndex}
                        className="flex items-start gap-4 p-4 rounded-lg bg-background border hover:border-primary/20 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">
                            {taskIndex + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {task.description}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(task.actionLink)}
                            className="gap-2"
                          >
                            {task.actionText}
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Success Tips */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Snabba tips för framgång
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Professionella bilder</h4>
                  <p className="text-sm text-muted-foreground">
                    Bra matbilder ökar din försäljning markant
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Snabb respons</h4>
                  <p className="text-sm text-muted-foreground">
                    Svara på beställningar inom 1 timme
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Kommunikation</h4>
                  <p className="text-sm text-muted-foreground">
                    Håll kunder uppdaterade om deras beställning
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/chef/dashboard')}
            className="gap-2"
          >
            <Utensils className="w-5 h-5" />
            Lägg upp min första rätt
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleSkipGuide}
            className="gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            Gå till Dashboard
          </Button>
        </div>

        {/* Help Section */}
        <Card className="mt-8 border-2 border-dashed">
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Behöver du hjälp?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Vårt team finns här för att hjälpa dig komma igång
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Kontakta support
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Se vanliga frågor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChefWelcomeGuide;
