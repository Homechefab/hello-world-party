import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, XCircle } from "lucide-react";

interface DocumentUploadProps {
  onSuccess?: () => void;
  chefId?: string;
  restaurantId?: string;
  documentType?: string;
  title?: string;
  description?: string;
}

export const DocumentUpload = ({ 
  onSuccess, 
  chefId, 
  restaurantId,
  documentType = 'municipal_permit',
  title = 'Ladda upp ditt kommunbeslut',
  description = 'Ladda upp ditt godkännandebeslut från kommunen för manuell granskning av vårt team.'
}: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
      const { error: uploadError } = await supabase.storage
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
      const submissionData: any = {
        user_id: user.id,
        document_type: documentType,
        document_url: urlData.publicUrl,
        municipality: municipality.trim(),
        permit_number: permitNumber.trim() || null,
        status: 'pending'
      };

      // Link to chef application if chefId is provided
      if (chefId) {
        submissionData.chef_id = chefId;
      }

      // Link to restaurant application if restaurantId is provided
      if (restaurantId) {
        submissionData.restaurant_id = restaurantId;
      }

      const { error: dbError } = await supabase
        .from('document_submissions')
        .insert(submissionData);

      if (dbError) throw dbError;

      setProgress(100);
      setUploading(false);

      toast({
        title: "Dokumentet har laddats upp",
        description: "Ditt dokument kommer att granskas manuellt av vårt team.",
      });

      // Reset form
      setFile(null);
      setMunicipality("");
      setPermitNumber("");
      setProgress(0);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: unknown) {
      console.error('Upload error:', error);
      toast({
        title: "Uppladdning misslyckades",
        description: error instanceof Error ? error.message : "Något gick fel vid uppladdning av dokumentet.",
        variant: "destructive",
      });
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
          {' '}Accepterade format: PDF, JPG, PNG (max 10MB)
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
            disabled={uploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="permit-number">Tillståndsnummer (valfritt)</Label>
          <Input
            id="permit-number"
            placeholder="Ange tillståndsnummer om tillgängligt"
            value={permitNumber}
            onChange={(e) => setPermitNumber(e.target.value)}
            disabled={uploading}
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
                  disabled={uploading}
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
                  disabled={uploading}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Välj PDF, JPG eller PNG-fil (max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Laddar upp dokument...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <Button
          onClick={uploadDocument}
          disabled={!file || !municipality.trim() || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Laddar upp...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Ladda upp dokument
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">Vad händer nu?</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Dokumentet laddas upp säkert till vårt system</li>
            <li>Vårt team granskar dokumentet manuellt</li>
            <li>Du får besked inom 2-3 arbetsdagar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};