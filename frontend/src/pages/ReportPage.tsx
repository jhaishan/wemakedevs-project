import { useState, useCallback } from 'react';
import { ComplaintForm } from '../components/complaints/ComplaintForm';
import { AgentStepCard } from '../components/complaints/AgentStepCard';
import { useCreateComplaint } from '../hooks/useComplaints';
import { useComplaintStream } from '../hooks/useComplaintStream';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Send, CheckCircle, RotateCcw, AlertCircle } from 'lucide-react';

export function ReportPage() {
  const [complaintId, setComplaintId] = useState<string | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const createComplaint = useCreateComplaint();
  const stream = useComplaintStream(complaintId);

  const handleSubmit = useCallback(
    async (data: { rawText: string; roomNumber: string; studentId: string; imageUrl?: string }) => {
      try {
        const complaint = await createComplaint.mutateAsync(data);
        setComplaintId(complaint.id);
        setNotificationSent(false);
      } catch (err) {
        console.error('Failed to create complaint:', err);
      }
    },
    [createComplaint]
  );

  const handleSendNotification = () => {
    console.log('Sending notification for complaint:', complaintId);
    setNotificationSent(true);
  };

  const handleNewComplaint = () => {
    setComplaintId(null);
    setNotificationSent(false);
    stream.reset();
  };

  const getActiveStep = () => {
    if (!stream.isStreaming) return null;
    if (!stream.classify) return 'CLASSIFY';
    if (!stream.route) return 'ROUTE';
    if (!stream.draft) return 'DRAFT';
    return null;
  };

  const activeStep = getActiveStep();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <ComplaintForm
            onSubmit={handleSubmit}
            isSubmitting={createComplaint.isPending}
            disabled={!!complaintId && !stream.done}
          />

          {createComplaint.isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4" />
              Failed to submit complaint. Please try again.
            </div>
          )}
        </div>

        {/* Right: Agent Trace */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">AI Processing</h2>

          {!complaintId && (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-400">Submit a complaint to see AI processing</p>
            </div>
          )}

          {complaintId && (
            <div className="space-y-4">
              <AgentStepCard
                stepType="CLASSIFY"
                data={stream.classify}
                isActive={activeStep === 'CLASSIFY'}
              />
              <AgentStepCard
                stepType="ROUTE"
                data={stream.route}
                isActive={activeStep === 'ROUTE'}
              />
              <AgentStepCard
                stepType="DRAFT"
                data={stream.draft}
                isActive={activeStep === 'DRAFT'}
              />

              {stream.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {stream.error}
                </div>
              )}

              {stream.done && stream.draft && (
                <Card className="border-indigo-200 bg-indigo-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Send className="h-5 w-5 text-indigo-600" />
                      Draft Notification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white rounded-md p-4 border border-indigo-100 mb-4">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {stream.draft.draftMessage}
                      </p>
                    </div>

                    {!notificationSent ? (
                      <Button onClick={handleSendNotification} className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Send Notification
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-green-600 py-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Notification sent successfully!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {(stream.done || stream.error) && (
                <Button variant="outline" onClick={handleNewComplaint} className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Submit Another Complaint
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
