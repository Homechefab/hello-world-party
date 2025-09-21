import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  AlertCircle,
  Download,
  ArrowRight,
  ArrowLeft,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  description: string;
  options: {
    value: string;
    label: string;
    points: number;
  }[];
}

const KitchenAssessment = () => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions: Question[] = [
    {
      id: "separation",
      question: "Hur separerar du verksamhet från privat användning?",
      description: "Separation mellan verksamhet och privat användning - i tid eller rum",
      options: [
        { value: "time", label: "Jag arbetar endast vissa tider och städar mellan", points: 2 },
        { value: "space", label: "Jag har separata utrymmen/ytor för verksamheten", points: 3 },
        { value: "none", label: "Jag har ingen separation än", points: 0 },
        { value: "both", label: "Jag har både tids- och rumsseparation", points: 3 }
      ]
    },
    {
      id: "handwashing",
      question: "Har du möjlighet att tvätta händer mellan olika moment?",
      description: "Handhygien - möjlighet att tvätta händer mellan olika moment",
      options: [
        { value: "yes_warm", label: "Ja, med varmt vatten och tvål nära arbetsplatsen", points: 3 },
        { value: "yes_cold", label: "Ja, men endast kallt vatten", points: 1 },
        { value: "far", label: "Ja, men tvättställe är långt från köket", points: 1 },
        { value: "no", label: "Nej, jag saknar lämpligt tvättställe", points: 0 }
      ]
    },
    {
      id: "illness",
      question: "Har du rutiner för vad som gäller när någon i hemmet är sjuk?",
      description: "Rutiner för sjukdom - vad som gäller när någon i hemmet är sjuk",
      options: [
        { value: "written", label: "Ja, jag har skriftliga rutiner", points: 3 },
        { value: "mental", label: "Ja, jag vet vad som gäller", points: 2 },
        { value: "some", label: "Jag har delvis koll på detta", points: 1 },
        { value: "no", label: "Nej, jag behöver lära mig mer", points: 0 }
      ]
    },
    {
      id: "cleaning",
      question: "Har du rutiner för rengöring av redskap, ytor och utrustning?",
      description: "Rengöringsrutiner för redskap, ytor och utrustning",
      options: [
        { value: "documented", label: "Ja, dokumenterade rutiner med schema", points: 3 },
        { value: "routine", label: "Ja, jag har fasta rutiner", points: 2 },
        { value: "basic", label: "Jag städar grundligt men utan fasta rutiner", points: 1 },
        { value: "no", label: "Jag behöver utveckla bättre rutiner", points: 0 }
      ]
    },
    {
      id: "family_pets",
      question: "Har du rutiner för familjemedlemmar och husdjur under verksamhet?",
      description: "Rutiner för familjemedlemmar och husdjur under verksamhet",
      options: [
        { value: "strict", label: "Ja, familj/djur har begränsad tillgång under arbetstid", points: 3 },
        { value: "some", label: "Jag har vissa regler men de kan förbättras", points: 2 },
        { value: "informal", label: "Vi är försiktiga men har inga fasta rutiner", points: 1 },
        { value: "no", label: "Jag behöver utveckla rutiner för detta", points: 0 }
      ]
    },
    {
      id: "surfaces",
      question: "Har du tillräckligt med ytor för att separera råvaror och färdiga produkter?",
      description: "Tillräckligt med ytor för att separera råvaror och färdiga produkter",
      options: [
        { value: "ample", label: "Ja, gott om separata ytor och skärbrädor", points: 3 },
        { value: "adequate", label: "Ja, tillräckligt med planering", points: 2 },
        { value: "tight", label: "Det fungerar men är trångt", points: 1 },
        { value: "insufficient", label: "Nej, jag behöver mer yta", points: 0 }
      ]
    },
    {
      id: "temperature",
      question: "Har du lämplig utrustning för temperaturkontroll?",
      description: "Lämplig utrustning för temperaturkontroll och hygien",
      options: [
        { value: "complete", label: "Ja, termometrar för mat och kyl/frys", points: 3 },
        { value: "partial", label: "Jag har viss utrustning men behöver mer", points: 2 },
        { value: "basic", label: "Jag har grundläggande utrustning", points: 1 },
        { value: "none", label: "Jag saknar temperaturkontroll", points: 0 }
      ]
    },
    {
      id: "haccp",
      question: "Har du gjort en HACCP-analys av din verksamhet?",
      description: "HACCP-analys av risker i din specifika verksamhet",
      options: [
        { value: "complete", label: "Ja, fullständig analys och dokumentation", points: 3 },
        { value: "started", label: "Jag har påbörjat processen", points: 2 },
        { value: "know", label: "Jag vet vad det är men inte gjort det än", points: 1 },
        { value: "unknown", label: "Jag behöver lära mig om HACCP", points: 0 }
      ]
    }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    
    questions.forEach(question => {
      const answer = answers[question.id];
      const selectedOption = question.options.find(opt => opt.value === answer);
      if (selectedOption) {
        totalScore += selectedOption.points;
      }
      maxScore += Math.max(...question.options.map(opt => opt.points));
    });
    
    return { totalScore, maxScore, percentage: Math.round((totalScore / maxScore) * 100) };
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreText = (percentage: number) => {
    if (percentage >= 80) return "Utmärkt! Ditt kök är väl förberett.";
    if (percentage >= 60) return "Bra start! Några förbättringar behövs.";
    return "Du behöver göra flera förändringar innan ansökan.";
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const downloadChecklist = () => {
    toast({
      title: "Checklista laddas ner",
      description: "Din personliga checklista har laddats ner baserat på dina svar.",
    });
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <Badge variant="secondary" className="mb-4 mx-auto w-fit">
                  <Shield className="w-4 h-4 mr-2" />
                  Resultat
                </Badge>
                <CardTitle className="text-2xl">Din köksbedömning</CardTitle>
                <CardDescription>
                  Baserat på dina svar har vi bedömt hur väl ditt kök uppfyller kraven
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(score.percentage)}`}>
                    {score.percentage}%
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {score.totalScore} av {score.maxScore} poäng
                  </p>
                  <p className={`text-lg ${getScoreColor(score.percentage)}`}>
                    {getScoreText(score.percentage)}
                  </p>
                </div>

                <div className="bg-secondary/30 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Nästa steg:</h3>
                  <div className="space-y-3 text-sm">
                    {score.percentage >= 80 ? (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Du kan börja ansöka om kommunalt tillstånd</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <span>Förbättra områdena där du fick låga poäng innan ansökan</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-primary mt-0.5" />
                      <span>Ladda ner den personliga checklistan baserat på dina svar</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={downloadChecklist} size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Download className="w-5 h-5 mr-2" />
                    Ladda ner checklista
                  </Button>
                  <Button variant="outline" onClick={restartAssessment} size="lg">
                    Gör om bedömningen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Köksbedömning
            </Badge>
            <h1 className="text-3xl font-bold mb-4">Bedöm ditt kök</h1>
            <p className="text-muted-foreground mb-6">
              Svara på frågorna för att se hur väl ditt kök uppfyller kommunens krav
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Fråga {currentQuestion + 1} av {questions.length}</span>
                <span>{Math.round(progress)}% klart</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQ.question}</CardTitle>
              <CardDescription>{currentQ.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={currentAnswer || ""} 
                onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
              >
                {currentQ.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Föregående
                </Button>
                
                <Button 
                  onClick={nextQuestion}
                  disabled={!currentAnswer}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  {currentQuestion === questions.length - 1 ? "Se resultat" : "Nästa"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KitchenAssessment;