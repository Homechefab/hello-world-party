import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, ArrowLeft, Loader2, Upload, FileText, X } from "lucide-react";
import { Link } from "react-router-dom";

const businessApplicationSchema = z.object({
  businessName: z.string().min(2, "Företagsnamn måste vara minst 2 tecken").max(100),
  organizationNumber: z.string().regex(/^\d{6}-?\d{4}$/, "Ange ett giltigt organisationsnummer (XXXXXX-XXXX)"),
  contactName: z.string().min(2, "Kontaktperson måste vara minst 2 tecken").max(100),
  contactEmail: z.string().email("Ange en giltig e-postadress").max(255),
  contactPhone: z.string().min(8, "Ange ett giltigt telefonnummer").max(20),
  address: z.string().min(5, "Ange en giltig adress").max(200),
  city: z.string().min(2, "Ange en giltig stad").max(100),
  postalCode: z.string().regex(/^\d{3}\s?\d{2}$/, "Ange ett giltigt postnummer"),
  businessType: z.string().min(1, "Välj en verksamhetstyp"),
  businessDescription: z.string().max(1000).optional(),
  websiteUrl: z.string().url("Ange en giltig webbadress").optional().or(z.literal("")),
  foodSafetyApproved: z.boolean(),
  hasInsurance: z.boolean(),
  acceptTerms: z.boolean().refine((val) => val === true, "Du måste acceptera villkoren")
});

type BusinessApplicationForm = z.infer<typeof businessApplicationSchema>;

const businessTypes = [
  { value: "catering", label: "Cateringföretag" },
  { value: "food_truck", label: "Food truck" },
  { value: "meal_prep", label: "Måltidslådor / Meal prep" },
  { value: "bakery", label: "Bageri / Konditori" },
  { value: "deli", label: "Delikatessbutik" },
  { value: "restaurant", label: "Restaurang" },
  { value: "other", label: "Annat" }
];

const BusinessApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<BusinessApplicationForm>({
    resolver: zodResolver(businessApplicationSchema),
    defaultValues: {
      businessName: "",
      organizationNumber: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      city: "",
      postalCode: "",
      businessType: "",
      businessDescription: "",
      websiteUrl: "",
      foodSafetyApproved: false,
      hasInsurance: false,
      acceptTerms: false
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Ogiltig filtyp",
          description: "Endast PDF, JPG och PNG-filer är tillåtna.",
          variant: "destructive"
        });
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Filen är för stor",
          description: "Maximal filstorlek är 10 MB.",
          variant: "destructive"
        });
        return;
      }
      setDocumentFile(file);
    }
  };

  const uploadDocument = async (): Promise<string | null> => {
    if (!documentFile) return null;
    
    setIsUploading(true);
    try {
      const fileExt = documentFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `business-registrations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-documents')
        .upload(filePath, documentFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-documents')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Kunde inte ladda upp dokumentet",
        description: error.message || "Försök igen.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: BusinessApplicationForm) => {
    setIsSubmitting(true);
    
    try {
      // Upload document if provided
      let documentUrl: string | null = null;
      if (documentFile) {
        documentUrl = await uploadDocument();
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      // Insert application - user_id can be null for non-logged-in users
      const { error } = await supabase.from("business_partners").insert({
        user_id: user?.id || null,
        business_name: data.businessName,
        organization_number: data.organizationNumber,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        address: data.address,
        city: data.city,
        postal_code: data.postalCode,
        business_type: data.businessType,
        business_description: data.businessDescription || null,
        website_url: data.websiteUrl || null,
        food_safety_approved: data.foodSafetyApproved,
        has_insurance: data.hasInsurance,
        application_status: "pending",
        food_registration_document_url: documentUrl
      });

      if (error) throw error;

      toast({
        title: "Ansökan skickad!",
        description: "Vi granskar din ansökan och återkommer inom 2-3 arbetsdagar.",
      });

      navigate("/business/application-pending");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Något gick fel",
        description: error.message || "Kunde inte skicka ansökan. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/business" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka till företagssidan
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Bli företagspartner</CardTitle>
            <CardDescription>
              Fyll i formuläret nedan för att ansöka om att sälja via Homechef
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Företagsinformation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Företagsinformation</h3>
                  
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Företagsnamn *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ditt Företag AB" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organisationsnummer *</FormLabel>
                        <FormControl>
                          <Input placeholder="XXXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verksamhetstyp *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Välj typ av verksamhet" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beskriv din verksamhet</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Berätta om er verksamhet, vilken typ av mat ni erbjuder och varför ni vill sälja via Homechef..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webbplats</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.dittforetag.se" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Kontaktuppgifter */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Kontaktuppgifter</h3>
                  
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kontaktperson *</FormLabel>
                        <FormControl>
                          <Input placeholder="Anna Andersson" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-post *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@foretag.se" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon *</FormLabel>
                          <FormControl>
                            <Input placeholder="07X XXX XX XX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Adress */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Adress</h3>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gatuadress *</FormLabel>
                        <FormControl>
                          <Input placeholder="Storgatan 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postnummer *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 45" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ort *</FormLabel>
                          <FormControl>
                            <Input placeholder="Stockholm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Dokumentuppladdning */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Livsmedelsregistrering</h3>
                  
                  <div className="space-y-2">
                    <FormLabel>Ladda upp bevis på livsmedelsregistrering</FormLabel>
                    <FormDescription>
                      Ladda upp ert tillstånd för livsmedelsregistrering (PDF, JPG eller PNG, max 10 MB)
                    </FormDescription>
                    
                    <div className="flex flex-col gap-3">
                      {!documentFile ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Klicka för att ladda upp dokument
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium truncate max-w-[200px]">
                              {documentFile.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDocumentFile(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bekräftelser */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Bekräftelser</h3>
                  
                  <FormField
                    control={form.control}
                    name="foodSafetyApproved"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Vårt företag är registrerat och godkänt av Livsmedelsverket
                          </FormLabel>
                          <FormDescription>
                            Du behöver ha ett registrerat livsmedelsföretag
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasInsurance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Vi har giltig ansvarsförsäkring för vår verksamhet
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Jag godkänner <Link to="/terms" className="text-primary hover:underline">användarvillkoren</Link> och <Link to="/privacy" className="text-primary hover:underline">integritetspolicyn</Link> *
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || isUploading}>
                  {isSubmitting || isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploading ? "Laddar upp dokument..." : "Skickar ansökan..."}
                    </>
                  ) : (
                    "Skicka ansökan"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessApplication;
