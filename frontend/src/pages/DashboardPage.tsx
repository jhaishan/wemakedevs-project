import { useState } from 'react';
import { useComplaints } from '../hooks/useComplaints';
import { ComplaintsTable } from '../components/complaints/ComplaintsTable';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import type { ComplaintStatus, Category, Urgency } from '../lib/types';

const statusFilters: { label: string; value: ComplaintStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
];

const categoryFilters: { label: string; value: Category | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Plumbing', value: 'PLUMBING' },
  { label: 'Electrical', value: 'ELECTRICAL' },
  { label: 'Internet', value: 'INTERNET' },
  { label: 'Structural', value: 'STRUCTURAL' },
  { label: 'Other', value: 'OTHER' },
];

const urgencyFilters: { label: string; value: Urgency | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Emergency', value: 'EMERGENCY' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
];

export function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'ALL'>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency | 'ALL'>('ALL');

  const filters: Record<string, string> = {};
  if (statusFilter !== 'ALL') filters.status = statusFilter;
  if (categoryFilter !== 'ALL') filters.category = categoryFilter;
  if (urgencyFilter !== 'ALL') filters.urgency = urgencyFilter;

  const { data: complaints, isLoading, isError } = useComplaints(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Complaint Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track all hostel maintenance complaints
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 space-y-3">
        {/* Status filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Status</span>
          {statusFilters.map((f) => (
            <Button
              key={f.value}
              variant={statusFilter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'text-xs',
                statusFilter === f.value ? '' : 'border-gray-200'
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Category</span>
          {categoryFilters.map((f) => (
            <Button
              key={f.value}
              variant={categoryFilter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(f.value)}
              className={cn(
                'text-xs',
                categoryFilter === f.value ? '' : 'border-gray-200'
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Urgency filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Urgency</span>
          {urgencyFilters.map((f) => (
            <Button
              key={f.value}
              variant={urgencyFilter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUrgencyFilter(f.value)}
              className={cn(
                'text-xs',
                urgencyFilter === f.value ? '' : 'border-gray-200'
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Complaint Count */}
      {complaints && (
        <div className="mb-4 text-sm text-gray-500">
          {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Content */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load complaints</p>
          <p className="text-gray-500 text-sm mt-1">Please try again later</p>
        </div>
      )}

      {!isLoading && !isError && complaints && (
        <ComplaintsTable complaints={complaints} />
      )}
    </div>
  );
}
