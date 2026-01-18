import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Mail, MapPin, Search, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface EarlyAccessSignup {
  id: string;
  email: string;
  postal_code: string;
  created_at: string;
}

export const EarlyAccessSignups = () => {
  const [signups, setSignups] = useState<EarlyAccessSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('early_access_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignups(data || []);
    } catch (error) {
      console.error('Error fetching signups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSignups = signups.filter(signup => 
    signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    signup.postal_code.includes(searchTerm)
  );

  // Group by postal code for stats
  const postalCodeStats = signups.reduce((acc, signup) => {
    const code = signup.postal_code.replace(/\s/g, '').substring(0, 3);
    acc[code] = (acc[code] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPostalCodes = Object.entries(postalCodeStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const exportToCsv = () => {
    const headers = ['E-post', 'Postnummer', 'Registrerad'];
    const rows = signups.map(s => [
      s.email,
      s.postal_code,
      format(new Date(s.created_at), 'yyyy-MM-dd HH:mm')
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `early-access-signups-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt anmälda</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signups.length}</div>
            <p className="text-xs text-muted-foreground">Tidiga prenumeranter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unika områden</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(postalCodeStats).length}</div>
            <p className="text-xs text-muted-foreground">Postnummerområden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Populäraste områden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {topPostalCodes.map(([code, count]) => (
                <Badge key={code} variant="secondary" className="text-xs">
                  {code}xx: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Tidiga prenumeranter</CardTitle>
              <CardDescription>Alla som vill bli notifierade när kockar finns i deras område</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchSignups} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Uppdatera
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCsv} disabled={signups.length === 0}>
                <Download className="h-4 w-4 mr-1" />
                Exportera CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök på e-post eller postnummer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredSignups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Inga resultat hittades' : 'Inga anmälningar ännu'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-post</TableHead>
                    <TableHead>Postnummer</TableHead>
                    <TableHead>Registrerad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSignups.map((signup) => (
                    <TableRow key={signup.id}>
                      <TableCell className="font-medium">{signup.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{signup.postal_code}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(signup.created_at), 'PPp', { locale: sv })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
