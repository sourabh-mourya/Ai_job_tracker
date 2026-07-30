// This file acts as a bridge for Vercel's Serverless Functions.
// It bundles the entire Express app into a single Serverless Function,
// avoiding Vercel's 12-function limit on the Hobby Plan.
import app from '../backend/index.js';

export default app;
