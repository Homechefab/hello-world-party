import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('chefs').select('*', { count: 'exact', head: true }),
        supabase.from('kitchen_partners').select('*', { count: 'exact', head: true })
      ]);
      // Data fetched but not used yet - will be implemented later
    } catch (error) {
      console.error('Fel vid hämtning av data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Adminpanel</h1>
        <p className="text-muted-foreground">Översikt och hantering av plattformen</p>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="p-4 flex flex-col items-center border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4" />
            <h3 className="text-sm text-muted-foreground">Antal användare</h3>
          </div>
          <p className="text-xl font-bold mb-1">0</p>
          <p className="text-xs text-muted-foreground">Aktiva användare</p>
        </div>

        <div className="p-4 flex flex-col items-center border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4" />
            <h3 className="text-sm text-muted-foreground">Väntar på granskning</h3>
          </div>
          <p className="text-xl font-bold mb-1">0</p>
          <p className="text-xs text-muted-foreground">Ansökningar att kolla</p>
        </div>

        <div className="p-4 flex flex-col items-center border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="text-sm text-muted-foreground">Klagomål</h3>
          </div>
          <p className="text-xl font-bold mb-1">0</p>
          <p className="text-xs text-muted-foreground">Behöver åtgärdas</p>
        </div>

        <div className="p-4 flex flex-col items-center border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4" />
            <h3 className="text-sm text-muted-foreground">Godkända</h3>
          </div>
          <p className="text-xl font-bold mb-1">0</p>
          <p className="text-xs text-muted-foreground">Godkända användare</p>
        </div>

        <div className="p-4 flex flex-col items-center border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4" />
            <h3 className="text-sm text-muted-foreground">Omsättning</h3>
          </div>
          <p className="text-xl font-bold mb-1">0 kr</p>
          <p className="text-xs text-muted-foreground">Denna månad</p>
        </div>

        <div className="p-4 flex flex-col items-center border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4" />
            <h3 className="text-sm text-muted-foreground">Pågående beställningar</h3>
          </div>
          <p className="text-xl font-bold mb-1">0</p>
          <p className="text-xs text-muted-foreground">Just nu</p>
        </div>
      </div>

      {selectedSection === 'partners' ? (
        <div className="px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Ansökningar från kökspartners</h2>
            <p className="text-sm text-muted-foreground">Se och hantera ansökningar</p>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <p className="text-amber-500 text-2xl font-medium mb-1">0</p>
              <p className="text-sm text-muted-foreground">Väntar</p>
            </div>
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <p className="text-emerald-500 text-2xl font-medium mb-1">0</p>
              <p className="text-sm text-muted-foreground">Godkända</p>
            </div>
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <p className="text-rose-500 text-2xl font-medium mb-1">0</p>
              <p className="text-sm text-muted-foreground">Nekade</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2">
              <span>Väntar (0)</span>
              <span>Godkända (0)</span>
              <span>Avslagna (0)</span>
            </div>
            
            <div className="py-8 text-center text-sm text-muted-foreground">
              Inga ansökningar väntar
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4 px-4">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setSelectedSection('chefs')}
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
            >
              <h3 className="text-sm font-medium">Kock-ansökningar</h3>
              <p className="text-xs text-muted-foreground mt-1">Ansökningar från kockar</p>
            </button>
            
            <div className="text-sm text-muted-foreground text-center p-4 border rounded-lg">
              Inga ansökningar att visa
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setSelectedSection('partners')}
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
            >
              <h3 className="text-sm font-medium">Kökspartner-ansökningar</h3>
              <p className="text-xs text-muted-foreground mt-1">Nya kökspartners</p>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 border rounded-lg">
                <p className="text-amber-500 text-lg font-medium">0</p>
                <p className="text-xs text-muted-foreground">Väntar</p>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <p className="text-emerald-500 text-lg font-medium">0</p>
                <p className="text-xs text-muted-foreground">Godk.</p>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <p className="text-rose-500 text-lg font-medium">0</p>
                <p className="text-xs text-muted-foreground">Nekade</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setSelectedSection('users')}
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
            >
              <h3 className="text-sm font-medium">Användarhantering</h3>
              <p className="text-xs text-muted-foreground mt-1">Hantera användare</p>
            </button>

            <div className="text-sm text-muted-foreground text-center p-4 border rounded-lg">
              Ingen data att visa
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setSelectedSection('complaints')}
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
            >
              <h3 className="text-sm font-medium">Klagomål</h3>
              <p className="text-xs text-muted-foreground mt-1">Rapporter och klagomål</p>
            </button>

            <div className="text-sm text-muted-foreground text-center p-4 border rounded-lg">
              Inga klagomål just nu
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setSelectedSection('settings')}
              className="w-full text-left p-4 rounded-lg bg-white border hover:bg-gray-50"
            >
              <h3 className="text-sm font-medium">Inställningar</h3>
              <p className="text-xs text-muted-foreground mt-1">Systeminställningar</p>
            </button>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm">Godkännande</span>
                <span className="text-sm font-medium">Manuell</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm">Provision</span>
                <span className="text-sm font-medium">15%</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};