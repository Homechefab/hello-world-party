import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ExternalLink, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");

  const searchMunicipality = async () => {
    if (!address.trim()) {
      toast({
        title: "Ange en adress",
        description: "Vänligen ange en fullständig adress för att söka",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Try with Supabase function first
      const { data, error } = await supabase.functions.invoke('municipality-search', {
        body: { 
          address,
          // If user provided temporary API key, include it
          tempApiKey: tempApiKey || undefined
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        // If Supabase function fails and user has temp API key, try direct call
        if (tempApiKey) {
          return await searchWithDirectCall();
        }
        throw new Error('API-anrop misslyckades via Supabase function');
      }

      if (data.error) {
        // If we get specific error about API key and user has temp key, try direct call
        if (data.error.includes('API-nyckel') && tempApiKey) {
          return await searchWithDirectCall();
        }
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: "Sökning slutförd",
        description: `Hittade information för ${data.municipality}`,
      });
      
    } catch (error) {
      console.error('Municipality search error:', error);
      toast({
        title: "Fel vid sökning",
        description: error instanceof Error ? error.message : "Kunde inte hitta information om kommunen. Försök igen eller kontakta oss för hjälp.",
        variant: "destructive"
      });
      // Show API key input if search fails
      setShowApiKeyInput(true);
    } finally {
      setLoading(false);
    }
  };

  const searchWithDirectCall = async () => {
    if (!tempApiKey) {
      throw new Error('Ingen temporär API-nyckel angiven');
    }

    if (!tempApiKey.startsWith('pplx-')) {
      throw new Error('API-nyckeln måste börja med "pplx-". Kontrollera att du har angett en riktig Perplexity API-nyckel.');
    }

    if (tempApiKey.length < 20) {
      throw new Error('API-nyckeln verkar för kort. En riktig Perplexity API-nyckel är cirka 40 tecken lång.');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tempApiKey}`,
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
      const errorText = await response.text();
      console.error('Direct API call failed:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('API-nyckeln är ogiltig. Kontrollera att du har angett rätt Perplexity API-nyckel.');
      }
      throw new Error(`API-anrop misslyckades: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const parsedResult = JSON.parse(content);
    setResult(parsedResult);
    toast({
      title: "Sökning slutförd (direktanrop)",
      description: `Hittade information för ${parsedResult.municipality}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Temporary API Key Input (shown if search fails) */}
      {showApiKeyInput && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-600 font-semibold text-sm">!</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-2">API-nyckel krävs</h4>
              <p className="text-sm text-amber-800 mb-3">
                För att använda kommunsökningen behöver du en giltig Perplexity API-nyckel. 
                En riktig API-nyckel börjar med "pplx-" och är cirka 40 tecken lång.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-amber-700 mb-1">
                    Din Perplexity API-nyckel
                  </label>
                  <Input
                    type="password"
                    placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    className={`text-sm ${
                      tempApiKey && !tempApiKey.startsWith('pplx-') 
                        ? 'border-red-300 focus:border-red-500' 
                        : ''
                    }`}
                  />
                  {tempApiKey && !tempApiKey.startsWith('pplx-') && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠️ API-nyckeln ska börja med "pplx-"
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowApiKeyInput(false)}
                  >
                    Stäng
                  </Button>
                  <a 
                    href="https://www.perplexity.ai/settings/api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-amber-700 hover:text-amber-900 underline"
                  >
                    🔗 Skaffa API-nyckel här
                  </a>
                </div>
                
                <div className="bg-amber-100 rounded p-2">
                  <p className="text-xs text-amber-800">
                    <strong>Steg för steg:</strong><br/>
                    1. Klicka på länken ovan<br/>
                    2. Logga in på Perplexity AI<br/>
                    3. Gå till "API" i inställningarna<br/>
                    4. Skapa en ny API-nyckel<br/>
                    5. Kopiera nyckeln och klistra in här
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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