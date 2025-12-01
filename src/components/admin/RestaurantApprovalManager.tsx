import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

interface Restaurant {
  id: string;
  business_name: string;
  full_name: string;
  contact_email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  restaurant_description: string;
  cuisine_types: string;
  application_status: string;
  approved: boolean;
  rejection_reason: string | null;
  created_at: string;
}

export const RestaurantApprovalManager = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
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

  const approveApplication = async (applicationId: string) => {
    setActionLoading(applicationId);
    try {
      const { error } = await supabase.functions.invoke('approve-restaurant-create-account', {
        body: { restaurantId: applicationId }
      });

      if (error) throw error;

      toast({
        title: "Restaurang godkänd!",
        description: "Inloggningsuppgifter har skickats till restaurangen",
      });
      
      fetchApplications();
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte godkänna ansökan",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const rejectApplication = async () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      toast({
        title: "Fel",
        description: "Du måste ange en anledning för avslag",
        variant: "destructive"
      });
      return;
    }

    setActionLoading(selectedApplication);
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          application_status: 'rejected',
          approved: false,
          rejection_reason: rejectionReason
        })
        .eq('id', selectedApplication);

      if (error) throw error;

      toast({
        title: "Ansökan nekad",
        description: "Restaurangen har meddelats",
      });
      
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedApplication(null);
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

  const getStatusBadge = (status: string, approved: boolean) => {
    if (approved) {
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Godkänd</Badge>;
    }
    
    switch (status) {
      case 'pending':
      case 'under_review':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Väntar</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Nekad</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const ApplicationCard = ({ application }: { application: Restaurant }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{application.business_name}</CardTitle>
            <CardDescription>{application.full_name}</CardDescription>
          </div>
          {getStatusBadge(application.application_status, application.approved)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm mb-4">
          <p><span className="font-medium">Email:</span> {application.contact_email}</p>
          <p><span className="font-medium">Telefon:</span> {application.phone}</p>
          <p><span className="font-medium">Adress:</span> {application.address}, {application.city}</p>
          <p><span className="font-medium">Beskrivning:</span> {application.restaurant_description}</p>
          <p><span className="font-medium">Mattyper:</span> {application.cuisine_types}</p>
          {application.rejection_reason && (
            <p className="text-destructive"><span className="font-medium">Avslagsorsak:</span> {application.rejection_reason}</p>
          )}
        </div>

        {application.application_status !== 'approved' && !application.approved && (
          <div className="flex gap-2">
            <Button
              onClick={() => approveApplication(application.id)}
              disabled={actionLoading === application.id}
              className="flex-1"
            >
              {actionLoading === application.id ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Godkänner...</>
              ) : (
                <><CheckCircle className="w-4 h-4 mr-2" /> Godkänn</>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setSelectedApplication(application.id);
                setShowRejectDialog(true);
              }}
              disabled={actionLoading === application.id}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" /> Neka
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const pendingApplications = applications.filter(a => ['pending', 'under_review'].includes(a.application_status));
  const approvedApplications = applications.filter(a => a.approved);
  const rejectedApplications = applications.filter(a => a.application_status === 'rejected');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Restaurangansökningar</h2>
        <p className="text-muted-foreground">Hantera och godkänn restaurangansökningar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Väntande</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingApplications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Godkända</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{approvedApplications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nekade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{rejectedApplications.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Väntande ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="approved">Godkända ({approvedApplications.length})</TabsTrigger>
          <TabsTrigger value="rejected">Nekade ({rejectedApplications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Inga väntande ansökningar</p>
              </CardContent>
            </Card>
          ) : (
            pendingApplications.map(app => <ApplicationCard key={app.id} application={app} />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Inga godkända restauranger</p>
              </CardContent>
            </Card>
          ) : (
            approvedApplications.map(app => <ApplicationCard key={app.id} application={app} />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Inga nekade ansökningar</p>
              </CardContent>
            </Card>
          ) : (
            rejectedApplications.map(app => <ApplicationCard key={app.id} application={app} />)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neka ansökan</DialogTitle>
            <DialogDescription>
              Ange en anledning till varför ansökan nekas. Detta kommer att skickas till restaurangen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Avslagsorsak *</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ange anledning..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Avbryt
            </Button>
            <Button 
              variant="destructive" 
              onClick={rejectApplication}
              disabled={!rejectionReason.trim() || actionLoading !== null}
            >
              {actionLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Nekar...</>
              ) : (
                'Neka ansökan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};