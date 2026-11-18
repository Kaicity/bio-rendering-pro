import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UTApi, UTFile } from 'uploadthing/server';
import { createUploadthing } from 'uploadthing/express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../public/uploads');

// Ensure local uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Check UploadThing configuration status
 */
export function getUploadThingStatus() {
  const token = process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET;
  return {
    configured: Boolean(token && token.trim().length > 0),
    hasToken: Boolean(token),
  };
}

/**
 * Upload Avatar using UploadThing or fallback to local disk
 * @param {Express.Multer.File} file - Multer uploaded file object
 * @returns {Promise<{ success: boolean, url: string, provider: 'uploadthing' | 'local', message?: string }>}
 */
export async function uploadAvatarFile(file) {
  if (!file) {
    throw new Error('Không có file ảnh nào được gửi lên.');
  }

  const token = process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET;

  // 1. If UploadThing token is present, upload to UploadThing Cloud
  if (token && token.trim().length > 0) {
    try {
      console.log(`🚀 Đang upload file "${file.originalname}" lên UploadThing CDN...`);
      const utapi = new UTApi({ token: token.trim() });
      
      const utFile = new UTFile([file.buffer], file.originalname, {
        type: file.mimetype || 'image/jpeg',
      });

      const [response] = await utapi.uploadFiles([utFile]);

      if (response && response.data) {
        const fileUrl = response.data.ufsUrl || response.data.url;
        console.log(`✅ Upload lên UploadThing thành công: ${fileUrl}`);
        return {
          success: true,
          url: fileUrl,
          key: response.data.key,
          name: response.data.name,
          provider: 'uploadthing',
          message: 'Tải ảnh đại diện lên UploadThing thành công!',
        };
      } else if (response && response.error) {
        throw new Error(response.error.message || 'Lỗi từ UploadThing server');
      }
    } catch (uploadThingError) {
      console.error('⚠️  Lỗi khi upload lên UploadThing:', uploadThingError.message);
      console.warn('👉 Tự động chuyển sang lưu trữ cục bộ tạm thời...');
      // Fall through to local fallback
    }
  }

  // 2. Fallback: Save file to public/uploads
  const ext = path.extname(file.originalname) || '.jpg';
  const uniqueName = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const targetPath = path.join(UPLOADS_DIR, uniqueName);

  await fs.promises.writeFile(targetPath, file.buffer);
  const localUrl = `/uploads/${uniqueName}`;

  console.log(`📁 Đã lưu ảnh vào thư mục cục bộ: ${localUrl}`);
  return {
    success: true,
    url: localUrl,
    provider: 'local',
    message: token
      ? 'UploadThing gặp sự cố kết nối, ảnh đã được lưu cục bộ an toàn.'
      : 'Ảnh đã được lưu cục bộ. Thêm UPLOADTHING_TOKEN vào .env để lưu trên cloud https://uploadthing.com/',
  };
}

/**
 * Standard UploadThing router for Express route handler
 */
const f = createUploadthing();

export const uploadRouter = {
  avatarUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      return { uploadedBy: 'admin' };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('UploadThing route callback completed:', file.url);
      return { uploadedBy: metadata.uploadedBy, url: file.url };
    }),
};
