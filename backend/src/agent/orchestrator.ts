import { Response } from 'express';
import { complaintService } from '../services/complaint.service';
import { initSSE, sendEvent } from '../utils/sse';
import { classifyStep } from './steps/classify';
import { routeStep } from './steps/route';
import { draftStep } from './steps/draft';
import { prisma } from '../prisma/client';
import { ComplaintStatus, StepType } from '@prisma/client';

export async function processComplaint(id: string, res: Response) {
  let complaint: any = await complaintService.findById(id);

  if (!complaint) {
    res.status(404).json({ error: 'Complaint not found' });
    return;
  }

  // If status is >= CLASSIFIED, it may already be processed, but to keep simpler we just rerun or skip.
  // Assuming it's PENDING
  initSSE(res);

  try {
    // 1. CLASSIFY
    const classifyStart = Date.now();
    const classifyOutput = await classifyStep(complaint);
    const classifyDuration = Date.now() - classifyStart;

    complaint = await complaintService.update(id, {
      category: classifyOutput.category,
      urgency: classifyOutput.urgency,
      status: ComplaintStatus.CLASSIFIED,
    });

    await prisma.agentStep.create({
      data: {
        complaintId: id,
        stepType: StepType.CLASSIFY,
        input: { rawText: complaint.rawText, roomNumber: complaint.roomNumber },
        output: classifyOutput as any,
        reasoning: classifyOutput.reasoning,
        durationMs: classifyDuration,
      }
    });

    sendEvent(res, 'classify', classifyOutput);

    // 2. ROUTE
    const routeStart = Date.now();
    const routeOutput = await routeStep(complaint, classifyOutput.category, classifyOutput.urgency);
    const routeDuration = Date.now() - routeStart;

    complaint = await complaintService.update(id, {
      routedRole: routeOutput.routedRole,
      assignedToId: routeOutput.assignedToId,
      status: ComplaintStatus.ROUTED,
    });

    await prisma.agentStep.create({
      data: {
        complaintId: id,
        stepType: StepType.ROUTE,
        input: { category: classifyOutput.category, urgency: classifyOutput.urgency },
        output: routeOutput as any,
        reasoning: routeOutput.reasoning,
        durationMs: routeDuration,
      }
    });

    sendEvent(res, 'route', routeOutput);

    // 3. DRAFT
    const student = await prisma.user.findUnique({ where: { id: complaint.studentId }});
    const draftStart = Date.now();
    const draftOutput = await draftStep(complaint, classifyOutput.category, classifyOutput.urgency, routeOutput.assignedToName, student?.name || 'Student');
    const draftDuration = Date.now() - draftStart;

    complaint = await complaintService.update(id, {
      draftMessage: draftOutput.draftMessage,
      status: ComplaintStatus.DRAFTED,
    });

    await prisma.agentStep.create({
      data: {
        complaintId: id,
        stepType: StepType.DRAFT,
        input: { assignedToName: routeOutput.assignedToName },
        output: draftOutput as any,
        reasoning: draftOutput.reasoning,
        durationMs: draftDuration,
      }
    });

    sendEvent(res, 'draft', draftOutput);

    // Done
    sendEvent(res, 'done', { complaintId: id, finalStatus: ComplaintStatus.DRAFTED });
  } catch (err: any) {
    console.error('Agent processing error:', err);
    sendEvent(res, 'error', { message: err.message });
  } finally {
    res.end();
  }
}
