import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Mail, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Signup {
  id: string;
  email: string;
  postal_code: string;
  created_at: string;
}

export function EarlyAccessSignups() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      const { data, error } = await supabase
        .from('early_access_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignups(data || []);
    } catch (error) {
      console.error('Error fetching early access signups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Laddar...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Early Access-anmälningar
        </CardTitle>
        <CardDescription>
          Användare som har anmält intresse via förregistrerings-popupen
        </CardDescription>
        <Badge variant="secondary" className="w-fit">
          {signups.length} anmälningar totalt
        </Badge>
      </CardHeader>
      <CardContent>
        {signups.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Inga anmälningar ännu.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Mail className="h-4 w-4 inline mr-1" /> E-post</TableHead>
                  <TableHead><MapPin className="h-4 w-4 inline mr-1" /> Postnummer</TableHead>
                  <TableHead><Calendar className="h-4 w-4 inline mr-1" /> Datum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signups.map((signup) => (
                  <TableRow key={signup.id}>
                    <TableCell className="font-medium">{signup.email}</TableCell>
                    <TableCell>{signup.postal_code}</TableCell>
                    <TableCell>
                      {format(new Date(signup.created_at), 'PPP HH:mm', { locale: sv })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
