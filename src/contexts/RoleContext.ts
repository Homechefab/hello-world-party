import { createContext } from 'react';
import { UserRole, UserProfile } from '@/types/user';

export interface RoleContextType {
  role: UserRole | null;
  user: UserProfile | null;
  loading: boolean;
  isChef: boolean;
  isKitchenPartner: boolean;
  isCustomer: boolean;
  isRestaurant: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

export const RoleContext = createContext<RoleContextType | undefined>(undefined);