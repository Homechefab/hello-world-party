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
      const { data, error } = await supabase.functions.invoke('municipality-search', {
        body: { address }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('API-anrop misslyckades');
      }

      if (data.error) {
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
        description: "Kunde inte hitta information om kommunen. Försök igen eller kontakta oss för hjälp.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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