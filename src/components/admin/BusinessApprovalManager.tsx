import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  ExternalLink,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BusinessPartner {
  id: string;
  business_name: string;
  organization_number: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  city: string;
  postal_code: string;
  business_type: string;
  business_description: string | null;
  website_url: string | null;
  food_safety_approved: boolean;
  has_insurance: boolean;
  application_status: string;
  rejection_reason: string | null;
  food_registration_document_url: string | null;
  created_at: string;
}

const businessTypeLabels: Record<string, string> = {
  catering: "Cateringföretag",
  food_truck: "Food truck",
  meal_prep: "Måltidslådor / Meal prep",
  bakery: "Bageri / Konditori",
  deli: "Delikatessbutik",
  restaurant: "Restaurang",
  other: "Annat"
};

export const BusinessApprovalManager = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<BusinessPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; applicationId: string | null }>({
    open: false,
    applicationId: null
  });
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('business_partners')
        .select('*')
        .eq('application_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data as BusinessPartner[]) || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Fel",
        description: "Kunde inte hämta ansökningar",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (application: BusinessPartner) => {
    setActionLoading(application.id);
    try {
      const { error } = await supabase
        .from('business_partners')
        .update({ application_status: 'approved' })
        .eq('id', application.id);

      if (error) throw error;

      // Send approval email
      await supabase.functions.invoke('send-business-decision', {
        body: {
          businessName: application.business_name,
          contactName: application.contact_name,
          contactEmail: application.contact_email,
          decision: 'approved'
        }
      });

      toast({
        title: "Ansökan godkänd",
        description: `${application.business_name} har godkänts som företagspartner.`
      });

      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Fel",
        description: "Kunde inte godkänna ansökan",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const rejectApplication = async () => {
    if (!rejectDialog.applicationId) return;
    
    const application = applications.find(a => a.id === rejectDialog.applicationId);
    if (!application) return;

    setActionLoading(rejectDialog.applicationId);
    try {
      const { error } = await supabase
        .from('business_partners')
        .update({ 
          application_status: 'rejected',
          rejection_reason: rejectionReason || null
        })
        .eq('id', rejectDialog.applicationId);

      if (error) throw error;

      // Send rejection email
      await supabase.functions.invoke('send-business-decision', {
        body: {
          businessName: application.business_name,
          contactName: application.contact_name,
          contactEmail: application.contact_email,
          decision: 'rejected',
          rejectionReason: rejectionReason || undefined
        }
      });

      toast({
        title: "Ansökan nekad",
        description: `${application.business_name} har nekats.`
      });

      setRejectDialog({ open: false, applicationId: null });
      setRejectionReason('');
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Fel",
        description: "Kunde inte neka ansökan",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Företagsansökningar
          </CardTitle>
          <CardDescription>Hantera ansökningar från företag</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Inga väntande företagsansökningar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Företagsansökningar
            <Badge variant="secondary" className="ml-2">{applications.length}</Badge>
          </CardTitle>
          <CardDescription>Hantera ansökningar från företag som vill sälja på plattformen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{application.business_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Org.nr: {application.organization_number}
                          </p>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Väntar
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{application.contact_email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{application.contact_phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{application.address}, {application.postal_code} {application.city}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p><strong>Kontaktperson:</strong> {application.contact_name}</p>
                          <p><strong>Typ:</strong> {businessTypeLabels[application.business_type] || application.business_type}</p>
                          <div className="flex gap-2">
                            {application.food_safety_approved && (
                              <Badge variant="secondary" className="text-xs">Livsmedelsregistrerad</Badge>
                            )}
                            {application.has_insurance && (
                              <Badge variant="secondary" className="text-xs">Försäkrad</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {application.business_description && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {application.business_description}
                        </p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {application.website_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={application.website_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Webbsida
                            </a>
                          </Button>
                        )}
                        {application.food_registration_document_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={application.food_registration_document_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-1" />
                              Dokument
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        onClick={() => approveApplication(application)}
                        disabled={actionLoading === application.id}
                        className="flex-1 lg:flex-none"
                      >
                        {actionLoading === application.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Godkänn
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setRejectDialog({ open: true, applicationId: application.id })}
                        disabled={actionLoading === application.id}
                        className="flex-1 lg:flex-none"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Neka
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, applicationId: open ? rejectDialog.applicationId : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neka ansökan</DialogTitle>
            <DialogDescription>
              Ange en anledning till varför ansökan nekas. Detta skickas till sökanden via e-post.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Anledning till avslag (valfritt)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, applicationId: null })}>
              Avbryt
            </Button>
            <Button variant="destructive" onClick={rejectApplication} disabled={actionLoading !== null}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Neka ansökan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
