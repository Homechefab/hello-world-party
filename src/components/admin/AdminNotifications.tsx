import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export const AdminNotifications = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [chefCount, setChefCount] = useState(0);
  const [partnerCount, setPartnerCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingApplications();

    // Set up realtime subscription
    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chefs' }, () => {
        fetchPendingApplications();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kitchen_partners' }, () => {
        fetchPendingApplications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPendingApplications = async () => {
    try {
      const { count: pendingChefs } = await supabase
        .from('chefs')
        .select('*', { count: 'exact', head: true })
        .eq('application_status', 'pending');

      const { count: pendingPartners } = await supabase
        .from('kitchen_partners')
        .select('*', { count: 'exact', head: true })
        .eq('application_status', 'pending');

      setChefCount(pendingChefs || 0);
      setPartnerCount(pendingPartners || 0);
      setPendingCount((pendingChefs || 0) + (pendingPartners || 0));
    } catch (error) {
      console.error('Fel vid hämtning av notifikationer:', error);
    }
  };

  const handleViewChefApplications = () => {
    navigate('/admin/dashboard?tab=chefs');
  };

  const handleViewPartnerApplications = () => {
    navigate('/admin/dashboard?tab=kitchen-partners');
  };

  if (pendingCount === 0) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground"
          >
            {pendingCount}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-background">
        <DropdownMenuLabel>Notifikationer</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {chefCount > 0 && (
          <DropdownMenuItem onClick={handleViewChefApplications} className="flex flex-col items-start py-3">
            <div className="font-medium">Nya kockansökningar</div>
            <div className="text-sm text-muted-foreground">
              {chefCount} {chefCount === 1 ? 'ansökan' : 'ansökningar'} väntar på granskning
            </div>
          </DropdownMenuItem>
        )}

        {partnerCount > 0 && (
          <DropdownMenuItem onClick={handleViewPartnerApplications} className="flex flex-col items-start py-3">
            <div className="font-medium">Nya kökspartner-ansökningar</div>
            <div className="text-sm text-muted-foreground">
              {partnerCount} {partnerCount === 1 ? 'ansökan' : 'ansökningar'} väntar på granskning
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
