import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChefApprovalManager } from '@/components/admin/ChefApprovalManager';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  FileText,
  MessageSquare
} from 'lucide-react';

export const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    totalUsers: 1247,
    pendingApprovals: 8,
    activeComplaints: 3,
    completedOnboardings: 156
  };

  const pendingChefs = [
    { 
      id: 1, 
      name: 'Maria Andersson', 
      email: 'maria@example.com', 
      appliedDate: '2024-01-15',
      municipality: 'Stockholm',
      status: 'Väntar på granskning'
    },
    { 
      id: 2, 
      name: 'Johan Svensson', 
      email: 'johan@example.com', 
      appliedDate: '2024-01-14',
      municipality: 'Göteborg',
      status: 'Dokument saknas'
    },
    { 
      id: 3, 
      name: 'Lisa Chen', 
      email: 'lisa@example.com', 
      appliedDate: '2024-01-13',
      municipality: 'Malmö',
      status: 'Under inspektion'
    }
  ];

  const complaints = [
    {
      id: 1,
      type: 'Kvalitet',
      description: 'Mat var kall vid leverans',
      reporter: 'Anna Kund',
      chef: 'Erik Kök',
      date: '2024-01-16',
      status: 'Öppen'
    },
    {
      id: 2,
      type: 'Leverans',
      description: 'Beställning kom aldrig fram',
      reporter: 'Lars Person',
      chef: 'Maria Hemlagat',
      date: '2024-01-15',
      status: 'Under utredning'
    }
  ];

  const onboardingStats = [
    { step: 'Registrering', completed: 245, pending: 12 },
    { step: 'Dokumentverifiering', completed: 198, pending: 35 },
    { step: 'Köksinspektion', completed: 156, pending: 42 },
    { step: 'Slutgodkännande', completed: 156, pending: 0 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Hantera plattformen och användare</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Användare</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+12 denna vecka</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Väntar Godkännande</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Kockar att granska</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Klagmål</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeComplaints}</div>
            <p className="text-xs text-muted-foreground">Behöver åtgärd</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slutförd Onboarding</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOnboardings}</div>
            <p className="text-xs text-muted-foreground">Godkända kockar</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="approvals">Godkännanden</TabsTrigger>
          <TabsTrigger value="complaints">Klagmål</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="users">Användare</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-6">
          <ChefApprovalManager />
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Hantera Klagmål
              </CardTitle>
              <CardDescription>
                Granska och lös kundklagmål
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{complaint.type}</Badge>
                          <Badge variant={complaint.status === 'Öppen' ? 'destructive' : 'secondary'}>
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="font-medium">{complaint.description}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{complaint.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span>Rapporterad av: {complaint.reporter}</span>
                        <span className="mx-2">•</span>
                        <span>Kock: {complaint.chef}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Kontakta kund</Button>
                        <Button variant="outline" size="sm">Kontakta kock</Button>
                        <Button size="sm">Lös</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Statistik</CardTitle>
              <CardDescription>
                Följ upp onboarding-processen för nya kockar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {onboardingStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{stat.step}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.completed} slutförda, {stat.pending} väntande
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {Math.round((stat.completed / (stat.completed + stat.pending)) * 100)}%
                      </div>
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ 
                            width: `${(stat.completed / (stat.completed + stat.pending)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Användarhantering</CardTitle>
              <CardDescription>
                Sök och hantera alla användare på plattformen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Sök användare..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">Filtrera</Button>
              </div>

              <div className="space-y-4">
                {['Anna Kund', 'Erik Kock', 'Maria Restaurang', 'Lars Admin'].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{user}</p>
                      <p className="text-sm text-muted-foreground">
                        {['Kund', 'Kock', 'Kökspartner', 'Admin'][index]} • 
                        Registrerad: 2024-01-{10 + index}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 1 ? 'default' : 'outline'}>
                        {index === 1 ? 'Aktiv' : 'Verifierad'}
                      </Badge>
                      <Button variant="outline" size="sm">Hantera</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};