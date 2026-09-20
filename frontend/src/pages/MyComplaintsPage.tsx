import { useUser } from '../context/UserContext';
import { useComplaints } from '../hooks/useComplaints';
import { ComplaintsTable } from '../components/complaints/ComplaintsTable';
import { Skeleton } from '../components/ui/skeleton';
import { ClipboardList } from 'lucide-react';

export function MyComplaintsPage() {
  const { user } = useUser();
  const { data: complaints, isLoading, isError } = useComplaints(
    user ? { studentId: user.id } : undefined
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
        <p className="text-sm text-gray-500 mt-1">Track the status of your submitted complaints</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
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

      {!isLoading && !isError && complaints && complaints.length === 0 && (
        <div className="text-center py-16">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No complaints submitted yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Go to the Report page to submit your first complaint
          </p>
        </div>
      )}

      {!isLoading && !isError && complaints && complaints.length > 0 && (
        <ComplaintsTable complaints={complaints} />
      )}
    </div>
  );
}
