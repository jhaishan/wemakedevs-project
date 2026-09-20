import { prisma } from '../prisma/client';
import { CreateComplaintInput } from '../types';
import { ComplaintStatus, Urgency } from '@prisma/client';

export const complaintService = {
  async create(data: CreateComplaintInput) {
    return prisma.complaint.create({
      data: {
        rawText: data.rawText,
        roomNumber: data.roomNumber,
        imageUrl: data.imageUrl,
        studentId: data.studentId,
        status: ComplaintStatus.PENDING,
      },
    });
  },

  async findAll(filters: any) {
    const { status, urgency, category, assignedToId } = filters;
    const where: any = {};
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;
    if (category) where.category = category;
    if (assignedToId) where.assignedToId = assignedToId;

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        student: true,
        assignedTo: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const urgencyOrder: Record<Urgency, number> = {
      EMERGENCY: 1,
      HIGH: 2,
      MEDIUM: 3,
      LOW: 4
    };

    // Sort by urgency if any, then fallback to createdAt
    return complaints.sort((a: any, b: any) => {
      const aRank = a.urgency ? urgencyOrder[a.urgency as Urgency] : 99;
      const bRank = b.urgency ? urgencyOrder[b.urgency as Urgency] : 99;
      if (aRank !== bRank) return aRank - bRank;
      return 0; // already sorted by createdAt desc by prisma
    });
  },

  async findById(id: string) {
    return prisma.complaint.findUnique({
      where: { id },
      include: {
        student: true,
        assignedTo: true,
        steps: { orderBy: { createdAt: 'asc' } },
      }
    });
  },

  async updateStatus(id: string, status: ComplaintStatus) {
    return prisma.complaint.update({
      where: { id },
      data: { status },
    });
  },

  async update(id: string, data: any) {
    return prisma.complaint.update({
      where: { id },
      data,
    });
  }
};
