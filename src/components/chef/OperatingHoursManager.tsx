import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Clock, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DAY_NAMES = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];

const TIME_OPTIONS = Array.from({ length: 37 }, (_, i) => {
  const hours = Math.floor((i * 30 + 360) / 60); // Start at 06:00
  const minutes = (i * 30 + 360) % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}).filter(t => t <= '24:00');

interface DaySchedule {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

const DEFAULT_SCHEDULE: DaySchedule[] = Array.from({ length: 7 }, (_, i) => ({
  day_of_week: i,
  is_open: i >= 1 && i <= 5, // Mon-Fri open by default
  open_time: '08:00',
  close_time: '18:00',
}));

interface OperatingHoursManagerProps {
  chefId?: string | null;
}

export const OperatingHoursManager = ({ chefId: overrideChefId }: OperatingHoursManagerProps = {}) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [chefId, setChefId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOperatingHours();
  }, [overrideChefId]);

  const loadOperatingHours = async () => {
    try {
      let resolvedChefId: string | null = null;

      if (overrideChefId) {
        resolvedChefId = overrideChefId;
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: chefData } = await supabase
          .from('chefs')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!chefData) return;
        resolvedChefId = chefData.id;
      }

      setChefId(resolvedChefId);

      const { data: hours } = await supabase
        .from('chef_operating_hours')
        .select('*')
        .eq('chef_id', resolvedChefId)
        .order('day_of_week');

      if (hours && hours.length > 0) {
        const merged = DEFAULT_SCHEDULE.map(defaultDay => {
          const existing = hours.find(h => h.day_of_week === defaultDay.day_of_week);
          if (existing) {
            return {
              day_of_week: existing.day_of_week,
              is_open: existing.is_open,
              open_time: existing.open_time.slice(0, 5),
              close_time: existing.close_time.slice(0, 5),
            };
          }
          return defaultDay;
        });
        setSchedule(merged);
      }
    } catch (error) {
      console.error('Error loading operating hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (dayIndex: number, field: keyof DaySchedule, value: boolean | string) => {
    setSchedule(prev => prev.map(day =>
      day.day_of_week === dayIndex ? { ...day, [field]: value } : day
    ));
  };

  const handleSave = async () => {
    if (!chefId) return;
    setSaving(true);

    try {
      // Upsert all 7 days
      const rows = schedule.map(day => ({
        chef_id: chefId,
        day_of_week: day.day_of_week,
        is_open: day.is_open,
        open_time: day.open_time,
        close_time: day.close_time,
      }));

      for (const row of rows) {
        const { error } = await supabase
          .from('chef_operating_hours')
          .upsert(row, { onConflict: 'chef_id,day_of_week' });

        if (error) throw error;
      }

      toast({
        title: 'Öppettider sparade',
        description: 'Dina öppettider har uppdaterats.',
      });
    } catch (error) {
      console.error('Error saving operating hours:', error);
      toast({
        title: 'Fel vid sparande',
        description: 'Kunde inte spara öppettiderna. Försök igen.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground mt-2">Laddar öppettider...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Öppettider
        </CardTitle>
        <CardDescription>
          Ange vilka tider du tar emot beställningar. Kunder ser dessa tider på din profil.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reorder to start with Monday (1) through Sunday (0) */}
        {[1, 2, 3, 4, 5, 6, 0].map(dayIndex => {
          const day = schedule.find(d => d.day_of_week === dayIndex)!;
          return (
            <div
              key={dayIndex}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                day.is_open ? 'bg-muted/30 border-border' : 'bg-muted/10 border-transparent'
              }`}
            >
              <div className="w-24 flex-shrink-0">
                <Label className="font-medium">{DAY_NAMES[dayIndex]}</Label>
              </div>

              <Switch
                checked={day.is_open}
                onCheckedChange={(checked) => updateDay(dayIndex, 'is_open', checked)}
              />

              {day.is_open ? (
                <div className="flex items-center gap-2 flex-1">
                  <select
                    value={day.open_time}
                    onChange={(e) => updateDay(dayIndex, 'open_time', e.target.value)}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {TIME_OPTIONS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="text-muted-foreground">—</span>
                  <select
                    value={day.close_time}
                    onChange={(e) => updateDay(dayIndex, 'close_time', e.target.value)}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {TIME_OPTIONS.filter(t => t > day.open_time).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Stängt</span>
              )}
            </div>
          );
        })}

        <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Sparar...' : 'Spara öppettider'}
        </Button>
      </CardContent>
    </Card>
  );
};
