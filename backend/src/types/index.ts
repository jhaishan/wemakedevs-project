import { Role, Category, Urgency, ComplaintStatus, StepType } from '@prisma/client';

export { Role, Category, Urgency, ComplaintStatus, StepType };

export interface CreateComplaintInput {
  rawText: string;
  roomNumber: string;
  imageUrl?: string;
  studentId: string;
}

export interface UpdateStatusInput {
  status: 'IN_PROGRESS' | 'RESOLVED';
}

export interface PresignInput {
  fileType: string;
}
