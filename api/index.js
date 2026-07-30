// This file acts as a bridge for Vercel's Serverless Functions.
// Vercel expects serverless functions in the /api directory.
// We import your actual backend app here so you can keep your 'backend' folder name!
import app from '../backend/index.js';

export default app;
