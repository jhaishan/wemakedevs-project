import { cn } from '../../lib/utils';
import { Wrench, Zap, Wifi, Building2, HelpCircle } from 'lucide-react';
import type { Category } from '../../lib/types';

const categoryConfig: Record<Category, { icon: React.ElementType; style: string }> = {
  PLUMBING: { icon: Wrench, style: 'bg-blue-100 text-blue-800 border-blue-200' },
  ELECTRICAL: { icon: Zap, style: 'bg-amber-100 text-amber-800 border-amber-200' },
  INTERNET: { icon: Wifi, style: 'bg-purple-100 text-purple-800 border-purple-200' },
  STRUCTURAL: { icon: Building2, style: 'bg-slate-100 text-slate-800 border-slate-200' },
  OTHER: { icon: HelpCircle, style: 'bg-gray-100 text-gray-800 border-gray-200' },
};

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.style,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {category}
    </span>
  );
}
