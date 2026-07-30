import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import applicationRoutes from './routes/applicationRoutes.js';
import coldEmailRoutes from './routes/coldEmailRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply Auth Middleware to all API routes
app.use('/api', authMiddleware);

app.use('/api/applications', applicationRoutes);
app.use('/api/cold-emails', coldEmailRoutes);
app.use('/api/analytics', analyticsRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`\n✅ AI Job Tracker CRM Backend running on http://localhost:${PORT}`);
    console.log(`   Database: PostgreSQL (${process.env.DATABASE_URL?.slice(0, 15)}...)`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use. Please kill the existing process.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

// Export for Vercel Serverless
export default app;
