import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface PhonePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue?: string;
  onConfirm: (phone: string) => void;
}

/**
 * Validates Swedish phone numbers in a forgiving way:
 * - allows +46... or 07X..., spaces / dashes
 * - must contain 8-15 digits in total
 */
function normalizeAndValidate(input: string): { ok: boolean; cleaned: string } {
  const cleaned = input.replace(/[\s\-()]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return { ok: false, cleaned };
  }
  if (!/^(\+|0)/.test(cleaned)) {
    return { ok: false, cleaned };
  }
  return { ok: true, cleaned };
}

export const PhonePromptDialog = ({
  open,
  onOpenChange,
  defaultValue,
  onConfirm,
}: PhonePromptDialogProps) => {
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(defaultValue || "");
      setError(null);
    }
  }, [open, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { ok, cleaned } = normalizeAndValidate(value);
    if (!ok) {
      setError("Ange ett giltigt mobilnummer (t.ex. 070 123 45 67 eller +46701234567).");
      return;
    }
    onConfirm(cleaned);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Mobilnummer krävs
          </DialogTitle>
          <DialogDescription>
            Vi behöver ditt mobilnummer för att skicka SMS när din mat är klar för upphämtning.
            Numret sparas på din profil och används endast för orderaviseringar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone-prompt">Mobilnummer</Label>
            <Input
              id="phone-prompt"
              type="tel"
              autoComplete="tel"
              placeholder="t.ex. 070 123 45 67"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              autoFocus
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Avbryt
            </Button>
            <Button type="submit" variant="food">
              Spara och fortsätt
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
