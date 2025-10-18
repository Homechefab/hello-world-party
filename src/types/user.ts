export type UserRole = 'customer' | 'chef' | 'kitchen_partner' | 'admin' | 'restaurant';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  // Primary role (highest priority) for backward compatibility
  role: UserRole;
  // All roles the user has
  roles?: UserRole[];
  phone?: string;
  address?: string;
  municipality_approved?: boolean;
  onboarding_completed?: boolean;
  created_at: string;
}

export interface ChefProfile extends UserProfile {
  role: 'chef';
  business_name: string;
  hygiene_certificate_url?: string;
  kitchen_approved: boolean;
  municipality_approval_date?: string;
}

export interface KitchenPartnerProfile extends UserProfile {
  role: 'kitchen_partner';
  restaurant_name: string;
  kitchen_capacity: number;
  hourly_rate: number;
  facilities: string[];
  availability_schedule: Record<string, string[]>;
}