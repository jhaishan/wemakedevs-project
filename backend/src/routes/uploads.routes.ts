import { Router } from 'express';
import { uploadsController } from '../controllers/uploads.controller';

const router = Router();

router.post('/presign', uploadsController.createPresignedUrl);

export default router;
