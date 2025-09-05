import { User, Settings, MapPin, CreditCard, Heart, LogOut, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UserMenu = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </Link>
    );
  }

  const userInitials = user.email
    ?.split('@')[0]
    ?.slice(0, 2)
    ?.toUpperCase() || 'US';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-background border border-border">
        <DropdownMenuLabel className="pb-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              Min profil
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <UserCircle className="w-4 h-4 mr-2" />
            Profil
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings/addresses" className="cursor-pointer">
            <MapPin className="w-4 h-4 mr-2" />
            Leveransadresser
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings/payment-methods" className="cursor-pointer">
            <CreditCard className="w-4 h-4 mr-2" />
            Betalningsmetoder
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings/preferences" className="cursor-pointer">
            <Heart className="w-4 h-4 mr-2" />
            Personliga preferenser
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Inställningar
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Logga ut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;