import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onForgotPasswordNavigate?: () => void;
}

export const AuthDialog = ({ open, onOpenChange, onForgotPasswordNavigate }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSuccess = () => {
    setIsLogin(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>{isLogin ? 'Logga in' : 'Skapa konto'}</DialogTitle>
          <DialogDescription>
            Logga in eller skapa konto för att fortsätta till betalning.
          </DialogDescription>
        </DialogHeader>

        {isLogin ? (
          <LoginForm
            onToggleMode={() => setIsLogin(false)}
            onSuccess={handleSuccess}
            onForgotPassword={() => {
              onOpenChange(false);
              onForgotPasswordNavigate?.();
            }}
          />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} onSuccess={handleSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
};
