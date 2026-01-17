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

    if (address.trim().length < 3) {
      toast({
        title: "Adress för kort",
        description: "Ange minst 3 tecken för att söka",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      console.log('Calling municipality-search edge function...');
      
      const { data, error } = await supabase.functions.invoke('municipality-search', {
        body: { address: address.trim() }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Kunde inte söka efter kommuninformation');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Municipality search result:', data);
      setResult(data);
      
      toast({
        title: "Sökning slutförd",
        description: `Hittade information för ${data.municipality}`,
      });
      
    } catch (error) {
      console.error('Municipality search error:', error);
      toast({
        title: "Fel vid sökning",
        description: error instanceof Error ? error.message : "Kunde inte hitta information om kommunen.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Address Search */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Ange din fullständiga adress (ex. Drottninggatan 1, Stockholm)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && searchMunicipality()}
              disabled={loading}
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
        
        <p className="text-xs text-muted-foreground">
          Vi söker automatiskt upp din kommun och visar relevanta länkar för livsmedelsregistrering.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Söker efter kommuninformation...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">{result.municipality}</h4>
            </div>
            
            <div className="space-y-2">
              {result.links.map((link, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-primary">{link.title}</h5>
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
              ⚠️ Kontrollera alltid att informationen är aktuell på kommunens officiella webbplats.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MunicipalitySearch;
