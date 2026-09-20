import { Request, Response, NextFunction } from 'express';
import { complaintService } from '../services/complaint.service';
import { processComplaint } from '../agent/orchestrator';

export const complaintsController = {
  async createComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      const { rawText, roomNumber, imageUrl, studentId } = req.body;
      if (!rawText || !roomNumber || !studentId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const complaint = await complaintService.create({ rawText, roomNumber, imageUrl, studentId });
      res.status(201).json(complaint);
    } catch (err) {
      next(err);
    }
  },

  async getComplaints(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, urgency, category, assignedToId } = req.query;
      const complaints = await complaintService.findAll({ status, urgency, category, assignedToId });
      res.json(complaints);
    } catch (err) {
      next(err);
    }
  },

  async getComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      const complaint = await complaintService.findById(req.params.id as string as string);
      if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
      res.json(complaint);
    } catch (err) {
      next(err);
    }
  },

  async streamComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      await processComplaint(req.params.id as string as string, res);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Missing status' });
      }
      const complaint = await complaintService.updateStatus(req.params.id as string as string, status);
      res.json(complaint);
    } catch (err) {
      next(err);
    }
  }
};
