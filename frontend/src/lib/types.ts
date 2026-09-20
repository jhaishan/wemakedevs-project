export type Role = 'STUDENT' | 'WARDEN' | 'STAFF' | 'ADMIN';
export type Category = 'PLUMBING' | 'ELECTRICAL' | 'INTERNET' | 'STRUCTURAL' | 'OTHER';
export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
export type ComplaintStatus = 'PENDING' | 'CLASSIFIED' | 'ROUTED' | 'DRAFTED' | 'NOTIFIED' | 'IN_PROGRESS' | 'RESOLVED';
export type StepType = 'CLASSIFY' | 'ROUTE' | 'DRAFT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  roomNumber?: string;
  staffCategory?: Category;
  createdAt: string;
}

export interface AgentStep {
  id: string;
  complaintId: string;
  stepType: StepType;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  reasoning?: string;
  durationMs?: number;
  createdAt: string;
}

export interface Complaint {
  id: string;
  rawText: string;
  roomNumber: string;
  imageUrl?: string;
  studentId: string;
  student?: User;
  category?: Category;
  urgency?: Urgency;
  routedRole?: Role;
  assignedToId?: string;
  assignedTo?: User;
  draftMessage?: string;
  status: ComplaintStatus;
  steps?: AgentStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ClassifyOutput {
  category: Category;
  urgency: Urgency;
  reasoning: string;
}

export interface RouteOutput {
  routedRole: Role;
  assignedToId: string;
  assignedToName: string;
  reasoning: string;
}

export interface DraftOutput {
  draftMessage: string;
  reasoning: string;
}
