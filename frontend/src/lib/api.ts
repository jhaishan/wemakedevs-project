import type { Role, Complaint, User, ComplaintStatus } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export async function fetchUsers(role?: Role): Promise<User[]> {
  const params = role ? `?role=${role}` : '';
  return request<User[]>(`/users${params}`);
}

export interface ComplaintFilters {
  studentId?: string;
  status?: ComplaintStatus;
  category?: string;
  urgency?: string;
}

export async function fetchComplaints(filters?: ComplaintFilters): Promise<Complaint[]> {
  const params = new URLSearchParams();
  if (filters?.studentId) params.set('studentId', filters.studentId);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.urgency) params.set('urgency', filters.urgency);
  const qs = params.toString();
  return request<Complaint[]>(`/complaints${qs ? `?${qs}` : ''}`);
}

export async function fetchComplaint(id: string): Promise<Complaint> {
  return request<Complaint>(`/complaints/${id}`);
}

export async function createComplaint(data: {
  rawText: string;
  roomNumber: string;
  studentId: string;
  imageUrl?: string;
}): Promise<Complaint> {
  return request<Complaint>('/complaints', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateStatus(id: string, status: ComplaintStatus): Promise<Complaint> {
  return request<Complaint>(`/complaints/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function getPresignedUrl(fileType: string): Promise<{ uploadUrl: string; publicUrl: string }> {
  return request<{ uploadUrl: string; publicUrl: string }>('/uploads/presign', {
    method: 'POST',
    body: JSON.stringify({ fileType }),
  });
}

export async function uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error('Failed to upload file to S3');
  }
}
