
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Antal användare</p>
            <p className="font-semibold">0</p>
            <p className="text-xs text-muted-foreground">Aktiva användare</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Väntar på granskning</p>
            <p className="font-semibold">0</p>
            <p className="text-xs text-muted-foreground">Ansökningar att kolla</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Klagomål</p>
            <p className="font-semibold">0</p>
            <p className="text-xs text-muted-foreground">Behöver åtgärdas</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            <CheckCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Godkända</p>
            <p className="font-semibold">0</p>
            <p className="text-xs text-muted-foreground">Godkända användare</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            <DollarSign className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Omsättning</p>
            <p className="font-semibold">0 kr</p>
            <p className="text-xs text-muted-foreground">Denna månad</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Pågående beställningar</p>
            <p className="font-semibold">0</p>
            <p className="text-xs text-muted-foreground">Just nu</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div>
          <div className="text-left p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium">Kock-ansökningar</h3>
            <p className="text-xs text-muted-foreground mt-1">Ansökningar från kockar</p>
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center p-4 border rounded-lg">
            Inga ansökningar att visa
          </div>
        </div>

        <div>
          <div className="text-left p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium">Kökspartner-ansökningar</h3>
            <p className="text-xs text-muted-foreground mt-1">Nya kökspartners</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-center p-2 border rounded-lg">
              <p className="text-amber-500 font-medium">0</p>
              <p className="text-xs text-muted-foreground">Väntar</p>
            </div>
            <div className="text-center p-2 border rounded-lg">
              <p className="text-emerald-500 font-medium">0</p>
              <p className="text-xs text-muted-foreground">Godk.</p>
            </div>
            <div className="text-center p-2 border rounded-lg">
              <p className="text-rose-500 font-medium">0</p>
              <p className="text-xs text-muted-foreground">Nekade</p>
            </div>
          </div>
        </div>

        <div>
          <div className="text-left p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium">Användarhantering</h3>
            <p className="text-xs text-muted-foreground mt-1">Hantera användare</p>
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center p-4 border rounded-lg">
            Ingen data att visa
          </div>
        </div>

        <div>
          <div className="text-left p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium">Klagomål</h3>
            <p className="text-xs text-muted-foreground mt-1">Rapporter och klagomål</p>
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center p-4 border rounded-lg">
            Inga klagomål just nu
          </div>
        </div>

        <div>
          <div className="text-left p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium">Inställningar</h3>
            <p className="text-xs text-muted-foreground mt-1">Systeminställningar</p>
          </div>
          <div className="mt-4 space-y-2">
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
    </div>
  );
};