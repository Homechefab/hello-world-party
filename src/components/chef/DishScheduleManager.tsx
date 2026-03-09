import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarOff, CalendarDays, Save, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const WEEKDAYS = [
  { value: 1, label: 'Måndag', short: 'Mån' },
  { value: 2, label: 'Tisdag', short: 'Tis' },
  { value: 3, label: 'Onsdag', short: 'Ons' },
  { value: 4, label: 'Torsdag', short: 'Tor' },
  { value: 5, label: 'Fredag', short: 'Fre' },
  { value: 6, label: 'Lördag', short: 'Lör' },
  { value: 0, label: 'Söndag', short: 'Sön' },
];

interface DishScheduleManagerProps {
  dishId: string;
  dishName: string;
  onClose: () => void;
}

interface WeeklySchedule {
  [dayOfWeek: number]: boolean;
}

interface DateException {
  id: string;
  exception_date: string;
  is_available: boolean;
  reason: string | null;
}

export const DishScheduleManager = ({ dishId, dishName, onClose }: DishScheduleManagerProps) => {
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [exceptions, setExceptions] = useState<DateException[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [exceptionReason, setExceptionReason] = useState('');
  const { toast } = useToast();

  const fetchSchedule = useCallback(async () => {
    try {
      const [scheduleRes, exceptionsRes] = await Promise.all([
        supabase.from('dish_weekly_schedule').select('*').eq('dish_id', dishId),
        supabase.from('dish_date_exceptions').select('*').eq('dish_id', dishId).gte('exception_date', new Date().toISOString().split('T')[0]).order('exception_date', { ascending: true }),
      ]);

      if (scheduleRes.error) throw scheduleRes.error;
      if (exceptionsRes.error) throw exceptionsRes.error;

      const weeklyMap: WeeklySchedule = {};
      (scheduleRes.data || []).forEach((row: any) => {
        weeklyMap[row.day_of_week] = row.is_available;
      });
      setSchedule(weeklyMap);
      setExceptions(exceptionsRes.data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  }, [dishId]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const toggleDay = (day: number) => {
    setSchedule(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      // Upsert all 7 days
      const upsertData = WEEKDAYS.map(d => ({
        dish_id: dishId,
        day_of_week: d.value,
        is_available: schedule[d.value] ?? false,
      }));

      const { error } = await supabase
        .from('dish_weekly_schedule')
        .upsert(upsertData, { onConflict: 'dish_id,day_of_week' });

      if (error) throw error;

      toast({ title: 'Sparat!', description: 'Veckoschemat har uppdaterats' });
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({ title: 'Fel', description: 'Kunde inte spara schemat', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addException = async () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    try {
      const { error } = await supabase
        .from('dish_date_exceptions')
        .upsert({
          dish_id: dishId,
          exception_date: dateStr,
          is_available: false,
          reason: exceptionReason || null,
        }, { onConflict: 'dish_id,exception_date' });

      if (error) throw error;

      toast({ title: 'Undantag tillagt', description: `${format(selectedDate, 'd MMMM', { locale: sv })} är nu avstängd` });
      setSelectedDate(undefined);
      setExceptionReason('');
      fetchSchedule();
    } catch (error) {
      console.error('Error adding exception:', error);
      toast({ title: 'Fel', description: 'Kunde inte lägga till undantag', variant: 'destructive' });
    }
  };

  const removeException = async (id: string) => {
    try {
      const { error } = await supabase.from('dish_date_exceptions').delete().eq('id', id);
      if (error) throw error;
      fetchSchedule();
    } catch (error) {
      console.error('Error removing exception:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const activeDays = WEEKDAYS.filter(d => schedule[d.value]).map(d => d.short);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{dishName}</h3>
          <p className="text-sm text-muted-foreground">
            {activeDays.length > 0 ? `Tillgänglig: ${activeDays.join(', ')}` : 'Inget schema satt – tillgänglig alla dagar'}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekly schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Veckoschema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAYS.map(day => (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                  schedule[day.value]
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                <span className="text-xs font-medium">{day.short}</span>
              </button>
            ))}
          </div>
          <Button onClick={handleSaveSchedule} disabled={saving} className="w-full mt-4" size="sm">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Spara veckoschema
          </Button>
        </CardContent>
      </Card>

      {/* Date exceptions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarOff className="h-4 w-4" />
            Datumundantag
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Stäng av rätten för specifika datum (t.ex. semester, ledighet)
          </p>
          
          <div className="flex flex-col gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: sv }) : 'Välj datum'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  locale={sv}
                />
              </PopoverContent>
            </Popover>

            {selectedDate && (
              <>
                <div>
                  <Label htmlFor="reason" className="text-sm">Anledning (valfritt)</Label>
                  <Input
                    id="reason"
                    value={exceptionReason}
                    onChange={(e) => setExceptionReason(e.target.value)}
                    placeholder="T.ex. semester"
                    className="mt-1"
                  />
                </div>
                <Button onClick={addException} size="sm">
                  Lägg till undantag
                </Button>
              </>
            )}
          </div>

          {exceptions.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium">Kommande undantag:</p>
              {exceptions.map(exc => (
                <div key={exc.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {format(new Date(exc.exception_date), 'd MMM', { locale: sv })}
                    </Badge>
                    {exc.reason && <span className="text-sm text-muted-foreground">{exc.reason}</span>}
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeException(exc.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
