import { Button } from '../ui/button';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import type { Complaint, ComplaintStatus } from '../../lib/types';
import { useState } from 'react';

interface StatusActionsProps {
  complaint: Complaint;
  onStatusUpdate: (status: ComplaintStatus) => void;
}

export function StatusActions({ complaint, onStatusUpdate }: StatusActionsProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  if (!user || (user.role !== 'WARDEN' && user.role !== 'STAFF')) return null;

  const handleUpdate = async (status: ComplaintStatus) => {
    setLoading(true);
    try {
      onStatusUpdate(status);
    } finally {
      setLoading(false);
    }
  };

  if (complaint.status === 'RESOLVED') {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Resolved</span>
      </div>
    );
  }

  if (complaint.status === 'DRAFTED' || complaint.status === 'NOTIFIED') {
    return (
      <Button onClick={() => handleUpdate('IN_PROGRESS')} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
        Mark In Progress
      </Button>
    );
  }

  if (complaint.status === 'IN_PROGRESS') {
    return (
      <Button onClick={() => handleUpdate('RESOLVED')} disabled={loading} className="bg-green-600 hover:bg-green-700">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
        Mark Resolved
      </Button>
    );
  }

  return null;
}
