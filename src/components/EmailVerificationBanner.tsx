import { useState } from 'react';
import { Mail, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export const EmailVerificationBanner = () => {
  const { user, resendVerificationEmail } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user || user.emailConfirmed || dismissed) return null;

  const handleResend = async () => {
    setSending(true);
    const { error } = await resendVerificationEmail();
    setSending(false);
    if (error) {
      toast.error('Kunde inte skicka verifieringslänk', {
        description: error.message,
      });
    } else {
      toast.success('Verifieringslänk skickad', {
        description: `Kolla din inkorg på ${user.email}`,
      });
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 w-full bg-amber-500/95 text-amber-950 backdrop-blur supports-[backdrop-filter]:bg-amber-500/90 border-b border-amber-600 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
        <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="flex-1 min-w-0">
          <span className="font-medium">Verifiera din e-post</span>
          <span className="hidden sm:inline"> för att låsa upp alla funktioner som beställning och kockprofil.</span>
        </p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-amber-950 hover:bg-amber-600/30 underline underline-offset-2"
          onClick={handleResend}
          disabled={sending}
        >
          {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Skicka länk igen'}
        </Button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Stäng"
          className="p-1 rounded hover:bg-amber-600/30 shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
