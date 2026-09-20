import { cn } from '../../lib/utils';
import { Brain, UserCheck, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { UrgencyBadge } from './UrgencyBadge';
import { CategoryBadge } from './CategoryBadge';
import type { StepType, ClassifyOutput, RouteOutput, DraftOutput } from '../../lib/types';

interface AgentStepCardProps {
  stepType: StepType;
  data: ClassifyOutput | RouteOutput | DraftOutput | null;
  isActive?: boolean;
}

const stepConfig = {
  CLASSIFY: {
    icon: Brain,
    title: 'Classification',
    accent: 'border-l-indigo-500',
    bgAccent: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  ROUTE: {
    icon: UserCheck,
    title: 'Routing',
    accent: 'border-l-emerald-500',
    bgAccent: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  DRAFT: {
    icon: Mail,
    title: 'Draft Message',
    accent: 'border-l-purple-500',
    bgAccent: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
};

function ClassifyContent({ data }: { data: ClassifyOutput }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CategoryBadge category={data.category} />
        <UrgencyBadge urgency={data.urgency} />
      </div>
      <p className="text-sm text-gray-600 italic">"{data.reasoning}"</p>
    </div>
  );
}

function RouteContent({ data }: { data: RouteOutput }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">Assigned to:</span>
        <span className="text-sm text-gray-700">{data.assignedToName}</span>
        <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">
          {data.routedRole}
        </span>
      </div>
      <p className="text-sm text-gray-600 italic">"{data.reasoning}"</p>
    </div>
  );
}

function DraftContent({ data }: { data: DraftOutput }) {
  return (
    <div className="space-y-3">
      <div className="rounded-md bg-gray-50 p-3 border border-gray-200">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{data.draftMessage}</p>
      </div>
      <p className="text-sm text-gray-600 italic">"{data.reasoning}"</p>
    </div>
  );
}

export function AgentStepCard({ stepType, data, isActive }: AgentStepCardProps) {
  const config = stepConfig[stepType];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        'border-l-4 transition-all duration-500 ease-out',
        config.accent,
        data
          ? 'opacity-100 translate-y-0'
          : isActive
          ? 'opacity-100 translate-y-0'
          : 'opacity-60 border-dashed',
        isActive && !data && 'animate-pulse'
      )}
    >
      <CardHeader className={cn('pb-3', data ? config.bgAccent : '')}>
        <CardTitle className="flex items-center gap-2 text-base">
          {isActive && !data ? (
            <Loader2 className={cn('h-5 w-5 animate-spin', config.iconColor)} />
          ) : (
            <Icon className={cn('h-5 w-5', config.iconColor)} />
          )}
          {config.title}
          {!data && !isActive && (
            <span className="text-xs font-normal text-gray-400 ml-auto">Waiting...</span>
          )}
          {isActive && !data && (
            <span className="text-xs font-normal text-gray-500 ml-auto">Processing...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {stepType === 'CLASSIFY' && <ClassifyContent data={data as ClassifyOutput} />}
            {stepType === 'ROUTE' && <RouteContent data={data as RouteOutput} />}
            {stepType === 'DRAFT' && <DraftContent data={data as DraftOutput} />}
          </div>
        ) : isActive ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <p className="text-sm text-gray-400">Awaiting previous step completion</p>
        )}
      </CardContent>
    </Card>
  );
}
