import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import logoNew from "@/assets/homechef-logo-new.png";
import logoVariant from "@/assets/homechef-logo-variant.png";
import logoOrange from "@/assets/homechef-logo-orange.png";

const LogoConcepts = () => {
  const concepts = [
    {
      id: 1,
      title: "HC Monogram - Orange Edition",
      image: logoOrange,
      description: "Elegant orange HC-monogram med kockshatt centrerad ovanpå",
      colors: "Orange och vitt",
      pros: [
        "Vibrant och aptitretande färg",
        "Kockshatten centrerad som symbol",
        "Elegant serif-typografi",
        "Sticker ut och är minnesvärd",
        "Perfekt för matbranschen"
      ],
      cons: [],
      recommended: true
    },
    {
      id: 2,
      title: "HC Monogram - Klassisk",
      image: logoNew,
      description: "Elegant serif HC-monogram med kockshatt ovanpå",
      colors: "Svart på vit",
      pros: [
        "Luxuös och premiumkänsla",
        "Tydlig kockshatt-symbol",
        "Elegant serif-typografi",
        "Tidlös och professionell"
      ],
      cons: []
    },
    {
      id: 3,
      title: "HC Monogram - Integrerad",
      image: logoVariant,
      description: "HC-monogram med kockshatt integrerad i H:et",
      colors: "Svart på vit",
      pros: [
        "Kockshatten är del av designen",
        "Unik och minnesvärd",
        "Professionell och clean"
      ],
      cons: []
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Homechef Nya Logotyp</h1>
          <p className="text-muted-foreground text-lg">
            HC-monogram i elegant serif-stil med integrerad kockshatt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          <Card className="bg-muted/50 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Designprinciper</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4 text-sm">
              <p>
                <strong>Monogram-logotyper för premium brands</strong> - HC-monogrammet skapar en luxuös och professionell känsla, liknande de mest framgångsrika matvarumärkena.
              </p>
              <p>
                <strong>Serif-typografi bygger förtroende</strong> - Serif-fonter associeras med kvalitet, tradition och tillförlitlighet, perfekt för matbranschen.
              </p>
              <p>
                <strong>Kockshatten som igenkänningstecken</strong> - Den integrerade kockshatten gör logotypen omedelbart förståelig som matrelaterad utan att vara överdrivet detaljerad.
              </p>
              <p>
                <strong>Svartvit = tidlös och skalbar</strong> - En svartvit logotyp fungerar i alla storlekar och på alla bakgrunder, från app-ikoner till reklamskyltar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogoConcepts;
