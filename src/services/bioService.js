import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Bio } from '../models/Bio.js';
import { isMongoConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'bios.json');

// Initial default seed matching current index.html
const DEFAULT_SEED = [
  {
    id: 'seed-ngoc-phu',
    slug: 'ngoc-phu',
    name: 'Nguyễn Thị Ngọc Phú',
    role: 'Phòng Kế Hoạch Đấu Thầu',
    company: 'Trung Nam EC',
    avatarUrl: '/assets/images/avatar.jpg',
    coverTheme: 'ocean',
    phone: '0967 827 848',
    email: 'phuntn@trungnamgroup.com.vn',
    department: 'P. KHĐT',
    enableCallAction: true,
    callActionLabel: 'Gọi điện',
    enableEmailAction: true,
    emailActionLabel: 'Gửi email',
    customLinks: [
      {
        label: 'Số điện thoại',
        value: '0967 827 848',
        href: 'tel:0967827848',
        icon: 'phone',
      },
      {
        label: 'Email',
        value: 'phuntn@trungnamgroup.com.vn',
        href: 'mailto:phuntn@trungnamgroup.com.vn',
        icon: 'email',
      },
      {
        label: 'Phòng ban',
        value: 'P. KHĐT',
        href: '',
        icon: 'building',
      },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Ensure fallback data directory and file exist
function initFallbackStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED, null, 2), 'utf8');
  }
}

initFallbackStorage();

function readFallbackData() {
  try {
    initFallbackStorage();
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Lỗi khi đọc file bios.json:', error);
    return [...DEFAULT_SEED];
  }
}

function writeFallbackData(data) {
  try {
    initFallbackStorage();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Lỗi khi ghi file bios.json:', error);
  }
}

/**
 * Seed initial bio to MongoDB if collection is empty
 */
export async function seedMongoInitialData() {
  if (!isMongoConnected()) return;
  try {
    const count = await Bio.countDocuments();
    if (count === 0) {
      console.log('🌱 Đang khởi tạo dữ liệu Bio ban đầu vào MongoDB...');
      const fallbackList = readFallbackData();
      for (const item of fallbackList) {
        const { id, _id, ...rest } = item;
        await Bio.create(rest);
      }
      console.log('✅ Khởi tạo dữ liệu MongoDB thành công!');
    }
  } catch (err) {
    console.warn('⚠️  Lỗi khi seed dữ liệu MongoDB:', err.message);
  }
}

/**
 * Get all bios
 */
export async function getAllBios() {
  if (isMongoConnected()) {
    try {
      const bios = await Bio.find().sort({ isDefault: -1, updatedAt: -1 });
      return bios.map((b) => b.toPublicJSON());
    } catch (e) {
      console.warn('⚠️  Lỗi truy vấn MongoDB, sử dụng file dự phòng:', e.message);
    }
  }
  return readFallbackData();
}

/**
 * Get bio by slug or ID
 */
export async function getBioBySlugOrId(identifier) {
  if (!identifier) return null;

  if (isMongoConnected()) {
    try {
      let bio = await Bio.findOne({ slug: identifier.toLowerCase() });
      if (!bio && identifier.match(/^[0-9a-fA-F]{24}$/)) {
        bio = await Bio.findById(identifier);
      }
      if (bio) return bio.toPublicJSON();
    } catch (e) {
      console.warn('⚠️  Lỗi tìm kiếm MongoDB:', e.message);
    }
  }

  const list = readFallbackData();
  return list.find(
    (b) => b.slug?.toLowerCase() === identifier.toLowerCase() || b.id === identifier || b._id === identifier
  ) || null;
}

/**
 * Get default bio (for root / page)
 */
export async function getDefaultBio() {
  if (isMongoConnected()) {
    try {
      let bio = await Bio.findOne({ isDefault: true });
      if (!bio) {
        bio = await Bio.findOne().sort({ updatedAt: -1 });
      }
      if (bio) return bio.toPublicJSON();
    } catch (e) {
      console.warn('⚠️  Lỗi truy vấn default bio MongoDB:', e.message);
    }
  }

  const list = readFallbackData();
  const def = list.find((b) => b.isDefault);
  return def || list[0] || DEFAULT_SEED[0];
}

