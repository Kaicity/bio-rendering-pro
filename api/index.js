import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { seedMongoInitialData } from '../src/services/bioService.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    await seedMongoInitialData();
  } catch (err) {
    console.warn('⚠️  MongoDB serverless connection note:', err.message);
  }

  return app(req, res);
}
