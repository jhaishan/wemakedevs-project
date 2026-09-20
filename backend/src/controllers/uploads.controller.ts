import { Request, Response, NextFunction } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3, S3_BUCKET_NAME } from '../config/s3';
import { env } from '../config/env';

export const uploadsController = {
  async createPresignedUrl(req: Request, res: Response, next: NextFunction) {
    try {
      if (!s3) {
        return res.status(503).json({ error: 'S3 is not configured' });
      }

      const { fileType } = req.body;
      if (!fileType) {
        return res.status(400).json({ error: 'Missing fileType' });
      }

      const key = `complaints/${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      const publicUrl = `https://${S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

      res.json({ uploadUrl, publicUrl });
    } catch (err) {
      next(err);
    }
  }
};
