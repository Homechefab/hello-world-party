import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HyrUtDittKok } from './HyrUtDittKok';
import { Loader2 } from 'lucide-react';

export const KitchenPartnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkKitchenPartnerStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }

        // Check if user has kitchen_partner application
        const { data: kitchenPartner, error } = await supabase
          .from('kitchen_partners')
          .select('approved, application_status')
          .eq('user_id', user.id)
          .single();

        if (error || !kitchenPartner) {
          // No application found, redirect to onboarding
          navigate('/kitchen-partner/register');
          return;
        }

        if (kitchenPartner.application_status === 'pending') {
          // Application pending, redirect to pending page
          navigate('/kitchen-partner/application-pending');
          return;
        }

        if (kitchenPartner.application_status === 'rejected') {
          toast({
            title: "Ansökan avvisad",
            description: "Din ansökan har tyvärr avvisats. Kontakta oss för mer information.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        // Approved, show dashboard
        setIsApproved(true);
      } catch (error) {
        console.error('Error checking kitchen partner status:', error);
        toast({
          title: "Fel",
          description: "Kunde inte hämta din status. Försök igen senare.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkKitchenPartnerStatus();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isApproved) {
    return null;
  }

  return <HyrUtDittKok />;
};