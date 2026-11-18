import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRouteHandler } from 'uploadthing/express';

import { connectDB } from './config/db.js';
import { seedMongoInitialData } from './services/bioService.js';
import { uploadRouter } from './services/uploadService.js';
import bioRoutes from './routes/bioRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use('/assets', express.static(path.join(ROOT_DIR, 'assets')));
app.use('/uploads', express.static(path.join(ROOT_DIR, 'public/uploads')));
app.use(express.static(path.join(ROOT_DIR, 'public')));

// UploadThing official route handler
try {
  app.use(
    '/api/uploadthing',
    createRouteHandler({
      router: uploadRouter,
      config: {
        token: process.env.UPLOADTHING_TOKEN,
      },
    })
  );
} catch (utErr) {
  console.warn('⚠️  UploadThing route handler warning:', utErr.message);
}

// REST API routes
app.use('/api', bioRoutes);
app.use('/api', uploadRoutes);

// User Profile Vanity URL: /u/:slug -> renders public/index.html
app.get('/u/:slug', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'index.html'));
});

// Admin dashboard route: /admin -> renders public/admin.html
app.get('/admin', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'admin.html'));
});

// Root route: / -> renders public/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ',
  });
});

// Start listening immediately for instant responsiveness
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
