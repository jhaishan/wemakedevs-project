import { callLLM } from '../llmClient';
import { buildRoutePrompt } from '../prompts';
import { RouteOutputSchema, RouteOutput } from '../schemas';
import { Complaint, Category, Urgency } from '@prisma/client';
import { routingService } from '../../services/routing.service';
import { z } from 'zod';

export async function routeStep(complaint: Complaint, category: Category, urgency: Urgency): Promise<RouteOutput> {
  const staff = await routingService.findStaffForCategory(category);

  if (!staff) {
    throw new Error('No assigned staff found, unable to route complaint.');
  }

  const messages = buildRoutePrompt(complaint.rawText, category, urgency, staff.name, staff.role);
  const responseText = await callLLM(messages, true);

  const parsed = JSON.parse(responseText);

  // Combine deterministic staff assignment and LLM reasoning
  return RouteOutputSchema.parse({
    routedRole: staff.role,
    assignedToId: staff.id,
    assignedToName: staff.name,
    reasoning: parsed.reasoning || '',
  });
}
