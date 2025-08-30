import { useState } from 'react';
import KitchenPartnerServices from '@/components/services/KitchenPartnerServices';
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
        <p className="text-muted-foreground">Hyr ut ditt restaurangkök och få betalt</p>
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
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBookings.map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">{booking.chef}</p>
                        <p className="text-sm text-muted-foreground">{booking.date} • {booking.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{booking.amount} kr</p>
                        <Badge variant="outline" className="text-xs">Bekräftad</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Köksinformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Restaurang Svea</p>
                    <p className="text-sm text-muted-foreground">Professionellt kök, 20 kvm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Godkänd av kommunen</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>100 kr/timme</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alla Bokningar</CardTitle>
              <CardDescription>Hantera dina köksbokningar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...upcomingBookings, ...upcomingBookings].map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.chef}</p>
                      <p className="text-sm text-muted-foreground">{booking.date} • {booking.time}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{booking.amount} kr</p>
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        {index < 3 ? "Kommande" : "Slutförd"}
                      </Badge>
                      <Button variant="outline" size="sm">Detaljer</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Välj Datum</CardTitle>
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
                <CardTitle>Tillgängliga Tider</CardTitle>
                <CardDescription>
                  {selectedDate?.toLocaleDateString('sv-SE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span>{slot}</span>
                      <Badge variant={index === 1 ? "secondary" : "outline"}>
                        {index === 1 ? "Bokad" : "Tillgänglig"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">Uppdatera Schema</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Köksinställningar</CardTitle>
              <CardDescription>Hantera ditt köks information och priser</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Timpris</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={100}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  <span className="text-sm text-muted-foreground">kr/timme</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Faciliteter</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Ugn', 'Spis', 'Frys', 'Kylskåp', 'Diskmaskin', 'Ventilation'].map((facility) => (
                    <label key={facility} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full">Spara Ändringar</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Kitchen Partner Services */}
      <KitchenPartnerServices />
    </div>
  );
};