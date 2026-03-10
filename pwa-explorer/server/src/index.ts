import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { pushRouter } from './push.controller';
import { ensureVapidKeys } from './vapid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());

ensureVapidKeys();

app.use('/', pushRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`PWA Explorer push server running on http://localhost:${PORT}`);
});
