import { Router } from 'express';
import { complaintsController } from '../controllers/complaints.controller';

const router = Router();

router.post('/', complaintsController.createComplaint);
router.get('/', complaintsController.getComplaints);
router.get('/:id', complaintsController.getComplaint);
router.get('/:id/stream', complaintsController.streamComplaint);
router.patch('/:id/status', complaintsController.updateStatus);

export default router;
