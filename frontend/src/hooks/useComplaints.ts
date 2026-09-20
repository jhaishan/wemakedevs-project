import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComplaints, fetchComplaint, createComplaint, updateStatus } from '../lib/api';
import type { ComplaintStatus } from '../lib/types';

interface ComplaintFilters {
  studentId?: string;
  status?: ComplaintStatus;
  category?: string;
  urgency?: string;
}

export function useComplaints(filters?: ComplaintFilters) {
  return useQuery({
    queryKey: ['complaints', filters],
    queryFn: () => fetchComplaints(filters),
  });
}

export function useComplaint(id: string | undefined) {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => fetchComplaint(id!),
    enabled: !!id,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ComplaintStatus }) =>
      updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
    },
  });
}
