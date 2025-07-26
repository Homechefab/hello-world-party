import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface QuestionAnswer {
  question: string;
  answer: string;
  category: string;
}

interface HygieneForm {
  chefName: string;
  date: string;
  kitchenAddress: string;
  answers: QuestionAnswer[];
}

const hygieneQuestions = [
  {
    category: "Personlig hygien",
    questions: [
      "Har du tvättat händerna innan matlagning?",
      "Använder du ren arbetskläder och förkläde?",
      "Har du kort och rena naglar?",
      "Är ditt hår täckt eller uppsatt?"
    ]
  },
  {
    category: "Kökshygien",
    questions: [
      "Har arbetsytorna rengjorts före matlagning?",
      "Är alla redskap rena och desinficerade?",
      "Har kylskåpets temperatur kontrollerats (max 4°C)?",
      "Har frysens temperatur kontrollerats (max -18°C)?"
    ]
  },
  {
    category: "Råvaror och förvaring",
    questions: [
      "Har alla råvarors bäst före-datum kontrollerats?",
      "Förvaras råa och tillagade livsmedel separerat?",
      "Har kött och fisk rätt förvaringstemperatur?",
      "Är alla livsmedel korrekt förpackade och märkta?"
    ]
  },
  {
    category: "Matlagning och servering",
    questions: [
      "Har kärntemperaturen i kött kontrollerats (min 75°C)?",
      "Hålls varm mat vid rätt temperatur (min 60°C)?",
      "Serveras maten inom 2 timmar efter tillagning?",
      "Används separata redskap för råa och tillagade produkter?"
    ]
  },
  {
    category: "Rengöring och avfall",
    questions: [
      "Har alla ytor och redskap rengjorts efter användning?",
      "Är avfallet korrekt sorterat och förpackat?",
      "Har diskmaskin/handtvätt skett vid rätt temperatur?",
      "Är rengöringsmedel korrekt förvarade?"
    ]
  }
];

export const HygieneQuestionnaire = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<HygieneForm>({
    chefName: '',
    date: new Date().toISOString().split('T')[0],
    kitchenAddress: '',
    answers: hygieneQuestions.flatMap(cat => 
      cat.questions.map(q => ({ question: q, answer: '', category: cat.category }))
    )
  });

  const [isCompleted, setIsCompleted] = useState(false);

  const updateAnswer = (questionIndex: number, answer: string) => {
    const updatedAnswers = [...form.answers];
    updatedAnswers[questionIndex].answer = answer;
    const updatedForm = { ...form, answers: updatedAnswers };
    setForm(updatedForm);

    // Check if all questions are answered
    const allAnswered = updatedAnswers.every(a => a.answer.trim() !== '');
    setIsCompleted(allAnswered && !!updatedForm.chefName && !!updatedForm.kitchenAddress);
  };

  const updateFormField = (field: keyof HygieneForm, value: string) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    
    if (field === 'chefName' || field === 'kitchenAddress') {
      const allAnswered = updatedForm.answers.every(a => a.answer.trim() !== '');
      setIsCompleted(allAnswered && !!updatedForm.chefName && !!updatedForm.kitchenAddress && value.trim() !== '');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('HYGIENKONTROLLPLAN', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Kock: ${form.chefName}`, 20, 35);
    doc.text(`Datum: ${form.date}`, 20, 45);
    doc.text(`Köksadress: ${form.kitchenAddress}`, 20, 55);
    
    let yPosition = 75;
    
    hygieneQuestions.forEach((category) => {
      // Category header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(category.category, 20, yPosition);
      yPosition += 10;
      
      // Questions and answers for this category
      category.questions.forEach((question) => {
        const answer = form.answers.find(a => a.question === question)?.answer || '';
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Question
        const questionLines = doc.splitTextToSize(`Q: ${question}`, 170);
        questionLines.forEach((line: string) => {
          doc.text(line, 25, yPosition);
          yPosition += 5;
        });
        
        // Answer
        doc.setFont('helvetica', 'italic');
        const answerLines = doc.splitTextToSize(`A: ${answer}`, 170);
        answerLines.forEach((line: string) => {
          doc.text(line, 25, yPosition);
          yPosition += 5;
        });
        
        yPosition += 5; // Extra space between Q&A pairs
        
        // Check if we need a new page
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      yPosition += 10; // Extra space between categories
    });
    
    // Footer
    doc.setFontSize(8);
    doc.text(`Genererat: ${new Date().toLocaleString('sv-SE')}`, 20, 285);
    
    doc.save(`Hygienkontroll_${form.chefName}_${form.date}.pdf`);
    
    toast({
      title: "PDF genererad!",
      description: "Din hygienkontrollplan har laddats ner som PDF.",
    });
  };

  const getCompletionPercentage = () => {
    const answeredQuestions = form.answers.filter(a => a.answer.trim() !== '').length;
    const totalQuestions = form.answers.length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Hygienkontrollplan
            {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
          </CardTitle>
          <CardDescription>
            Besvara alla frågor för att skapa en komplett hygienkontrollplan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {getCompletionPercentage()}% färdig
              </Badge>
              {isCompleted ? (
                <Badge className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Redo för PDF
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Ofullständig
                </Badge>
              )}
            </div>
            <Button 
              onClick={generatePDF} 
              disabled={!isCompleted}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Ladda ner PDF
            </Button>
          </div>
          
          {/* Basic information */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div>
              <Label htmlFor="chefName">Kockens namn</Label>
              <Input
                id="chefName"
                value={form.chefName}
                onChange={(e) => updateFormField('chefName', e.target.value)}
                placeholder="Ditt fullständiga namn"
              />
            </div>
            <div>
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => updateFormField('date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kitchenAddress">Köksadress</Label>
              <Input
                id="kitchenAddress"
                value={form.kitchenAddress}
                onChange={(e) => updateFormField('kitchenAddress', e.target.value)}
                placeholder="Fullständig adress"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions by category */}
      {hygieneQuestions.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="text-lg">{category.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.questions.map((question, questionIndex) => {
              const globalIndex = hygieneQuestions
                .slice(0, categoryIndex)
                .reduce((acc, cat) => acc + cat.questions.length, 0) + questionIndex;
              
              return (
                <div key={questionIndex} className="space-y-2">
                  <Label className="text-sm font-medium">{question}</Label>
                  <Textarea
                    value={form.answers[globalIndex]?.answer || ''}
                    onChange={(e) => updateAnswer(globalIndex, e.target.value)}
                    placeholder="Beskriv hur du utför denna kontroll..."
                    className="min-h-[80px]"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};