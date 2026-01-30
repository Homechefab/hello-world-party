import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Monitor, Smartphone, Tablet, Globe, RefreshCw, Calendar } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Visitor {
  id: string;
  visited_at: string;
  page_path: string;
  user_agent: string | null;
  referrer: string | null;
  user_id: string | null;
  session_id: string | null;
  device_type: string | null;
  browser: string | null;
}

const Visitors = () => {
  const [timeFilter, setTimeFilter] = useState<string>('7');

  const { data: visitors, isLoading, refetch } = useQuery({
    queryKey: ['admin-visitors', timeFilter],
    queryFn: async () => {
      const startDate = startOfDay(subDays(new Date(), parseInt(timeFilter)));
      
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .gte('visited_at', startDate.toISOString())
        .order('visited_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      return data as Visitor[];
    },
  });

  // Calculate statistics
  const stats = {
    totalVisits: visitors?.length || 0,
    uniqueSessions: new Set(visitors?.map(v => v.session_id).filter(Boolean)).size,
    loggedInVisits: visitors?.filter(v => v.user_id).length || 0,
    mobileVisits: visitors?.filter(v => v.device_type === 'mobile').length || 0,
    desktopVisits: visitors?.filter(v => v.device_type === 'desktop').length || 0,
    tabletVisits: visitors?.filter(v => v.device_type === 'tablet').length || 0,
  };

  // Get top pages
  const pageVisits = visitors?.reduce((acc, v) => {
    acc[v.page_path] = (acc[v.page_path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topPages = Object.entries(pageVisits)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get browser stats
  const browserStats = visitors?.reduce((acc, v) => {
    if (v.browser) {
      acc[v.browser] = (acc[v.browser] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const getDeviceIcon = (type: string | null) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Besökare</h1>
          <p className="text-muted-foreground">Spåra och analysera besökare på hemsidan</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Välj period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Senaste 24 timmarna</SelectItem>
              <SelectItem value="7">Senaste 7 dagarna</SelectItem>
              <SelectItem value="30">Senaste 30 dagarna</SelectItem>
              <SelectItem value="90">Senaste 90 dagarna</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala besök</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">
              Senaste {timeFilter} dagarna
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unika sessioner</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSessions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.loggedInVisits} inloggade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobil</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mobileVisits}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalVisits > 0 ? Math.round((stats.mobileVisits / stats.totalVisits) * 100) : 0}% av besök
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.desktopVisits}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalVisits > 0 ? Math.round((stats.desktopVisits / stats.totalVisits) * 100) : 0}% av besök
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages & Browser Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mest besökta sidor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map(([path, count]) => (
                <div key={path} className="flex items-center justify-between">
                  <code className="text-sm bg-muted px-2 py-1 rounded">{path}</code>
                  <Badge variant="secondary">{count} besök</Badge>
                </div>
              ))}
              {topPages.length === 0 && (
                <p className="text-muted-foreground text-sm">Inga besök registrerade</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webbläsare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(browserStats)
                .sort(([, a], [, b]) => b - a)
                .map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <span className="text-sm">{browser}</span>
                    <Badge variant="secondary">{count} besök</Badge>
                  </div>
                ))}
              {Object.keys(browserStats).length === 0 && (
                <p className="text-muted-foreground text-sm">Ingen data tillgänglig</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste besöken</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tidpunkt</TableHead>
                  <TableHead>Sida</TableHead>
                  <TableHead>Enhet</TableHead>
                  <TableHead>Webbläsare</TableHead>
                  <TableHead>Referens</TableHead>
                  <TableHead>Inloggad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors?.slice(0, 50).map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(visitor.visited_at), 'PPp', { locale: sv })}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {visitor.page_path}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(visitor.device_type)}
                        <span className="text-sm capitalize">{visitor.device_type || 'Okänd'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{visitor.browser || 'Okänd'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {visitor.referrer ? (
                        <span className="text-xs text-muted-foreground">{visitor.referrer}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Direkt</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={visitor.user_id ? 'default' : 'secondary'}>
                        {visitor.user_id ? 'Ja' : 'Nej'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(!visitors || visitors.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Inga besök registrerade för vald period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Visitors;
