import { callLLM } from '../llmClient';
import { buildClassifyPrompt } from '../prompts';
import { ClassifyOutputSchema, ClassifyOutput } from '../schemas';
import { Complaint } from '@prisma/client';

export async function classifyStep(complaint: Complaint): Promise<ClassifyOutput> {
  const messages = buildClassifyPrompt(complaint.rawText, complaint.roomNumber, complaint.imageUrl || undefined);
  const responseText = await callLLM(messages, true);

  const parsed = JSON.parse(responseText);
  return ClassifyOutputSchema.parse(parsed);
}
