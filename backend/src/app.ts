import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import complaintsRoutes from './routes/complaints.routes';
import usersRoutes from './routes/users.routes';
import uploadsRoutes from './routes/uploads.routes';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/complaints', complaintsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/uploads', uploadsRoutes);

app.use(errorHandler);

export default app;
