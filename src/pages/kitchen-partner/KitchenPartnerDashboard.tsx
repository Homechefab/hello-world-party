import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Building, 
  DollarSign, 
  Clock, 
  Users, 
  TrendingUp,
  CalendarDays,
  CheckCircle
} from 'lucide-react';

export const KitchenPartnerDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const stats = {
    totalEarnings: 8450,
    bookingsThisMonth: 15,
    utilization: 67,
    averageRating: 4.6
  };

  const upcomingBookings = [
    { chef: 'Anna Kök', time: '09:00-13:00', date: 'Idag', amount: 400 },
    { chef: 'Erik Matsson', time: '14:00-18:00', date: 'Imorgon', amount: 350 },
    { chef: 'Lisa Hemlagat', time: '10:00-14:00', date: '15 Dec', amount: 450 }
  ];

  const timeSlots = [
    '08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-24:00'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Kökspartner Dashboard</h1>
        <p className="text-muted-foreground">Hantera dina bokningar och håll koll på intäkter</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Intäkter</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEarnings.toLocaleString('sv-SE')} kr</div>
            <p className="text-xs text-muted-foreground">+18% från förra månaden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bokningar</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookingsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Denna månad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utnyttjande</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilization}%</div>
            <p className="text-xs text-muted-foreground">Av tillgänglig tid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Betyg</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">Genomsnittligt betyg</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="bookings">Bokningar</TabsTrigger>
          <TabsTrigger value="schedule">Schema</TabsTrigger>
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kommande Bokningar</CardTitle>
                <CardDescription>Dina nästa schemalagda sessioner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBookings.map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">{booking.chef}</p>
                        <p className="text-sm text-muted-foreground">{booking.date} • {booking.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{booking.amount} kr</p>
                        <Badge variant="secondary">Bekräftad</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Köksinformation</CardTitle>
                <CardDescription>Din kökspartner-profil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Restaurang Svea</h4>
                  <p className="text-sm text-muted-foreground">Professionellt kök, 20 kvm</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Godkänd av kommunen</span>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <p className="text-lg font-semibold">100 kr/timme</p>
                  <p className="text-sm text-muted-foreground">Timpris för uthyrning</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alla Bokningar</CardTitle>
              <CardDescription>Hantera alla dina bokningar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bokningar kommer att visas här...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Välj Datum</CardTitle>
                <CardDescription>Klicka på ett datum för att hantera tillgänglighet</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tidslutor för {selectedDate?.toLocaleDateString('sv-SE')}</CardTitle>
                <CardDescription>Markera när ditt kök är tillgängligt</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <div key={slot} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span>{slot}</span>
                      <Button variant="outline" size="sm">
                        Tillgänglig
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Köksinställningar</CardTitle>
              <CardDescription>Hantera ditt kök och priser</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inställningar kommer att visas här...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};