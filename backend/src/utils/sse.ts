import { Response } from 'express';

export function initSSE(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
}

export function sendEvent(res: Response, event: string, data: any) {
  const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
  res.write(`event: ${event}\ndata: ${dataString}\n\n`);
}
