import { useParams } from 'react-router-dom';
import { useComplaint, useUpdateStatus } from '../hooks/useComplaints';
import { useComplaintStream } from '../hooks/useComplaintStream';
import { AgentStepCard } from '../components/complaints/AgentStepCard';
import { StatusActions } from '../components/complaints/StatusActions';
import { UrgencyBadge } from '../components/complaints/UrgencyBadge';
import { CategoryBadge } from '../components/complaints/CategoryBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';
import { formatDate } from '../lib/utils';
import { Cpu, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { ClassifyOutput, RouteOutput, DraftOutput, ComplaintStatus } from '../lib/types';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  CLASSIFIED: 'bg-blue-100 text-blue-700',
  ROUTED: 'bg-indigo-100 text-indigo-700',
  DRAFTED: 'bg-purple-100 text-purple-700',
  NOTIFIED: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-cyan-100 text-cyan-700',
  RESOLVED: 'bg-green-100 text-green-700',
};

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: complaint, isLoading, isError, refetch } = useComplaint(id);
  const updateStatus = useUpdateStatus();
  const [streamId, setStreamId] = useState<string | null>(null);
  const stream = useComplaintStream(streamId);

  const handleProcessWithAI = () => {
    if (id) setStreamId(id);
  };

  const handleStatusUpdate = async (status: ComplaintStatus) => {
    if (!id) return;
    await updateStatus.mutateAsync({ id, status });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
          <p className="text-red-600">Failed to load complaint</p>
          <p className="text-gray-500 text-sm mt-1">The complaint may not exist or the server is unavailable</p>
        </div>
      </div>
    );
  }

  // Build step data from existing complaint steps
  const classifyStep = complaint.steps?.find((s) => s.stepType === 'CLASSIFY');
  const routeStep = complaint.steps?.find((s) => s.stepType === 'ROUTE');
  const draftStep = complaint.steps?.find((s) => s.stepType === 'DRAFT');

  const classifyData: ClassifyOutput | null = stream.classify || (classifyStep
    ? (classifyStep.output as unknown as ClassifyOutput)
    : null);
  const routeData: RouteOutput | null = stream.route || (routeStep
    ? (routeStep.output as unknown as RouteOutput)
    : null);
  const draftData: DraftOutput | null = stream.draft || (draftStep
    ? (draftStep.output as unknown as DraftOutput)
    : null);

  const hasSteps = !!(classifyStep || routeStep || draftStep);
  const isStreamActive = stream.isStreaming;

  const getActiveStep = () => {
    if (!isStreamActive) return null;
    if (!classifyData) return 'CLASSIFY';
    if (!routeData) return 'ROUTE';
    if (!draftData) return 'DRAFT';
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Complaint Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">Complaint Details</CardTitle>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[complaint.status] || ''}`}>
              {complaint.status.replace('_', ' ')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900 mt-1">{complaint.rawText}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Room Number</label>
              <p className="text-gray-900 mt-1">{complaint.roomNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Student</label>
              <p className="text-gray-900 mt-1">{complaint.student?.name || '---'}</p>
            </div>
          </div>

          {complaint.imageUrl && (
            <div>
              <label className="text-sm font-medium text-gray-500">Attached Image</label>
              <img
                src={complaint.imageUrl}
                alt="Complaint attachment"
                className="mt-2 max-h-64 rounded-lg border border-gray-200 object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {complaint.category && <CategoryBadge category={complaint.category} />}
            {complaint.urgency && <UrgencyBadge urgency={complaint.urgency} />}
            {complaint.assignedTo && (
              <Badge variant="secondary">Assigned: {complaint.assignedTo.name}</Badge>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Created: {formatDate(complaint.createdAt)}</span>
            <span>Updated: {formatDate(complaint.updatedAt)}</span>
          </div>

          {/* Status Actions */}
          <StatusActions complaint={complaint} onStatusUpdate={handleStatusUpdate} />
        </CardContent>
      </Card>

      {/* Agent Processing Trace */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">AI Processing Trace</h2>

        {!hasSteps && !isStreamActive && complaint.status === 'PENDING' && (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Cpu className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">This complaint has not been processed yet</p>
              <Button onClick={handleProcessWithAI}>
                <Cpu className="mr-2 h-4 w-4" />
                Process with AI
              </Button>
            </CardContent>
          </Card>
        )}

        {(hasSteps || isStreamActive) && (
          <div className="space-y-4">
            <AgentStepCard
              stepType="CLASSIFY"
              data={classifyData}
              isActive={getActiveStep() === 'CLASSIFY'}
            />
            <AgentStepCard
              stepType="ROUTE"
              data={routeData}
              isActive={getActiveStep() === 'ROUTE'}
            />
            <AgentStepCard
              stepType="DRAFT"
              data={draftData}
              isActive={getActiveStep() === 'DRAFT'}
            />
          </div>
        )}

        {stream.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            {stream.error}
          </div>
        )}
      </div>
    </div>
  );
}
