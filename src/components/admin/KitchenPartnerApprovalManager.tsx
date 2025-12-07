import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Building, MapPin, Euro, Users, Eye, FileText, Download } from 'lucide-react';

interface KitchenPartner {
  id: string;
  user_id: string;
  business_name: string;
  kitchen_description: string;
  kitchen_size: number;
  address: string;
  hourly_rate: number;
  equipment_details: string;
  municipality: string;
  approved: boolean;
  rejection_reason: string;
  application_status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
  documents?: any[];
}

export const KitchenPartnerApprovalManager = () => {
  const [applications, setApplications] = useState<KitchenPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [_selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Fetch kitchen partners
      const { data, error } = await supabase
        .from('kitchen_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Fel vid hämtning av ansökningar');
        return;
      }

      // Fetch profiles for all kitchen partners
      const userIds = data?.map(kp => kp.user_id).filter(Boolean) || [];
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone')
          .in('id', userIds);

        // Create a map of profiles by id
        const profilesMap = new Map();
        profiles?.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });

        // Fetch documents for all kitchen partners
        const { data: documents } = await supabase
          .from('document_submissions')
          .select('*')
          .in('user_id', userIds)
          .order('created_at', { ascending: false });

        // Group documents by user_id
        const documentsMap = new Map<string, typeof documents>();
        documents?.forEach(doc => {
          if (doc.user_id) {
            if (!documentsMap.has(doc.user_id)) {
              documentsMap.set(doc.user_id, []);
            }
            documentsMap.get(doc.user_id)?.push(doc);
          }
        });

        // Attach profiles and documents to applications
        const applicationsWithData = data?.map(kp => ({
          ...kp,
          profiles: profilesMap.get(kp.user_id) || null,
          documents: documentsMap.get(kp.user_id) || []
        })) || [];

        setApplications(applicationsWithData as unknown as KitchenPartner[]);
      } else {
        setApplications(data as unknown as KitchenPartner[] || []);
      }
    } catch {
      toast.error('Något gick fel');
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (applicationId: string) => {
    try {
      console.log('Approving kitchen partner:', applicationId);
      
      const { error } = await supabase.rpc('approve_kitchen_partner', {
        partner_id: applicationId
      });

      if (error) {
        console.error('Error approving kitchen partner:', error);
        toast.error(`Fel vid godkännande: ${error.message}`);
        return;
      }

      toast.success('Ansökan godkänd!');
      fetchApplications();
    } catch (err) {
      console.error('Unexpected error approving kitchen partner:', err);
      toast.error('Något gick fel vid godkännande');
    }
  };

  const rejectApplication = async (applicationId: string, reason: string) => {
    try {
      console.log('Rejecting kitchen partner:', applicationId, 'Reason:', reason);
      
      const { error } = await supabase.rpc('reject_kitchen_partner', {
        partner_id: applicationId,
        reason: reason
      });

      if (error) {
        console.error('Error rejecting kitchen partner:', error);
        toast.error(`Fel vid avslag: ${error.message}`);
        return;
      }

      toast.success('Ansökan avslogs');
      setRejectionReason('');
      setSelectedApplicationId(null);
      fetchApplications();
    } catch (err) {
      console.error('Unexpected error rejecting kitchen partner:', err);
      toast.error('Något gick fel vid avslag');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Väntar</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Godkänd</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Avslogs</Badge>;
      default:
        return <Badge variant="outline">Okänd</Badge>;
    }
  };

  const pendingApplications = applications.filter(app => app.application_status === 'pending');
  const approvedApplications = applications.filter(app => app.application_status === 'approved');
  const rejectedApplications = applications.filter(app => app.application_status === 'rejected');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Laddar ansökningar...</div>
      </div>
    );
  }

  const ApplicationCard = ({ application }: { application: KitchenPartner }) => {
    const [_selectedApplication, setSelectedApplication] = useState<KitchenPartner | null>(null);

    return (
      <>
        <Card key={application.id} className="mb-4">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {application.business_name}
                </CardTitle>
                <CardDescription>
                  Ansökan från {application.profiles?.full_name || 'Okänd'} • {new Date(application.created_at).toLocaleDateString('sv-SE')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(application.application_status)}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {application.application_status === 'rejected' ? 'Visa detaljer' : 'Granska'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Granska ansökan - {application.business_name}
                      </DialogTitle>
                      <DialogDescription>
                        Kolla all info och dokument innan godkännande
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Company info */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Företagsuppgifter</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Företagsnamn</Label>
                              <p className="text-sm">{application.business_name}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Kontaktperson</Label>
                              <p className="text-sm">{application.profiles?.full_name || 'Ej angivet'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">E-post</Label>
                              <p className="text-sm">{application.profiles?.email || 'Ej angivet'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Telefon</Label>
                              <p className="text-sm">{application.profiles?.phone || 'Ej angivet'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Adress</Label>
                              <p className="text-sm">{application.address}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Kommun</Label>
                              <p className="text-sm">{application.municipality}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Kitchen info */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Köksinformation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Köksstorlek</Label>
                              <p className="text-sm">{application.kitchen_size} kvm</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Timpris</Label>
                              <p className="text-sm">{application.hourly_rate} kr/timme</p>
                            </div>
                          </div>
                          {application.kitchen_description && (
                            <div>
                              <Label className="text-sm font-medium">Köksbeskrivning</Label>
                              <p className="text-sm whitespace-pre-wrap">{application.kitchen_description}</p>
                            </div>
                          )}
                          {application.equipment_details && (
                            <div>
                              <Label className="text-sm font-medium">Utrustning</Label>
                              <p className="text-sm whitespace-pre-wrap">{application.equipment_details}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Documents */}
                      {application.documents && application.documents.length > 0 && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <FileText className="w-5 h-5" />
                              Dokument
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {application.documents.map((doc: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      {doc.document_type === 'business_license' ? 'Näringstillstånd' : 'Köksbild'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Uppladdad: {new Date(doc.created_at).toLocaleDateString('sv-SE')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(doc.document_url, '_blank')}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Visa
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(doc.document_url);
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        const fileExt = doc.document_url.split('.').pop()?.split('?')[0] || 'pdf';
                                        link.download = `${doc.document_type}-${new Date(doc.created_at).toLocaleDateString('sv-SE')}.${fileExt}`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);
                                        toast.success('Dokument nedladdat');
                                      } catch (error) {
                                        console.error('Download error:', error);
                                        toast.error('Kunde inte ladda ner dokument');
                                      }
                                    }}
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Ladda ner
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {/* Rejection reason if exists */}
                      {application.rejection_reason && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-red-700">Avslagsorsak</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{application.rejection_reason}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Action buttons */}
                      {application.application_status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              approveApplication(application.id);
                            }}
                            className="bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Godkänn ansökan
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive"
                                className="flex-1"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Neka ansökan
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Neka ansökan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Skriv varför ansökan nekas. Detta skickas till sökanden.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <Textarea
                                placeholder="Ange anledning..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                              />
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => {
                                  setRejectionReason('');
                                }}>
                                  Avbryt
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => {
                                    if (rejectionReason.trim()) {
                                      rejectApplication(application.id, rejectionReason);
                                    }
                                  }}
                                  disabled={!rejectionReason.trim()}
                                >
                                  Neka ansökan
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Kontakt:</strong> {application.profiles?.email}
                  </span>
                </div>
                {application.profiles?.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      <strong>Telefon:</strong> {application.profiles.phone}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Adress:</strong> {application.address}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    <strong>Köksstorlek:</strong> {application.kitchen_size} kvm
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Timpris:</strong> {application.hourly_rate} kr/timme
                  </span>
                </div>
                {application.documents && application.documents.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Dokument:</strong> {application.documents.length} st
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Ansökningar från kökspartners</h1>
        <p className="text-muted-foreground">Se och hantera ansökningar</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</div>
            <p className="text-sm text-muted-foreground">Väntar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{approvedApplications.length}</div>
            <p className="text-sm text-muted-foreground">Godkända</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{rejectedApplications.length}</div>
            <p className="text-sm text-muted-foreground">Nekade</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Väntar ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Godkända ({approvedApplications.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Avslagna ({rejectedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingApplications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Inga ansökningar väntar</p>
              </CardContent>
            </Card>
          ) : (
            pendingApplications.map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedApplications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Inga godkända än</p>
              </CardContent>
            </Card>
          ) : (
            approvedApplications.map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {rejectedApplications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Inga nekade ansökningar</p>
              </CardContent>
            </Card>
          ) : (
            rejectedApplications.map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};