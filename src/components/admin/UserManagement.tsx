import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { UserRole } from '@/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address: string | null;
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
  const [searchTerm, setSearchTerm] = useState('');

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
          phone: profile.phone,
          address: profile.address,
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

  // Filtrera användare baserat på sökterm
  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm)) ||
    (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Användarhantering
          </CardTitle>
          <CardDescription>Hantera användarroller och se kontaktuppgifter</CardDescription>
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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Användarhantering
        </CardTitle>
        <CardDescription>
          {users.length} registrerade användare totalt • Visar kontaktuppgifter sedan lansering
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sökfält */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök på namn, mejl, telefon eller adress..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Statistik */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Visar {filteredUsers.length} av {users.length} användare</span>
          <span>•</span>
          <span>Med mejl: {users.filter(u => u.email).length}</span>
          <span>•</span>
          <span>Med telefon: {users.filter(u => u.phone).length}</span>
        </div>

        {/* Användartabell */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Namn</TableHead>
                <TableHead className="min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Mejl
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Telefon
                  </div>
                </TableHead>
                <TableHead className="min-w-[150px]">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Adress
                  </div>
                </TableHead>
                <TableHead className="min-w-[100px]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Registrerad
                  </div>
                </TableHead>
                <TableHead className="min-w-[300px]">Roller</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>
                    <a 
                      href={`mailto:${user.email}`} 
                      className="text-primary hover:underline"
                    >
                      {user.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    {user.phone ? (
                      <a 
                        href={`tel:${user.phone}`} 
                        className="text-primary hover:underline"
                      >
                        {user.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.address || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('sv-SE')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {allRoles.map((role) => (
                        <label
                          key={role}
                          className={`
                            flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer transition-colors
                            ${user.roles.includes(role) 
                              ? 'border border-primary bg-primary/10 text-primary' 
                              : 'border border-border hover:bg-secondary'
                            }
                            ${updatingUser === user.id ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <Checkbox
                            checked={user.roles.includes(role)}
                            onCheckedChange={() => handleRoleToggle(user.id, role, user.roles)}
                            disabled={updatingUser === user.id}
                            className="h-3 w-3"
                          />
                          <span>{roleLabels[role]}</span>
                        </label>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Inga användare matchade sökningen
          </p>
        )}
      </CardContent>
    </Card>
  );
};