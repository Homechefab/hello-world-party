import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { UserRole } from '@/types/user';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: UserRole[];
}

const roleLabels: Record<UserRole, string> = {
  customer: 'Kund',
  chef: 'Kock',
  kitchen_partner: 'Kökspartner',
  restaurant: 'Restaurang',
  business: 'Företagare',
  admin: 'Admin'
};

const allRoles: UserRole[] = ['customer', 'chef', 'kitchen_partner', 'restaurant', 'business', 'admin'];

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Hämta alla användare
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      // Hämta roller för alla användare
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Kombinera data
      const usersWithRoles = profiles?.map(profile => {
        const roles = userRoles
          ?.filter(ur => ur.user_id === profile.id)
          .map(ur => ur.role as UserRole) || [];
        
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          created_at: profile.created_at,
          roles: roles.length > 0 ? roles : ['customer'] as UserRole[]
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Fel vid hämtning av användare:', error);
      toast.error('Kunde inte hämta användare');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, role: UserRole, currentRoles: UserRole[]) => {
    try {
      setUpdatingUser(userId);
      const hasRole = currentRoles.includes(role);

      if (hasRole) {
        // Ta bort roll
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);

        if (error) throw error;
        toast.success(`Rollen ${roleLabels[role]} har tagits bort`);
      } else {
        // Lägg till roll
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });

        if (error) throw error;
        toast.success(`Rollen ${roleLabels[role]} har lagts till`);
      }

      // Uppdatera listan
      await fetchUsers();
    } catch (error: unknown) {
      console.error('Fel vid uppdatering av roll:', error);
      toast.error(error instanceof Error ? error.message : 'Kunde inte uppdatera roll');
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Användarhantering</CardTitle>
          <CardDescription>Hantera användarroller</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Laddar användare...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Användarhantering</CardTitle>
        <CardDescription>Hantera roller för {users.length} användare</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{user.full_name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Registrerad: {new Date(user.created_at).toLocaleDateString('sv-SE')}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allRoles.map((role) => (
                  <label
                    key={role}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors
                      ${user.roles.includes(role) 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:bg-secondary'
                      }
                      ${updatingUser === user.id ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <Checkbox
                      checked={user.roles.includes(role)}
                      onCheckedChange={() => handleRoleToggle(user.id, role, user.roles)}
                      disabled={updatingUser === user.id}
                    />
                    <span className="text-sm font-medium">{roleLabels[role]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
