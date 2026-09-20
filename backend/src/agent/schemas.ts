import { z } from 'zod';
import { Category, Urgency, Role } from '@prisma/client';

export const ClassifyOutputSchema = z.object({
  category: z.nativeEnum(Category),
  urgency: z.nativeEnum(Urgency),
  reasoning: z.string(),
});

export const RouteOutputSchema = z.object({
  routedRole: z.nativeEnum(Role),
  assignedToId: z.string(),
  assignedToName: z.string(),
  reasoning: z.string(),
});

export const DraftOutputSchema = z.object({
  draftMessage: z.string(),
  reasoning: z.string(),
});

export type ClassifyOutput = z.infer<typeof ClassifyOutputSchema>;
export type RouteOutput = z.infer<typeof RouteOutputSchema>;
export type DraftOutput = z.infer<typeof DraftOutputSchema>;
