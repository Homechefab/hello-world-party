import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Building, MapPin, Euro, Users } from 'lucide-react';

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
}

export const KitchenPartnerApprovalManager = () => {
  const [applications, setApplications] = useState<KitchenPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchen_partners')
        .select(`
          *
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Fel vid hämtning av ansökningar');
        return;
      }

      setApplications((data as any) || []);
    } catch (error) {
      toast.error('Något gick fel');
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase.rpc('approve_kitchen_partner', {
        partner_id: applicationId
      });

      if (error) {
        toast.error('Fel vid godkännande av ansökan');
        return;
      }

      toast.success('Ansökan godkänd!');
      fetchApplications();
    } catch (error) {
      toast.error('Något gick fel');
    }
  };

  const rejectApplication = async (applicationId: string, reason: string) => {
    try {
      const { error } = await supabase.rpc('reject_kitchen_partner', {
        partner_id: applicationId,
        reason: reason
      });

      if (error) {
        toast.error('Fel vid avslag av ansökan');
        return;
      }

      toast.success('Ansökan avslogs');
      setRejectionReason('');
      setSelectedApplicationId(null);
      fetchApplications();
    } catch (error) {
      toast.error('Något gick fel');
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

  const ApplicationCard = ({ application }: { application: KitchenPartner }) => (
    <Card key={application.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {application.business_name}
            </CardTitle>
            <CardDescription>
              Ansökan från {application.profiles?.full_name || 'Okänd'} • {new Date(application.created_at).toLocaleDateString('sv-SE')}
            </CardDescription>
          </div>
          {getStatusBadge(application.application_status)}
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
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Kommun:</strong> {application.municipality}
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
          </div>
        </div>

        {application.kitchen_description && (
          <div className="mb-4">
            <strong className="text-sm">Köksbeskrivning:</strong>
            <p className="text-sm text-muted-foreground mt-1">{application.kitchen_description}</p>
          </div>
        )}

        {application.equipment_details && (
          <div className="mb-4">
            <strong className="text-sm">Utrustning:</strong>
            <p className="text-sm text-muted-foreground mt-1">{application.equipment_details}</p>
          </div>
        )}

        {application.rejection_reason && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <strong className="text-sm text-red-700">Anledning till avslag:</strong>
            <p className="text-sm text-red-600 mt-1">{application.rejection_reason}</p>
          </div>
        )}

        {application.application_status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              onClick={() => approveApplication(application.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Godkänn
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  onClick={() => setSelectedApplicationId(application.id)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Avslå
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Avslå ansökan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ange anledning till varför ansökan avslås. Detta kommer att skickas till sökanden.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Textarea
                  placeholder="Ange anledning till avslag..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => {
                    setRejectionReason('');
                    setSelectedApplicationId(null);
                  }}>
                    Avbryt
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => {
                      if (selectedApplicationId && rejectionReason.trim()) {
                        rejectApplication(selectedApplicationId, rejectionReason);
                      }
                    }}
                    disabled={!rejectionReason.trim()}
                  >
                    Avslå ansökan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Kökspartner Ansökningar</h1>
        <p className="text-muted-foreground">Hantera ansökningar från kökspartners</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</div>
            <p className="text-sm text-muted-foreground">Väntar på granskning</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{approvedApplications.length}</div>
            <p className="text-sm text-muted-foreground">Godkända partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{rejectedApplications.length}</div>
            <p className="text-sm text-muted-foreground">Avslagna ansökningar</p>
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
                <p className="text-muted-foreground">Inga väntande ansökningar</p>
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
                <p className="text-muted-foreground">Inga godkända ansökningar än</p>
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
                <p className="text-muted-foreground">Inga avslagna ansökningar</p>
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