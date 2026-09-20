import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { UrgencyBadge } from './UrgencyBadge';
import { CategoryBadge } from './CategoryBadge';
import { formatDate } from '../../lib/utils';
import type { Complaint } from '../../lib/types';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  CLASSIFIED: 'bg-blue-100 text-blue-700',
  ROUTED: 'bg-indigo-100 text-indigo-700',
  DRAFTED: 'bg-purple-100 text-purple-700',
  NOTIFIED: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-cyan-100 text-cyan-700',
  RESOLVED: 'bg-green-100 text-green-700',
};

interface ComplaintsTableProps {
  complaints: Complaint[];
}

export function ComplaintsTable({ complaints }: ComplaintsTableProps) {
  const navigate = useNavigate();

  if (complaints.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No complaints found</p>
        <p className="text-gray-400 text-sm mt-1">Complaints will appear here once submitted</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 font-medium text-gray-500">Room</th>
              <th className="pb-3 font-medium text-gray-500">Description</th>
              <th className="pb-3 font-medium text-gray-500">Category</th>
              <th className="pb-3 font-medium text-gray-500">Urgency</th>
              <th className="pb-3 font-medium text-gray-500">Status</th>
              <th className="pb-3 font-medium text-gray-500">Assigned To</th>
              <th className="pb-3 font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr
                key={complaint.id}
                onClick={() => navigate(`/complaints/${complaint.id}`)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="py-3 font-medium">{complaint.roomNumber}</td>
                <td className="py-3 max-w-xs truncate text-gray-600">{complaint.rawText}</td>
                <td className="py-3">
                  {complaint.category ? <CategoryBadge category={complaint.category} /> : <span className="text-gray-400">--</span>}
                </td>
                <td className="py-3">
                  {complaint.urgency ? <UrgencyBadge urgency={complaint.urgency} /> : <span className="text-gray-400">--</span>}
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[complaint.status] || ''}`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 text-gray-600">{complaint.assignedTo?.name || '--'}</td>
                <td className="py-3 text-gray-500">{formatDate(complaint.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {complaints.map((complaint) => (
          <Card
            key={complaint.id}
            onClick={() => navigate(`/complaints/${complaint.id}`)}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-gray-900">Room {complaint.roomNumber}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[complaint.status] || ''}`}>
                  {complaint.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{complaint.rawText}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {complaint.category && <CategoryBadge category={complaint.category} />}
                {complaint.urgency && <UrgencyBadge urgency={complaint.urgency} />}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>{complaint.assignedTo?.name || 'Unassigned'}</span>
                <span>{formatDate(complaint.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
