import express from 'express';
import {
  getAllBios,
  getBioBySlugOrId,
  getDefaultBio,
  createBio,
  updateBio,
  deleteBio,
} from '../services/bioService.js';
import { getMongoStatus } from '../config/db.js';
import { getUploadThingStatus } from '../services/uploadService.js';

const router = express.Router();

/**
 * System status (MongoDB & UploadThing)
 */
router.get('/system/status', (req, res) => {
  const mongo = getMongoStatus();
  const uploadthing = getUploadThingStatus();
  res.json({
    mongo,
    uploadthing,
  });
});

/**
 * Get all bios
 */
router.get('/bios', async (req, res) => {
  try {
    const bios = await getAllBios();
    res.json({ success: true, data: bios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get default bio
 */
router.get('/bios/default', async (req, res) => {
  try {
    const bio = await getDefaultBio();
    if (!bio) {
      return res.status(404).json({ success: false, message: 'Chưa có thông tin Bio nào.' });
    }
    res.json({ success: true, data: bio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get bio by slug or ID
 */
router.get('/bios/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const bio = await getBioBySlugOrId(slugOrId);
    if (!bio) {
      return res.status(404).json({ success: false, message: `Không tìm thấy Bio với mã: ${slugOrId}` });
    }
    res.json({ success: true, data: bio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Create new bio
 */
router.post('/bios', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Họ và tên là bắt buộc.' });
    }

    const created = await createBio(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo hồ sơ Bio mới thành công!',
      data: created,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * Update bio
 */
router.put('/bios/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const updated = await updateBio(slugOrId, req.body);
    res.json({
      success: true,
      message: 'Cập nhật thông tin Bio thành công!',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * Delete bio
 */
router.delete('/bios/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const result = await deleteBio(slugOrId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
