import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, Package, ChefHat, Timer } from 'lucide-react';

interface OrderTrackingCardProps {
  status: string;
  estimatedReadyAt: string | null;
  preparationStartedAt: string | null;
  compact?: boolean;
}

const STEPS = [
  { key: 'pending', label: 'Mottagen', icon: Package },
  { key: 'confirmed', label: 'Bekräftad', icon: CheckCircle },
  { key: 'preparing', label: 'Tillagas', icon: ChefHat },
  { key: 'ready', label: 'Klar', icon: CheckCircle },
];

const getStepIndex = (status: string) => {
  const idx = STEPS.findIndex(s => s.key === status);
  return idx >= 0 ? idx : -1;
};

export const OrderTrackingCard = ({ status, estimatedReadyAt, preparationStartedAt, compact }: OrderTrackingCardProps) => {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const isActive = ['pending', 'confirmed', 'preparing', 'ready'].includes(status);
  const currentStep = getStepIndex(status);

  useEffect(() => {
    if (!estimatedReadyAt || !isActive) {
      setMinutesLeft(null);
      return;
    }

    const update = () => {
      const now = Date.now();
      const ready = new Date(estimatedReadyAt).getTime();
      const diff = Math.max(0, Math.ceil((ready - now) / 60000));
      setMinutesLeft(diff);

      // Calculate progress based on start time
      if (preparationStartedAt) {
        const start = new Date(preparationStartedAt).getTime();
        const total = ready - start;
        const elapsed = now - start;
        setProgress(total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 0);
      } else {
        // Fallback: use a rough estimate
        setProgress(status === 'ready' ? 100 : status === 'preparing' ? 60 : status === 'confirmed' ? 25 : 10);
      }
    };

    update();
    const interval = setInterval(update, 10000); // update every 10s
    return () => clearInterval(interval);
  }, [estimatedReadyAt, preparationStartedAt, isActive, status]);

  if (!isActive) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Timer className="w-4 h-4 text-primary animate-pulse" />
        {minutesLeft !== null && minutesLeft > 0 ? (
          <span className="font-medium text-primary">~{minutesLeft} min kvar</span>
        ) : minutesLeft === 0 ? (
          <span className="font-medium text-primary">Snart klar!</span>
        ) : (
          <span className="text-muted-foreground">Beräknar tid...</span>
        )}
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 space-y-4">
        {/* Countdown */}
        <div className="text-center">
          {minutesLeft !== null && minutesLeft > 0 ? (
            <>
              <div className="text-4xl font-bold text-primary">{minutesLeft}</div>
              <div className="text-sm text-muted-foreground">minuter kvar</div>
            </>
          ) : minutesLeft === 0 ? (
            <>
              <div className="text-2xl font-bold text-primary">Snart klar!</div>
              <div className="text-sm text-muted-foreground">Din mat är nästan redo</div>
            </>
          ) : (
            <>
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Väntar på tidsuppskattning</div>
            </>
          )}
        </div>

        {/* Progress bar */}
        {minutesLeft !== null && (
          <Progress value={progress} className="h-2" />
        )}

        {/* Steps */}
        <div className="flex justify-between">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx <= currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={step.key} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                  isDone 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs ${isDone ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
