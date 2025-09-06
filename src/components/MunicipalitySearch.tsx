import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ExternalLink, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MunicipalityResult {
  municipality: string;
  links: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

const MunicipalitySearch = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<MunicipalityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const searchMunicipality = async () => {
    if (!address.trim()) {
      toast({
        title: "Ange en adress",
        description: "Vänligen ange en fullständig adress för att söka",
        variant: "destructive"
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "API-nyckel saknas",
        description: "Vänligen ange din Perplexity API-nyckel",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Du är en expert på svenska kommuner och deras e-tjänster. Svara ENDAST med giltigt JSON utan andra tecken eller text.'
            },
            {
              role: 'user',
              content: `För adressen "${address}" i Sverige, hitta vilken kommun den tillhör och ge mig aktuella länkar till ansökningsblanketter eller e-tjänster för livsmedelsregistrering/livsmedelstillstånd från den kommunen. 

Svara i exakt detta JSON-format:
{
  "municipality": "Kommunnamn",
  "links": [
    {
      "title": "Namn på tjänst/blankett",
      "url": "https://fullständig-url",
      "description": "Kort beskrivning"
    }
  ]
}`
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: 'month',
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error('API-anrop misslyckades');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const parsedResult = JSON.parse(content);
        setResult(parsedResult);
        toast({
          title: "Sökning slutförd",
          description: `Hittade information för ${parsedResult.municipality}`,
        });
      } catch (parseError) {
        throw new Error('Kunde inte tolka svaret från API:t');
      }
      
    } catch (error) {
      toast({
        title: "Fel vid sökning",
        description: "Kunde inte hitta information om kommunen. Försök igen eller kontakta oss för hjälp.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* API Key Input - Temporary solution */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800 mb-2">
          <strong>Tillfällig lösning:</strong> Ange din Perplexity API-nyckel för att använda funktionen.
        </p>
        <Input
          type="password"
          placeholder="Perplexity API-nyckel"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="text-xs"
        />
      </div>

      {/* Address Search */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Ange din fullständiga adress (ex. Drottninggatan 1, Stockholm)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchMunicipality()}
          />
        </div>
        <Button 
          onClick={searchMunicipality}
          disabled={loading}
          size="sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-sm">{result.municipality}</h4>
            </div>
            
            <div className="space-y-2">
              {result.links.map((link, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-blue-700">{link.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-xs">Öppna</span>
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              Kontrollera alltid att informationen är aktuell på kommunens webbplats.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MunicipalitySearch;