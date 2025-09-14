import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2,
  FileText,
  Calculator,
  Shield,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  CreditCard,
  Phone,
  Mail,
  Clock,
  BookOpen,
  Gavel
} from 'lucide-react';

const BusinessSetup = () => {
  const [activeTab, setActiveTab] = useState('company-forms');

  const companyForms = [
    {
      type: 'Enskild firma',
      description: 'Enklast att starta, du äger företaget personligen',
      pros: [
        'Snabbt att registrera',
        'Låga startkostnader',
        'Enkel bokföring',
        'Du bestämmer allt själv'
      ],
      cons: [
        'Personligt betalningsansvar',
        'Svårare att få investerare',
        'Begränsade skatteplaneringmöjligheter'
      ],
      cost: 'Gratis',
      timeToStart: '1-2 dagar',
      recommended: true
    },
    {
      type: 'Aktiebolag (AB)',
      description: 'Mer komplext men bättre för större verksamheter',
      pros: [
        'Begränsat betalningsansvar',
        'Lättare att ta in investerare',
        'Bättre skatteplanering',
        'Professionell image'
      ],
      cons: [
        'Kräver aktiekapital 25 000 kr',
        'Mer komplex bokföring',
        'Kräver revisor',
        'Mer administration'
      ],
      cost: '25 000 kr + avgifter',
      timeToStart: '1-2 veckor',
      recommended: false
    }
  ];

  const registrationSteps = [
    {
      step: 1,
      title: 'Välj företagsform',
      description: 'Bestäm om du vill starta enskild firma eller aktiebolag',
      time: '30 min',
      cost: 'Gratis',
      action: 'Överväg för- och nackdelar',
      link: null
    },
    {
      step: 2,
      title: 'Registrera hos Bolagsverket',
      description: 'Anmäl din näringsverksamhet online via Bolagsverket',
      time: '1 timme',
      cost: 'Gratis (enskild firma)',
      action: 'Gå till verksamt.se',
      link: 'https://verksamt.se'
    },
    {
      step: 3,
      title: 'Skaffa F-skattesedel',
      description: 'Ansök om F-skattesedel hos Skatteverket',
      time: '30 min',
      cost: 'Gratis',
      action: 'Ansök på skatteverket.se',
      link: 'https://skatteverket.se'
    },
    {
      step: 4,
      title: 'Öppna företagskonto',
      description: 'Separera privat och företag genom eget företagskonto',
      time: '1 timme',
      cost: 'Bankavgifter',
      action: 'Kontakta din bank',
      link: null
    },
    {
      step: 5,
      title: 'Teckna företagsförsäkringar',
      description: 'Ansvarsförsäkring och andra relevanta försäkringar',
      time: '2 timmar',
      cost: '2 000-5 000 kr/år',
      action: 'Jämför försäkringsbolag',
      link: null
    }
  ];

  const taxInfo = [
    {
      category: 'Inkomstskatt',
      rate: '~30-35%',
      description: 'På nettovinst efter avdrag',
      details: 'Kommunalskatt + statlig inkomstskatt beroende på inkomst'
    },
    {
      category: 'Egenavgifter',
      rate: '28.97%',
      description: 'Pensionsavgifter och socialavgifter',
      details: 'Betalas på överskottet från näringsverksamhet'
    },
    {
      category: 'Moms',
      rate: '25% / 12% / 6%',
      description: 'På försäljning över 30 000 kr/år',
      details: 'Livsmedelsmoms är generellt 25%, vissa undantag finns'
    }
  ];

  const deductions = [
    {
      category: 'Ingredienser & råvaror',
      percentage: '100%',
      description: 'Alla inköp av mat och ingredienser',
      examples: ['Kött, fisk, grönsaker', 'Kryddor och tillbehör', 'Förpackningsmaterial']
    },
    {
      category: 'Köksredskap & utrustning',
      percentage: '100%',
      description: 'Verktyg och utrustning för matlagning',
      examples: ['Knivar och redskap', 'Kastruller och pannor', 'Köksmaskin', 'Kylskåp för verksamhet']
    },
    {
      category: 'Hemmakontor',
      percentage: '50%',
      description: 'Andel av hemkostnader som används för företag',
      examples: ['El och värme (beräknad andel)', 'Internet och telefon', 'Städning av arbetsutrymme']
    },
    {
      category: 'Transport & resor',
      percentage: '100%',
      description: 'Affärsresor och transporter',
      examples: ['Resa till leverantörer', 'Transport av mat', 'Utbildningar och mässor']
    },
    {
      category: 'Marknadsföring',
      percentage: '100%',
      description: 'Kostnader för att marknadsföra verksamheten',
      examples: ['Annonser online', 'Visitkort och broschyrer', 'Hemsida och sociala medier']
    },
    {
      category: 'Utbildning & certifiering',
      percentage: '100%',
      description: 'Kompetensutveckling inom området',
      examples: ['Hygienkurser', 'Matlagningskurser', 'Företagarutbildning']
    }
  ];

  const insuranceTypes = [
    {
      type: 'Ansvarsförsäkring',
      description: 'Skyddar mot skadeståndsanspråk från kunder',
      cost: '1 500-3 000 kr/år',
      required: true,
      coverage: 'Upp till 5-10 miljoner kr'
    },
    {
      type: 'Yrkesansvar',
      description: 'Täcker fel i ditt yrkesutövande som kock',
      cost: '2 000-4 000 kr/år',
      required: false,
      coverage: 'Rådgivning och ekonomisk skada'
    },
    {
      type: 'Produktansvar',
      description: 'Skyddar mot skador orsakade av din mat',
      cost: '1 000-2 000 kr/år',
      required: true,
      coverage: 'Matförgiftning och allergiska reaktioner'
    },
    {
      type: 'Rättsskydd',
      description: 'Juridisk hjälp vid tvister',
      cost: '1 500-3 000 kr/år',
      required: false,
      coverage: 'Juridiska kostnader'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Starta din matverksamhet</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Allt du behöver veta för att registrera och driva din matverksamhet lagligt i Sverige. 
          Vi guidar dig genom alla steg från företagsregistrering till försäkringar.
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Specifikt för matverksamhet:</strong> Som kock som säljer mat behöver du förutom företagsregistrering 
          även ansöka om livsmedelstillstånd hos din kommun. Detta kräver godkänt kök och hygienplan.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company-forms">
            <Building2 className="w-4 h-4 mr-2" />
            Företagsform
          </TabsTrigger>
          <TabsTrigger value="registration">
            <FileText className="w-4 h-4 mr-2" />
            Registrering
          </TabsTrigger>
          <TabsTrigger value="taxes">
            <Calculator className="w-4 h-4 mr-2" />
            Skatter
          </TabsTrigger>
          <TabsTrigger value="deductions">
            <BookOpen className="w-4 h-4 mr-2" />
            Avdrag
          </TabsTrigger>
          <TabsTrigger value="insurance">
            <Shield className="w-4 h-4 mr-2" />
            Försäkringar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company-forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Välj företagsform</CardTitle>
              <CardDescription>
                För de flesta kockar som börjar sälja mat är enskild firma det bästa alternativet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companyForms.map((form, index) => (
                  <Card key={index} className={`relative ${form.recommended ? 'border-primary' : ''}`}>
                    {form.recommended && (
                      <Badge className="absolute -top-2 left-4 bg-primary">
                        Rekommenderat
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {form.type}
                      </CardTitle>
                      <CardDescription>{form.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Kostnad:</span>
                          <p>{form.cost}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Tid att starta:</span>
                          <p>{form.timeToStart}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Fördelar:</h4>
                        <ul className="space-y-1">
                          {form.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">Nackdelar:</h4>
                        <ul className="space-y-1">
                          {form.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registreringsprocess steg för steg</CardTitle>
              <CardDescription>
                Så här registrerar du din verksamhet och kommer igång lagligt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {registrationSteps.map((step) => (
                  <div key={step.step} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{step.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          <span>{step.cost}</span>
                        </div>
                      </div>
                      {step.link ? (
                        <a 
                          href={step.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="mt-2">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {step.action}
                          </Button>
                        </a>
                      ) : (
                        <Button variant="outline" size="sm" className="mt-2" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {step.action}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Viktiga kontakter</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>Bolagsverket: 0771-670 670</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>Skatteverket: 0771-567 567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href="https://verksamt.se" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>verksamt.se</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href="https://skatteverket.se" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>skatteverket.se</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skatter du behöver betala</CardTitle>
              <CardDescription>
                Översikt över de olika skatter som gäller för din matverksamhet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {taxInfo.map((tax, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{tax.category}</h4>
                      <Badge variant="secondary">{tax.rate}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{tax.description}</p>
                    <p className="text-xs text-muted-foreground">{tax.details}</p>
                  </div>
                ))}
              </div>

              <Alert className="mt-6">
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <strong>Exempel:</strong> Om du tjänar 200 000 kr i överskott per år, betalar du ungefär:
                  <br />• Inkomstskatt: ~60 000 kr
                  <br />• Egenavgifter: ~58 000 kr
                  <br />• Totalt: ~118 000 kr (59% av överskott)
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Avdrag du kan göra</CardTitle>
              <CardDescription>
                Kostnader du kan dra av för att minska din skatt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {deductions.map((deduction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{deduction.category}</h4>
                      <Badge className="bg-green-100 text-green-700">
                        {deduction.percentage} avdragsgill
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{deduction.description}</p>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Exempel:</h5>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {deduction.examples.map((example, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <Alert className="mt-6">
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tips:</strong> Spara alla kvitton och håll noggrann bokföring. 
                  En bra regel är att dokumentera allt som har med verksamheten att göra.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Försäkringar du behöver</CardTitle>
              <CardDescription>
                Skydda dig och din verksamhet med rätt försäkringar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insuranceTypes.map((insurance, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${insurance.required ? 'border-red-200 bg-red-50' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        {insurance.required ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Shield className="w-4 h-4 text-blue-500" />
                        )}
                        {insurance.type}
                      </h4>
                      <div className="text-right">
                        <Badge variant={insurance.required ? "destructive" : "secondary"}>
                          {insurance.required ? "Rekommenderas starkt" : "Valfri"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{insurance.cost}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{insurance.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Täckning:</strong> {insurance.coverage}
                    </p>
                  </div>
                ))}
              </div>

              <Alert className="mt-6">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Rekommendation:</strong> Börja med ansvarsförsäkring och produktansvar som minimum. 
                  Du kan alltid utöka försäkringsskyddet när verksamheten växer.
                </AlertDescription>
              </Alert>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Kostnaduppskattning första året</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Ansvarsförsäkring:</span>
                    <span>2 000 kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produktansvar:</span>
                    <span>1 500 kr</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total per år:</span>
                    <span>3 500 kr</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessSetup;