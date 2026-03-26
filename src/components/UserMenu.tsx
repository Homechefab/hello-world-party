import { User, Settings, MapPin, CreditCard, LogOut, UserCircle, ShoppingBag, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRole } from "../hooks/useRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { user: profileUser, isChef, isAdmin, isKitchenPartner, isRestaurant } = useRole();

  const userEmail = user?.email || profileUser?.email;
  const shouldShowMenu = !!user;

  if (!shouldShowMenu) {
    return (
      <Link to="/auth">
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </Link>
    );
  }

  const userInitials = userEmail
    ?.split('@')[0]
    ?.slice(0, 2)
    ?.toUpperCase() || 'TE';

  const handleSignOut = () => {
    if (user) {
      signOut();
    } else {
      // For mock data, just redirect to auth
      window.location.href = '/auth';
    }
  };

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
            <p className="text-sm font-medium leading-none">{userEmail}</p>
            <p className="text-xs leading-none text-muted-foreground">
              Min profil {!user && '(Test-läge)'}
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

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard" className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        {isChef && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/chef/orders" className="cursor-pointer">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Mina beställningar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/chef/kitchen" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Kökshantering
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {isKitchenPartner && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/partner/bookings" className="cursor-pointer">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Bokningar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/partner/kitchen" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Kökshantering
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {isRestaurant && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/restaurant/orders" className="cursor-pointer">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Beställningar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/restaurant/menu" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Menyhantering
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {!isAdmin && !isChef && !isKitchenPartner && !isRestaurant && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/my-orders" className="cursor-pointer">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Mina köp
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
              <Link to="/my-points" className="cursor-pointer">
                <Gift className="w-4 h-4 mr-2" />
                Mina poäng
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Inställningar
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          {user ? 'Logga ut' : 'Logga in'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;