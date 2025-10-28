

export function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <div className="px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Ansökningar från kockar</h2>
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

    </div>
  );
};