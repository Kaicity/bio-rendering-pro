import express from 'express';
import multer from 'multer';
import { uploadAvatarFile } from '../services/uploadService.js';

const router = express.Router();

// Configure multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file định dạng hình ảnh (PNG, JPG, JPEG, WEBP, GIF).'), false);
    }
  },
});

/**
 * Direct Avatar upload endpoint
 * Uploads to UploadThing CDN or fallback to local disk
 */
router.post('/upload/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn một file ảnh để tải lên.' });
    }

    const result = await uploadAvatarFile(req.file);
    res.json(result);
  } catch (error) {
    console.error('Lỗi upload avatar:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Xảy ra lỗi trong quá trình tải ảnh lên.',
    });
  }
});

export default router;
