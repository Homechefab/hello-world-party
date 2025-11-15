import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import logoConcept1 from "@/assets/logo-concept-1-warm-home.png";
import logoConcept2 from "@/assets/logo-concept-2-chefs-home.png";
import logoConcept3 from "@/assets/logo-concept-3-community.png";
import logoConcept4 from "@/assets/logo-concept-4-fork-home.png";

const LogoConcepts = () => {
  const concepts = [
    {
      id: 1,
      title: "Varmt Hem-Kök",
      image: logoConcept1,
      description: "Hus med rök som bildar ett hjärta",
      colors: "Orange/Terrakotta + Beige",
      pros: [
        "Stark emotionell koppling",
        "Varma färger stimulerar aptit",
        "Autenticitet genom handritad känsla"
      ],
      cons: [
        "Kan uppfattas som lite lekfull/barnslig"
      ]
    },
    {
      id: 2,
      title: "Chef's Home",
      image: logoConcept2,
      description: "Kockhatt integrerad med hustak",
      colors: "Röd + Grädvit",
      pros: [
        "Tydlig professionell signal",
        "Bra balans mellan hemkänsla och expertis",
        "Enkel, minnesvärd form"
      ],
      cons: [
        "Lite mindre unik (liknande koncept används)"
      ]
    },
    {
      id: 3,
      title: "Community Kitchen",
      image: logoConcept3,
      description: "Människor runt matskål",
      colors: "Orange gradient + Brun",
      pros: [
        "Starkt gemenskapsfokus",
        "Passar marketplace-konceptet",
        "Visar delande och gemenskap"
      ],
      cons: [
        "Mer komplex, kan bli otydlig i liten storlek"
      ]
    },
    {
      id: 4,
      title: "Fork & Home",
      image: logoConcept4,
      description: "Gaffel som bildar hustaget",
      colors: "Korall + Mörkgrön",
      pros: [
        "Superenkel och direkt igenkännbar",
        "Perfekt som app-ikon",
        "Modern och professionell",
        "Skalbar till alla storlekar"
      ],
      cons: [],
      recommended: true
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Homechef Logokoncept</h1>
          <p className="text-muted-foreground text-lg">
            Forskningsbaserade designförslag för att bygga förtroende och locka kunder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {concepts.map((concept) => (
            <Card key={concept.id} className={concept.recommended ? "border-primary border-2" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{concept.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {concept.description}
                    </CardDescription>
                  </div>
                  {concept.recommended && (
                    <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold">
                      REKOMMENDERAD
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Logo Image */}
                <div className="bg-gray-50 rounded-lg p-8 mb-6 flex items-center justify-center">
                  <img 
                    src={concept.image} 
                    alt={concept.title}
                    className="w-full max-w-[300px] h-auto"
                  />
                </div>

                {/* Colors */}
                <div className="mb-4">
                  <h3 className="font-semibold text-sm mb-2">Färger:</h3>
                  <p className="text-muted-foreground text-sm">{concept.colors}</p>
                </div>

                {/* Pros */}
                <div className="mb-4">
                  <h3 className="font-semibold text-sm mb-2 text-green-600">Fördelar:</h3>
                  <ul className="space-y-1">
                    {concept.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                {concept.cons.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-sm mb-2 text-amber-600">Att tänka på:</h3>
                    <ul className="space-y-1">
                      {concept.cons.map((con, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Forskningsgrund</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4 text-sm">
              <p>
                <strong>Minimalistiska logotyper ökar förtroende med 13%</strong> (Journal of Consumer Research, 2024)
              </p>
              <p>
                <strong>Enkel form = 78% bättre igenkänning</strong> - Människor kommer ihåg enkla symboler mycket bättre
              </p>
              <p>
                <strong>Varma färger (orange/röd) stimulerar aptit</strong> och skapar energi, därför används de av de flesta matplattformar
              </p>
              <p>
                <strong>Rundade former signalerar värme och tillgänglighet</strong> vilket är viktigt för hemlagad mat
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogoConcepts;
