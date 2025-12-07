import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { 
  DollarSign, 
  Clock, 
  Users, 
  CalendarDays,
  CheckCircle
} from 'lucide-react';

interface KitchenPartner {
  id: string;
  business_name: string;
  kitchen_description: string | null;
  kitchen_size: number | null;
  hourly_rate: number | null;
}



export const HyrUtDittKok = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [kitchenPartner, setKitchenPartner] = useState<KitchenPartner | null>(null);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    business_name: '',
    kitchen_description: '',
    kitchen_size: '',
    hourly_rate: '',
    equipment_details: '',
    municipality: ''
  });

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

  useEffect(() => {
    loadKitchenPartnerData();
  }, []);

  useEffect(() => {
    if (selectedDate && kitchenPartner) {
      loadAvailability();
    }
  }, [selectedDate, kitchenPartner]);

  const loadKitchenPartnerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('kitchen_partners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setKitchenPartner(data);
      
      // Populate settings form
      setSettingsForm({
        business_name: data.business_name || '',
        kitchen_description: data.kitchen_description || '',
        kitchen_size: data.kitchen_size?.toString() || '',
        hourly_rate: data.hourly_rate?.toString() || '',
        equipment_details: data.equipment_details || '',
        municipality: data.municipality || ''
      });
    } catch (error) {
      console.error('Error loading kitchen partner data:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda kökspartner data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async () => {
    if (!selectedDate || !kitchenPartner) return;

    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('kitchen_availability')
        .select('*')
        .eq('kitchen_partner_id', kitchenPartner.id)
        .eq('date', dateStr);

      if (error) throw error;

      const availabilityMap: Record<string, boolean> = {};
      data?.forEach((item) => {
        availabilityMap[item.time_slot] = item.is_available ?? false;
      });
      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  const toggleAvailability = async (timeSlot: string) => {
    if (!selectedDate || !kitchenPartner) return;

    setSavingAvailability(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    const currentStatus = availability[timeSlot] ?? false;
    const newStatus = !currentStatus;

    try {
      const { error } = await supabase
        .from('kitchen_availability')
        .upsert({
          kitchen_partner_id: kitchenPartner.id,
          date: dateStr,
          time_slot: timeSlot,
          is_available: newStatus
        }, {
          onConflict: 'kitchen_partner_id,date,time_slot'
        });

      if (error) throw error;

      setAvailability(prev => ({
        ...prev,
        [timeSlot]: newStatus
      }));

      toast({
        title: "Uppdaterat",
        description: `Tidslutet ${timeSlot} är nu ${newStatus ? 'tillgängligt' : 'otillgängligt'}`,
      });
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera tillgänglighet",
        variant: "destructive"
      });
    } finally {
      setSavingAvailability(false);
    }
  };

  const handleSettingsChange = (field: string, value: string) => {
    setSettingsForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async () => {
    if (!kitchenPartner) return;

    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from('kitchen_partners')
        .update({
          business_name: settingsForm.business_name,
          kitchen_description: settingsForm.kitchen_description,
          kitchen_size: settingsForm.kitchen_size ? parseInt(settingsForm.kitchen_size) : null,
          hourly_rate: settingsForm.hourly_rate ? parseFloat(settingsForm.hourly_rate) : null,
          equipment_details: settingsForm.equipment_details,
          municipality: settingsForm.municipality
        })
        .eq('id', kitchenPartner.id);

      if (error) throw error;

      // Update local state
      setKitchenPartner({
        ...kitchenPartner,
        business_name: settingsForm.business_name,
        kitchen_description: settingsForm.kitchen_description,
        kitchen_size: settingsForm.kitchen_size ? parseInt(settingsForm.kitchen_size) : null,
        hourly_rate: settingsForm.hourly_rate ? parseFloat(settingsForm.hourly_rate) : null
      });

      toast({
        title: "Inställningar sparade",
        description: "Dina köksinställningar har uppdaterats",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Fel",
        description: "Kunde inte spara inställningar",
        variant: "destructive"
      });
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!kitchenPartner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Ingen kökspartner data hittades</CardTitle>
            <CardDescription>Kontakta support för hjälp</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mitt kök</h1>
        <p className="text-muted-foreground">Översikt över bokningar och intäkter</p>
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
                <CardTitle>Kommande bokningar</CardTitle>
                <CardDescription>Nästa bokningar i ditt kök</CardDescription>
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
                  <h4 className="font-medium">{kitchenPartner.business_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {kitchenPartner.kitchen_description || 'Professionellt kök'}
                    {kitchenPartner.kitchen_size && `, ${kitchenPartner.kitchen_size} kvm`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Godkänd av kommunen</span>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <p className="text-lg font-semibold">
                    {kitchenPartner.hourly_rate || 100} kr/timme
                  </p>
                  <p className="text-sm text-muted-foreground">Timpris för uthyrning</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          
          <Card>
            <CardHeader>
                <CardTitle>Alla bokningar</CardTitle>
                <CardDescription>Se alla bokningar</CardDescription>
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
                <CardTitle>Välj datum</CardTitle>
                <CardDescription>Klicka för att ändra tillgänglighet</CardDescription>
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
                  {timeSlots.map((slot) => {
                    const isAvailable = availability[slot] ?? false;
                    return (
                      <div key={slot} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <span>{slot}</span>
                        <Button 
                          variant={isAvailable ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleAvailability(slot)}
                          disabled={savingAvailability}
                        >
                          {savingAvailability ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            isAvailable ? 'Tillgänglig' : 'Ej tillgänglig'
                          )}
                        </Button>
                      </div>
                    );
                  })}
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Företagsnamn *</Label>
                  <Input
                    id="business_name"
                    value={settingsForm.business_name}
                    onChange={(e) => handleSettingsChange('business_name', e.target.value)}
                    placeholder="Restaurang Svea"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="municipality">Kommun</Label>
                  <Input
                    id="municipality"
                    value={settingsForm.municipality}
                    onChange={(e) => handleSettingsChange('municipality', e.target.value)}
                    placeholder="Stockholm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kitchen_description">Köksbeskrivning</Label>
                <Textarea
                  id="kitchen_description"
                  value={settingsForm.kitchen_description}
                  onChange={(e) => handleSettingsChange('kitchen_description', e.target.value)}
                  placeholder="Beskriv ditt kök och dess egenskaper..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kitchen_size">Köksstorlek (kvm)</Label>
                  <Input
                    id="kitchen_size"
                    type="number"
                    value={settingsForm.kitchen_size}
                    onChange={(e) => handleSettingsChange('kitchen_size', e.target.value)}
                    placeholder="20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourly_rate">Timpris (kr/timme)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    value={settingsForm.hourly_rate}
                    onChange={(e) => handleSettingsChange('hourly_rate', e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment_details">Utrustningsdetaljer</Label>
                <Textarea
                  id="equipment_details"
                  value={settingsForm.equipment_details}
                  onChange={(e) => handleSettingsChange('equipment_details', e.target.value)}
                  placeholder="Lista tillgänglig utrustning: ugnar, spisar, kylskåp, etc."
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={saveSettings}
                  disabled={savingSettings}
                >
                  {savingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sparar...
                    </>
                  ) : (
                    'Spara ändringar'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
