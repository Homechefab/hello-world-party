import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";

interface DocumentUploadProps {
  onSuccess?: () => void;
}

export const DocumentUpload = ({ onSuccess }: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [municipality, setMunicipality] = useState("");
  const [permitNumber, setPermitNumber] = useState("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type (PDF, JPG, PNG)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Felaktigt filformat",
          description: "Endast PDF, JPG och PNG-filer är tillåtna.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Filen är för stor",
          description: "Filen får max vara 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const uploadDocument = async () => {
    if (!file || !municipality.trim()) {
      toast({
        title: "Saknad information",
        description: "Vänligen välj en fil och ange kommun.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setProgress(20);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Du måste vara inloggad för att ladda upp dokument");
      }

      setProgress(40);

      // Upload file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setProgress(60);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      setProgress(80);

      // Create document submission record
      const { error: dbError } = await supabase
        .from('document_submissions')
        .insert({
          user_id: user.id,
          document_type: 'municipal_permit',
          document_url: urlData.publicUrl,
          municipality: municipality.trim(),
          permit_number: permitNumber.trim() || null,
          status: 'pending'
        });

      if (dbError) throw dbError;

      setProgress(100);
      setUploading(false);
      setAnalyzing(true);

      // Start AI analysis
      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('document-analyzer', {
          body: {
            documentUrl: urlData.publicUrl,
            documentType: 'municipal_permit',
            municipality: municipality.trim(),
            permitNumber: permitNumber.trim() || null
          }
        });

      setAnalyzing(false);

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        toast({
          title: "Dokumentet uppladdades",
          description: "Dokumentet har laddats upp och kommer att granskas manuellt.",
        });
      } else {
        toast({
          title: "Analys klar",
          description: analysisData.approved ? 
            "Ditt dokument har godkänts automatiskt!" : 
            "Dokumentet behöver manuell granskning.",
          variant: analysisData.approved ? "default" : "destructive",
        });
      }

      // Reset form
      setFile(null);
      setMunicipality("");
      setPermitNumber("");
      setProgress(0);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Uppladdning misslyckades",
        description: error.message || "Något gick fel vid uppladdning av dokumentet.",
        variant: "destructive",
      });
      setUploading(false);
      setAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Ladda upp ditt kommunkommunbeslut
        </CardTitle>
        <CardDescription>
          Ladda upp ditt godkännandebeslut från kommunen för automatisk granskning.
          Accepterade format: PDF, JPG, PNG (max 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="municipality">Kommun *</Label>
          <Input
            id="municipality"
            placeholder="T.ex. Stockholm, Göteborg, Malmö..."
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            disabled={uploading || analyzing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="permit-number">Tillståndsnummer (valfritt)</Label>
          <Input
            id="permit-number"
            placeholder="Ange tillståndsnummer om tillgängligt"
            value={permitNumber}
            onChange={(e) => setPermitNumber(e.target.value)}
            disabled={uploading || analyzing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">Dokument *</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            {file ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  disabled={uploading || analyzing}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={uploading || analyzing}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Välj PDF, JPG eller PNG-fil (max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {(uploading || analyzing) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                {uploading ? "Laddar upp dokument..." : "Analyserar dokument..."}
              </span>
              {uploading && <span>{progress}%</span>}
            </div>
            <Progress value={uploading ? progress : undefined} className="w-full" />
            {analyzing && (
              <p className="text-sm text-muted-foreground">
                AI granskar ditt dokument automatiskt...
              </p>
            )}
          </div>
        )}

        <Button
          onClick={uploadDocument}
          disabled={!file || !municipality.trim() || uploading || analyzing}
          className="w-full"
        >
          {uploading || analyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {uploading ? "Laddar upp..." : "Analyserar..."}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Ladda upp och granska dokument
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">Vad händer nu?</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Dokumentet laddas upp säkert till vårt system</li>
            <li>AI analyserar dokumentet automatiskt</li>
            <li>Godkända dokument ger omedelbar tillgång till plattformen</li>
            <li>Oklara fall granskas manuellt inom 24 timmar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};