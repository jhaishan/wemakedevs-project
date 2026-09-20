import { callLLM } from '../llmClient';
import { buildDraftPrompt } from '../prompts';
import { DraftOutputSchema, DraftOutput } from '../schemas';
import { Complaint, Category, Urgency } from '@prisma/client';

export async function draftStep(
  complaint: Complaint,
  category: Category,
  urgency: Urgency,
  assignedStaffName: string,
  studentName: string
): Promise<DraftOutput> {
  const messages = buildDraftPrompt(complaint.rawText, category, urgency, assignedStaffName, complaint.roomNumber, studentName);
  const responseText = await callLLM(messages, true);

  const parsed = JSON.parse(responseText);
  return DraftOutputSchema.parse(parsed);
}
