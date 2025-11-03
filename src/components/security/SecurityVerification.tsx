import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"
import { useSecurity } from "@/contexts/SecurityContext"
import { CheckCircle2, Lock, ShieldAlert } from "lucide-react"

export default function SecurityVerification() {
  const { 
    isVerified, 
    isTwoFactorEnabled, 
    verificationStatus,
    enableTwoFactor,
    disableTwoFactor,
    verifyIdentity,
    verifyBusiness
  } = useSecurity()

  const [identityDoc, setIdentityDoc] = useState<File | null>(null)
  const [businessId, setBusinessId] = useState("")
  const [businessDocs, setBusinessDocs] = useState<File[]>([])

  const handleIdentityUpload = (files: FileList) => {
    if (files.length > 0) {
      setIdentityDoc(files[0])
    }
  }

  const handleBusinessDocsUpload = (files: FileList): void => {
    setBusinessDocs(Array.from(files))
  }

  const handleIdentitySubmit = async () => {
    if (identityDoc) {
      await verifyIdentity("id", identityDoc)
      setIdentityDoc(null)
    }
  }

  const handleBusinessSubmit = async () => {
    if (businessId && businessDocs.length > 0) {
      await verifyBusiness(businessId, businessDocs)
      setBusinessId("")
      setBusinessDocs([])
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verifieringsstatus</CardTitle>
          <CardDescription>Din kontovalidering och säkerhetsinställningar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="font-medium">Övergripande status</div>
              <div className="text-sm text-muted-foreground">
                Status på ditt konto
              </div>
            </div>
            <Badge 
              variant={isVerified ? "secondary" : "destructive"}
              className="flex items-center gap-1"
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Verifierad
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  Ej verifierad
                </>
              )}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="font-medium">Tvåfaktorsautentisering</div>
              <div className="text-sm text-muted-foreground">
                Extra säkerhetslager för din inloggning
              </div>
            </div>
            <Button 
              variant={isTwoFactorEnabled ? "destructive" : "default"}
              onClick={isTwoFactorEnabled ? disableTwoFactor : enableTwoFactor}
              className="flex items-center gap-1"
            >
              <Lock className="w-4 h-4" />
              {isTwoFactorEnabled ? "Inaktivera" : "Aktivera"}
            </Button>
          </div>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Badge variant={verificationStatus.email ? "default" : "secondary"}>
                  Email: {verificationStatus.email ? "Verifierad" : "Ej verifierad"}
                </Badge>
              </div>
              <div>
                <Badge variant={verificationStatus.phone ? "default" : "secondary"}>
                  Telefon: {verificationStatus.phone ? "Verifierad" : "Ej verifierad"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ID-verifiering</CardTitle>
          <CardDescription>Ladda upp din legitimation för verifiering</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={handleIdentityUpload}
            accept="image/*,.pdf"
            label="Ladda upp legitimation"
            description="Stöder bilder och PDF-filer"
          />
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleIdentitySubmit}
            disabled={!identityDoc || verificationStatus.identity}
          >
            {verificationStatus.identity ? "ID Verifierad" : "Skicka för verifiering"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Företagsverifiering</CardTitle>
          <CardDescription>Ladda upp företagsdokument för verifiering</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Organisationsnummer"
            value={businessId}
            onChange={e => setBusinessId(e.target.value)}
          />
          <FileUpload
            onFileSelect={(files: FileList) => handleBusinessDocsUpload(files)}
            accept="image/*,.pdf"
            label="Ladda upp företagsdokument"
            description="F-skatt, momsregistrering, etc."
            multiple
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleBusinessSubmit}
            disabled={!businessId || businessDocs.length === 0 || verificationStatus.business}
          >
            {verificationStatus.business ? "Företag Verifierat" : "Skicka för verifiering"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}