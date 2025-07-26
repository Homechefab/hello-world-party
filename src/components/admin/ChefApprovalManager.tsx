import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Eye,
  User,
  Building,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ChefApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  businessName: string;
  municipality: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  appliedDate: string;
  documents: {
    selfControlPlan?: string;
    businessLicense?: string;
  };
  notes?: string;
}

export const ChefApprovalManager = () => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<ChefApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Mock data - replace with real API calls
  const [applications, setApplications] = useState<ChefApplication[]>([
    {
      id: '1',
      applicantName: 'Anna Lindström',
      email: 'anna@example.com',
      phone: '+46 70 123 45 67',
      businessName: 'Annas Hemkök',
      municipality: 'Stockholm',
      description: 'Specialiserar mig på traditionell svensk husmanskost med moderna influenser.',
      status: 'pending',
      appliedDate: '2024-01-15',
      documents: {
        selfControlPlan: 'egenkontroll_anna.pdf',
        businessLicense: 'f_skatt_anna.pdf'
      }
    },
    {
      id: '2',
      applicantName: 'Erik Johansson',
      email: 'erik@example.com',
      phone: '+46 70 987 65 43',
      businessName: 'Eriks Gourmetkök',
      municipality: 'Göteborg',
      description: 'Italiensk och fransk mat med fokus på färska råvaror.',
      status: 'under_review',
      appliedDate: '2024-01-12',
      documents: {
        selfControlPlan: 'egenkontroll_erik.pdf',
        businessLicense: 'f_skatt_erik.pdf'
      }
    },
    {
      id: '3',
      applicantName: 'Maria Gonzalez',
      email: 'maria@example.com',
      phone: '+46 70 555 12 34',
      businessName: 'Marias Tapas',
      municipality: 'Malmö',
      description: 'Autentisk spansk mat och tapas.',
      status: 'approved',
      appliedDate: '2024-01-10',
      documents: {
        selfControlPlan: 'egenkontroll_maria.pdf',
        businessLicense: 'f_skatt_maria.pdf'
      }
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Väntar granskning</Badge>;
      case 'under_review':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Under granskning</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Godkänd</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Avvisad</Badge>;
      default:
        return <Badge variant="secondary">Okänd status</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'under_review':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: 'approved' | 'rejected' | 'under_review') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, notes: reviewNotes }
          : app
      )
    );

    toast({
      title: "Status uppdaterad",
      description: `Ansökan har markerats som ${newStatus === 'approved' ? 'godkänd' : newStatus === 'rejected' ? 'avvisad' : 'under granskning'}`
    });

    setSelectedApplication(null);
    setReviewNotes('');
  };

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const underReviewCount = applications.filter(app => app.status === 'under_review').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Kock-ansökningar</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-yellow-50">
            {pendingCount} Väntande
          </Badge>
          <Badge variant="outline" className="bg-blue-50">
            {underReviewCount} Under granskning
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {applications.map((application) => (
          <Card key={application.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      <h3 className="font-semibold text-lg">{application.applicantName}</h3>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {application.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        {application.businessName} - {application.municipality}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">
                        Ansökt: {new Date(application.appliedDate).toLocaleDateString('sv-SE')}
                      </p>
                      <p className="text-muted-foreground">
                        Dokument: {Object.keys(application.documents).length} st
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {application.description}
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Granska
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Granska ansökan - {application.applicantName}
                      </DialogTitle>
                      <DialogDescription>
                        Kontrollera all information och dokument innan godkännande
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Personal Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Personlig information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Namn</Label>
                              <p className="text-sm">{application.applicantName}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">E-post</Label>
                              <p className="text-sm">{application.email}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Telefon</Label>
                              <p className="text-sm">{application.phone}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Kommun</Label>
                              <p className="text-sm">{application.municipality}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Business Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Företagsinformation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <Label className="text-sm font-medium">Företagsnamn</Label>
                            <p className="text-sm">{application.businessName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Beskrivning</Label>
                            <p className="text-sm">{application.description}</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Documents */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Dokument
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {application.documents.selfControlPlan && (
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">Egenkontrollplan</p>
                                <p className="text-sm text-muted-foreground">{application.documents.selfControlPlan}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Ladda ner
                              </Button>
                            </div>
                          )}
                          
                          {application.documents.businessLicense && (
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">F-skattsedel/Näringstillstånd</p>
                                <p className="text-sm text-muted-foreground">{application.documents.businessLicense}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Ladda ner
                              </Button>
                            </div>
                          )}
                          
                        </CardContent>
                      </Card>

                      {/* Review Notes */}
                      <div>
                        <Label htmlFor="reviewNotes">Granskningsanteckningar</Label>
                        <Textarea
                          id="reviewNotes"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Lägg till kommentarer om ansökan..."
                          rows={3}
                        />
                      </div>

                      {/* Action Buttons */}
                      {application.status !== 'approved' && application.status !== 'rejected' && (
                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={() => handleStatusChange(application.id, 'under_review')}
                            variant="outline"
                            className="flex-1"
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Sätt under granskning
                          </Button>
                          <Button
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            variant="outline"
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Avvisa
                          </Button>
                          <Button
                            onClick={() => handleStatusChange(application.id, 'approved')}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Godkänn
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Inga ansökningar att visa</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};