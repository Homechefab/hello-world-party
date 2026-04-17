import { useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

/**
 * Helper to gate "critical actions" (payment, posting profile, publishing dishes)
 * behind email verification.
 *
 * Usage:
 *   const { isVerified, requireVerified } = useRequireEmailVerified();
 *   <Button disabled={!isVerified} onClick={() => { if (!requireVerified()) return; doIt(); }} />
 */
export function useRequireEmailVerified() {
  const { user, resendVerificationEmail } = useAuth();
  const isVerified = !user || user.emailConfirmed;

  const requireVerified = useCallback(
    (action = 'denna åtgärd'): boolean => {
      if (!user) return true; // not logged in — handled separately
      if (user.emailConfirmed) return true;
      toast.error('Verifiera din e-post först', {
        description: `Du måste verifiera din e-post innan du kan ${action}.`,
        action: {
          label: 'Skicka länk igen',
          onClick: async () => {
            const { error } = await resendVerificationEmail();
            if (error) {
              toast.error('Kunde inte skicka', { description: error.message });
            } else {
              toast.success('Verifieringslänk skickad', {
                description: `Kolla din inkorg på ${user.email}`,
              });
            }
          },
        },
      });
      return false;
    },
    [user, resendVerificationEmail]
  );

  return { isVerified, requireVerified };
}
