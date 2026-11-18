import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedMongoInitialData } from './services/bioService.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Start listening immediately for local development
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Bio Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`👤 Trang Bio người dùng:  http://localhost:${PORT}/`);
  console.log(`🛠️  Trang Admin quản trị: http://localhost:${PORT}/admin`);
  console.log(`======================================================\n`);
});

// Connect to MongoDB asynchronously in the background
(async () => {
  try {
    await connectDB();
    await seedMongoInitialData();
  } catch (err) {
    console.warn('⚠️  MongoDB background connection note:', err.message);
  }
})();

export { app, server };
