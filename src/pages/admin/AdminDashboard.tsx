import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChefApprovalManager } from '@/components/admin/ChefApprovalManager';
import { KitchenPartnerApprovalManager } from '@/components/admin/KitchenPartnerApprovalManager';
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
    totalUsers: 0,
    pendingApprovals: 0,
    activeComplaints: 0,
    completedOnboardings: 0
  };

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
            <p className="text-xs text-muted-foreground">Aktiva användare</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Väntar Godkännande</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Ansökningar att granska</p>
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
            <p className="text-xs text-muted-foreground">Godkända användare</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chefs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chefs">Kock-ansökningar</TabsTrigger>
          <TabsTrigger value="kitchen-partners">Kökspartner-ansökningar</TabsTrigger>
        </TabsList>

        <TabsContent value="chefs">
          <ChefApprovalManager />
        </TabsContent>

        <TabsContent value="kitchen-partners">
          <KitchenPartnerApprovalManager />
        </TabsContent>
      </Tabs>

    </div>
  );
};