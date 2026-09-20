import { cn } from '../../lib/utils';
import type { Urgency } from '../../lib/types';

const urgencyStyles: Record<Urgency, string> = {
  LOW: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  EMERGENCY: 'bg-red-100 text-red-800 border-red-200 animate-pulse',
};

interface UrgencyBadgeProps {
  urgency: Urgency;
  className?: string;
}

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        urgencyStyles[urgency],
        className
      )}
    >
      {urgency}
    </span>
  );
}
