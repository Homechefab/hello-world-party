import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

const DAY_NAMES = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];

interface OperatingHour {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

interface Props {
  chefId: string;
  compact?: boolean;
}

export const ChefOperatingHoursDisplay = ({ chefId, compact = false }: Props) => {
  const [hours, setHours] = useState<OperatingHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('chef_operating_hours')
        .select('day_of_week, is_open, open_time, close_time')
        .eq('chef_id', chefId)
        .order('day_of_week');

      if (data) {
        setHours(data.map(h => ({
          ...h,
          open_time: h.open_time.slice(0, 5),
          close_time: h.close_time.slice(0, 5),
        })));
      }
      setLoading(false);
    };
    load();
  }, [chefId]);

  if (loading || hours.length === 0) return null;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const todayHours = hours.find(h => h.day_of_week === currentDay);
  const isOpenNow = todayHours?.is_open && currentTime >= todayHours.open_time && currentTime < todayHours.close_time;

  // Find next open time
  const getNextOpenTime = (): string | null => {
    // Check remaining today
    if (todayHours?.is_open && currentTime < todayHours.open_time) {
      return `Öppnar idag kl ${todayHours.open_time}`;
    }

    // Check following days
    for (let i = 1; i <= 7; i++) {
      const checkDay = (currentDay + i) % 7;
      const dayHours = hours.find(h => h.day_of_week === checkDay);
      if (dayHours?.is_open) {
        if (i === 1) {
          return `Öppnar imorgon kl ${dayHours.open_time}`;
        }
        return `Öppnar ${DAY_NAMES[checkDay]} kl ${dayHours.open_time}`;
      }
    }
    return null;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        {isOpenNow ? (
          <Badge variant="default" className="bg-green-600 text-white text-xs">
            Öppen nu • Stänger {todayHours!.close_time}
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            {getNextOpenTime() || 'Stängt'}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">Öppettider</span>
        {isOpenNow ? (
          <Badge variant="default" className="bg-green-600 text-white text-xs ml-auto">
            Öppen nu
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs ml-auto">
            {getNextOpenTime() || 'Stängt'}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-1 text-sm">
        {[1, 2, 3, 4, 5, 6, 0].map(dayIndex => {
          const dayHours = hours.find(h => h.day_of_week === dayIndex);
          const isToday = dayIndex === currentDay;

          return (
            <div
              key={dayIndex}
              className={`flex justify-between py-1 px-2 rounded ${
                isToday ? 'bg-primary/10 font-medium' : ''
              }`}
            >
              <span className={isToday ? 'text-primary' : 'text-muted-foreground'}>
                {DAY_NAMES[dayIndex]}
              </span>
              <span className={dayHours?.is_open ? '' : 'text-muted-foreground'}>
                {dayHours?.is_open
                  ? `${dayHours.open_time} – ${dayHours.close_time}`
                  : 'Stängt'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
