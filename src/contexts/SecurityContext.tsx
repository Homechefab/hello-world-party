import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityContextType {
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  verificationStatus: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    business: boolean;
  };
  enableTwoFactor: () => Promise<void>;
  disableTwoFactor: () => Promise<void>;
  verifyIdentity: (documentType: string, file: File) => Promise<void>;
  verifyBusiness: (businessId: string, documents: File[]) => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
    identity: false,
    business: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('user_verifications')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            setVerificationStatus({
              email: data.email_verified,
              phone: data.phone_verified,
              identity: data.identity_verified,
              business: data.business_verified,
            });
            setIsVerified(
              data.email_verified &&
              data.phone_verified &&
              (data.identity_verified || data.business_verified)
            );
            setIsTwoFactorEnabled(data.two_factor_enabled || false);
          }
        }
      } catch (error) {
        console.error('Error fetching verification status:', error);
      }
    };

    fetchVerificationStatus();
  }, []);

  const enableTwoFactor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_verifications')
        .update({ two_factor_enabled: true })
        .eq('user_id', user.id);

      if (error) throw error;

      setIsTwoFactorEnabled(true);
      toast({
        title: 'Tvåfaktorsautentisering aktiverad',
        description: 'Din inloggning är nu säkrare.',
      });
    } catch (error) {
      toast({
        title: 'Fel vid aktivering av tvåfaktorsautentisering',
        description: 'Försök igen senare.',
        variant: 'destructive',
      });
    }
  };

  const disableTwoFactor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_verifications')
        .update({ two_factor_enabled: false })
        .eq('user_id', user.id);

      if (error) throw error;

      setIsTwoFactorEnabled(false);
      toast({
        title: 'Tvåfaktorsautentisering inaktiverad',
        description: 'Du kan aktivera den igen när som helst.',
      });
    } catch (error) {
      toast({
        title: 'Fel vid inaktivering av tvåfaktorsautentisering',
        description: 'Försök igen senare.',
        variant: 'destructive',
      });
    }
  };

  const verifyIdentity = async (documentType: string, file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Upload document to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('identity-documents')
        .upload(`${user.id}/${documentType}`, file);

      if (uploadError) throw uploadError;

      // Update verification status
      const { error: updateError } = await supabase
        .from('user_verifications')
        .update({
          identity_verified: true,
          identity_document_url: uploadData.path,
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setVerificationStatus(prev => ({
        ...prev,
        identity: true,
      }));

      toast({
        title: 'ID-verifiering skickad',
        description: 'Vi granskar dina dokument och återkommer.',
      });
    } catch (error) {
      toast({
        title: 'Fel vid ID-verifiering',
        description: 'Kontrollera dokumenten och försök igen.',
        variant: 'destructive',
      });
    }
  };

  const verifyBusiness = async (businessId: string, documents: File[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Upload all documents
      const uploadPromises = documents.map((file, index) => 
        supabase.storage
          .from('business-documents')
          .upload(`${user.id}/${businessId}/${index}`, file)
      );

      const uploadResults = await Promise.all(uploadPromises);
      const uploadErrors = uploadResults.filter(result => result.error);

      if (uploadErrors.length > 0) throw uploadErrors[0].error;

      // Update verification status
      const { error: updateError } = await supabase
        .from('user_verifications')
        .update({
          business_verified: true,
          business_id: businessId,
          business_documents: uploadResults
            .map(result => result.data?.path)
            .filter((path): path is string => path !== undefined),
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setVerificationStatus(prev => ({
        ...prev,
        business: true,
      }));

      toast({
        title: 'Företagsverifiering skickad',
        description: 'Vi granskar din företagsinformation och återkommer.',
      });
    } catch (error) {
      toast({
        title: 'Fel vid företagsverifiering',
        description: 'Kontrollera informationen och försök igen.',
        variant: 'destructive',
      });
    }
  };

  const value = {
    isVerified,
    isTwoFactorEnabled,
    verificationStatus,
    enableTwoFactor,
    disableTwoFactor,
    verifyIdentity,
    verifyBusiness,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}