/**
 * Create new bio
 */
export async function createBio(data) {
  // Normalize slug
  let slug = (data.slug || data.name || 'user')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) slug = `bio-${Date.now()}`;

  // Check unique slug
  let existing = await getBioBySlugOrId(slug);
  if (existing) {
    slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  data.slug = slug;

  if (data.isDefault) {
    await unsetOtherDefaults();
  }

  if (isMongoConnected()) {
    try {
      const newBio = await Bio.create(data);
      const publicObj = newBio.toPublicJSON();

      // Sync backup
      const list = readFallbackData();
      list.unshift(publicObj);
      writeFallbackData(list);

      return publicObj;
    } catch (e) {
      console.warn('⚠️  Lỗi tạo bio MongoDB:', e.message);
    }
  }

  // Fallback
  const list = readFallbackData();
  const newBio = {
    ...data,
    id: `bio-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  list.unshift(newBio);
  writeFallbackData(list);
  return newBio;
}

/**
 * Update bio
 */
export async function updateBio(idOrSlug, updateData) {
  if (updateData.isDefault) {
    await unsetOtherDefaults(idOrSlug);
  }

  updateData.updatedAt = new Date().toISOString();

  if (isMongoConnected()) {
    try {
      let updated = null;
      if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        updated = await Bio.findByIdAndUpdate(idOrSlug, updateData, { new: true });
      } else {
        updated = await Bio.findOneAndUpdate({ slug: idOrSlug }, updateData, { new: true });
      }
      if (updated) {
        const publicObj = updated.toPublicJSON();
        // Update local backup
        const list = readFallbackData();
        const idx = list.findIndex((b) => b.slug === idOrSlug || b.id === idOrSlug || b._id === idOrSlug);
        if (idx !== -1) list[idx] = { ...list[idx], ...publicObj };
        writeFallbackData(list);
        return publicObj;
      }
    } catch (e) {
      console.warn('⚠️  Lỗi cập nhật bio MongoDB:', e.message);
    }
  }

  // Fallback update
  const list = readFallbackData();
  const idx = list.findIndex(
    (b) => b.id === idOrSlug || b.slug === idOrSlug || b._id === idOrSlug
  );

  if (idx === -1) {
    throw new Error('Không tìm thấy thông tin Bio để cập nhật.');
  }

  list[idx] = {
    ...list[idx],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  writeFallbackData(list);
  return list[idx];
}

/**
 * Delete bio
 */
export async function deleteBio(idOrSlug) {
  if (isMongoConnected()) {
    try {
      if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        await Bio.findByIdAndDelete(idOrSlug);
      } else {
        await Bio.findOneAndDelete({ slug: idOrSlug });
      }
    } catch (e) {
      console.warn('⚠️  Lỗi xóa bio MongoDB:', e.message);
    }
  }

  const list = readFallbackData();
  const filtered = list.filter(
    (b) => b.id !== idOrSlug && b.slug !== idOrSlug && b._id !== idOrSlug
  );
  writeFallbackData(filtered);
  return { success: true, message: 'Đã xóa hồ sơ Bio thành công.' };
}

/**
 * Unset other defaults when a profile is made default
 */
async function unsetOtherDefaults(excludeIdOrSlug = null) {
  if (isMongoConnected()) {
    try {
      const filter = { isDefault: true };
      if (excludeIdOrSlug) {
        if (excludeIdOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
          filter._id = { $ne: excludeIdOrSlug };
        } else {
          filter.slug = { $ne: excludeIdOrSlug };
        }
      }
      await Bio.updateMany(filter, { isDefault: false });
    } catch (e) {
      console.warn('⚠️  Lỗi unset default MongoDB:', e.message);
    }
  }

  const list = readFallbackData();
  const updated = list.map((b) => {
    if (b.id !== excludeIdOrSlug && b.slug !== excludeIdOrSlug && b._id !== excludeIdOrSlug) {
      return { ...b, isDefault: false };
    }
    return b;
  });
  writeFallbackData(updated);
}
