import { renderBioCard, ICONS } from '/js/bio.js';

// State
let allBios = [];
let currentBio = null;
let isNewProfile = false;

// DOM Elements
const profileSelect = document.getElementById('profile-select');
const btnNewProfile = document.getElementById('btn-new-profile');
const btnSetDefault = document.getElementById('btn-set-default');
const btnDeleteProfile = document.getElementById('btn-delete-profile');
const btnSave = document.getElementById('btn-save');
const previewWrap = document.getElementById('preview-card-wrap');
const btnViewLive = document.getElementById('btn-view-live');

// Inputs
const inputName = document.getElementById('input-name');
const inputRole = document.getElementById('input-role');
const inputCompany = document.getElementById('input-company');
const inputSlug = document.getElementById('input-slug');
const inputPhone = document.getElementById('input-phone');
const inputEmail = document.getElementById('input-email');
const inputDepartment = document.getElementById('input-department');
const inputAvatarUrl = document.getElementById('input-avatar-url');
const avatarFileInput = document.getElementById('avatar-file-input');
const avatarPreviewImg = document.getElementById('avatar-preview-img');
const uploadStatusText = document.getElementById('upload-status-text');

const checkCall = document.getElementById('check-call');
const inputCallLabel = document.getElementById('input-call-label');
const checkEmail = document.getElementById('check-email');
const inputEmailLabel = document.getElementById('input-email-label');

const customLinksContainer = document.getElementById('custom-links-container');
const btnAddCustomLink = document.getElementById('btn-add-custom-link');

const mongoBadge = document.getElementById('mongo-status-badge');
const uploadthingBadge = document.getElementById('uploadthing-status-badge');
const publicLinkAnchor = document.getElementById('public-link-anchor');

/**
 * Toast Notification Helper
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Fetch and update System Status badges
 */
async function loadSystemStatus() {
  try {
    const res = await fetch('/api/system/status');
    const data = await res.json();

    // MongoDB status
    if (data.mongo?.connected) {
      mongoBadge.className = 'status-badge online';
      mongoBadge.innerHTML = `<span class="status-dot"></span> MongoDB: Đã kết nối`;
      mongoBadge.title = `Host: ${data.mongo.host || 'Local'} | DB: ${data.mongo.dbName}`;
    } else {
      mongoBadge.className = 'status-badge warning';
      mongoBadge.innerHTML = `<span class="status-dot"></span> MongoDB: Chế độ dự phòng (JSON)`;
      mongoBadge.title = 'Chưa kết nối MongoDB, dữ liệu đang được lưu an toàn tại data/bios.json';
    }

    // UploadThing status
    if (data.uploadthing?.configured) {
      uploadthingBadge.className = 'status-badge online';
      uploadthingBadge.innerHTML = `<span class="status-dot"></span> UploadThing: Sẵn sàng`;
      uploadthingBadge.title = 'Đã cấu hình UPLOADTHING_TOKEN trên cloud uploadthing.com';
    } else {
      uploadthingBadge.className = 'status-badge warning';
      uploadthingBadge.innerHTML = `<span class="status-dot"></span> UploadThing: Lưu tạm cục bộ`;
      uploadthingBadge.title = 'Thêm UPLOADTHING_TOKEN vào .env để lưu ảnh trực tiếp lên cloud https://uploadthing.com/';
    }
  } catch (e) {
    console.error('Lỗi kiểm tra trạng thái hệ thống:', e);
  }
}

/**
 * Collect current form data into an object
 */
function getFormData() {
  // Collect custom links
  const customLinks = [];
  const rows = customLinksContainer.querySelectorAll('.custom-link-item');
  rows.forEach((row) => {
    const icon = row.querySelector('.link-icon-select')?.value || 'link';
    const label = row.querySelector('.link-label-input')?.value?.trim() || '';
    const value = row.querySelector('.link-value-input')?.value?.trim() || '';
    const href = row.querySelector('.link-href-input')?.value?.trim() || '';
    if (label || value) {
      customLinks.push({ icon, label, value, href });
    }
  });

  // Selected theme
  const activeThemeBtn = document.querySelector('.theme-option.active');
  const coverTheme = activeThemeBtn ? activeThemeBtn.dataset.theme : 'ocean';

  return {
    id: currentBio?.id || currentBio?._id,
    slug: inputSlug.value.trim(),
    name: inputName.value.trim(),
    role: inputRole.value.trim(),
    company: inputCompany.value.trim(),
    avatarUrl: inputAvatarUrl.value.trim() || '/assets/images/avatar.jpg',
    coverTheme,
    phone: inputPhone.value.trim(),
    email: inputEmail.value.trim(),
    department: inputDepartment.value.trim(),
    enableCallAction: checkCall.checked,
    callActionLabel: inputCallLabel.value.trim() || 'Gọi điện',
    enableEmailAction: checkEmail.checked,
    emailActionLabel: inputEmailLabel.value.trim() || 'Gửi email',
    customLinks,
    isDefault: currentBio?.isDefault || false,
  };
}

/**
 * Update the live card preview instantly
 */
function updateLivePreview() {
  const data = getFormData();
  previewWrap.innerHTML = renderBioCard(data);

  // Update public link anchor
  const slug = data.slug || 'default';
  const url = slug === 'default' ? '/' : `/u/${slug}`;
  publicLinkAnchor.href = url;
  publicLinkAnchor.textContent = url;
}

/**
 * Fill form with bio data
 */
function populateForm(bio) {
  currentBio = bio;
  isNewProfile = false;

  inputName.value = bio.name || '';
  inputRole.value = bio.role || '';
  inputCompany.value = bio.company || '';
  inputSlug.value = bio.slug || '';
  inputPhone.value = bio.phone || '';
  inputEmail.value = bio.email || '';
  inputDepartment.value = bio.department || '';
  inputAvatarUrl.value = bio.avatarUrl || '/assets/images/avatar.jpg';
  avatarPreviewImg.src = bio.avatarUrl || '/assets/images/avatar.jpg';

  checkCall.checked = bio.enableCallAction !== false;
  inputCallLabel.value = bio.callActionLabel || 'Gọi điện';
  checkEmail.checked = bio.enableEmailAction !== false;
  inputEmailLabel.value = bio.emailActionLabel || 'Gửi email';

  // Set Theme
  document.querySelectorAll('.theme-option').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === (bio.coverTheme || 'ocean'));
  });

  // Render Custom Links
  renderCustomLinksForm(bio.customLinks || []);

  // Update buttons
  btnDeleteProfile.style.display = allBios.length > 1 ? 'inline-flex' : 'none';
  btnSetDefault.style.display = bio.isDefault ? 'none' : 'inline-flex';

  updateLivePreview();
}

/**
 * Render custom links input rows
 */
function renderCustomLinksForm(links) {
  customLinksContainer.innerHTML = '';
  links.forEach((link) => addCustomLinkRow(link));
}

function addCustomLinkRow(data = {}) {
  const row = document.createElement('div');
  row.className = 'custom-link-item';
  row.innerHTML = `
    <div>
      <select class="form-control link-icon-select">
        <option value="phone" ${data.icon === 'phone' ? 'selected' : ''}>📞 Điện thoại</option>
        <option value="email" ${data.icon === 'email' ? 'selected' : ''}>✉️ Email</option>
        <option value="building" ${data.icon === 'building' ? 'selected' : ''}>🏢 Cơ quan</option>
        <option value="globe" ${data.icon === 'globe' ? 'selected' : ''}>🌐 Website</option>
        <option value="map-pin" ${data.icon === 'map-pin' ? 'selected' : ''}>📍 Địa chỉ</option>
        <option value="message-circle" ${data.icon === 'message-circle' ? 'selected' : ''}>💬 Nhắn tin</option>
        <option value="user" ${data.icon === 'user' ? 'selected' : ''}>👤 Cá nhân</option>
        <option value="link" ${data.icon === 'link' || !data.icon ? 'selected' : ''}>🔗 Liên kết</option>
      </select>
    </div>
    <div>
      <input type="text" class="form-control link-label-input" placeholder="Nhãn (VD: Zalo)" value="${escapeAttr(data.label || '')}">
    </div>
    <div style="display: flex; gap: 6px;">
      <input type="text" class="form-control link-value-input" placeholder="Giá trị hiển thị" value="${escapeAttr(data.value || '')}">
      <input type="text" class="form-control link-href-input" placeholder="Link liên kết (https://...)" value="${escapeAttr(data.href || '')}">
    </div>
    <div>
      <button type="button" class="btn-remove-row" title="Xóa dòng này">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
    </div>
  `;

  // Row event listeners for real-time preview
  row.querySelectorAll('input, select').forEach((el) => {
    el.addEventListener('input', updateLivePreview);
  });

  row.querySelector('.btn-remove-row').addEventListener('click', () => {
    row.remove();
    updateLivePreview();
  });

  customLinksContainer.appendChild(row);
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}

/**
 * Load all Bios from API
 */
async function loadBios(selectIdToSelect = null) {
  try {
    const res = await fetch('/api/bios');
    const json = await res.json();
    allBios = json.data || [];

    // Populate Select
    profileSelect.innerHTML = '';
    allBios.forEach((b) => {
      const opt = document.createElement('option');
      opt.value = b.id || b._id || b.slug;
      opt.textContent = `${b.name} (${b.slug})${b.isDefault ? ' ⭐ Mặc định' : ''}`;
      profileSelect.appendChild(opt);
    });

    // Select chosen or first
    let selected = allBios[0];
    if (selectIdToSelect) {
      selected = allBios.find((b) => (b.id || b._id || b.slug) === selectIdToSelect) || allBios[0];
    }
    if (selected) {
      profileSelect.value = selected.id || selected._id || selected.slug;
      populateForm(selected);
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách bio:', error);
    showToast('Lỗi khi tải danh sách Bio: ' + error.message, 'error');
  }
}

/**
 * Handle Avatar File Upload using UploadThing
 */
async function handleAvatarUpload(file) {
  if (!file) return;

  // Local immediate preview
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreviewImg.src = e.target.result;
    inputAvatarUrl.value = e.target.result;
    updateLivePreview();
  };
  reader.readAsDataURL(file);

  uploadStatusText.className = 'upload-status loading';
  uploadStatusText.innerHTML = `⏳ Đang tải ảnh lên <strong>UploadThing</strong>...`;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const res = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
    });
    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Lỗi tải ảnh lên server');
    }

    // Set permanent uploaded CDN URL
    inputAvatarUrl.value = result.url;
    avatarPreviewImg.src = result.url;
    updateLivePreview();

    if (result.provider === 'uploadthing') {
      uploadStatusText.className = 'upload-status success';
      uploadStatusText.innerHTML = `✅ Đã lưu trên <strong>UploadThing CDN</strong>!`;
      showToast('Đã upload avatar thành công lên UploadThing!', 'success');
    } else {
      uploadStatusText.className = 'upload-status success';
      uploadStatusText.innerHTML = `✅ Đã lưu ảnh cục bộ (${result.message})`;
      showToast(result.message, 'info');
    }
  } catch (err) {
    console.error('Lỗi upload avatar:', err);
    uploadStatusText.className = 'upload-status error';
    uploadStatusText.innerHTML = `❌ Lỗi upload: ${err.message}`;
    showToast('Upload thất bại: ' + err.message, 'error');
  }
}

/**
 * Save Bio Profile (Create or Update)
 */
async function saveBio() {
  const data = getFormData();

  if (!data.name) {
    showToast('Vui lòng nhập họ và tên!', 'error');
    inputName.focus();
    return;
  }

  btnSave.disabled = true;
  btnSave.innerHTML = `⏳ Đang lưu...`;

  try {
    let res;
    const bioId = currentBio?.id || currentBio?._id || currentBio?.slug;

    if (isNewProfile || !bioId) {
      // Create new
      res = await fetch('/api/bios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      // Update existing
      res = await fetch(`/api/bios/${encodeURIComponent(bioId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Không thể lưu hồ sơ.');
    }

    showToast(result.message || 'Lưu thông tin Bio thành công!', 'success');
    const savedId = result.data?.id || result.data?._id || result.data?.slug;
    await loadBios(savedId);
  } catch (error) {
    console.error('Lỗi lưu Bio:', error);
    showToast('Lỗi khi lưu: ' + error.message, 'error');
  } finally {
    btnSave.disabled = false;
    btnSave.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      Lưu thông tin Bio
    `;
  }
}

/**
 * Set Current Profile As Default
 */
async function setAsDefault() {
  const bioId = currentBio?.id || currentBio?._id || currentBio?.slug;
  if (!bioId) return;

  try {
    const res = await fetch(`/api/bios/${encodeURIComponent(bioId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDefault: true }),
    });
    const result = await res.json();
    if (result.success) {
      showToast('Đã đặt hồ sơ này làm mặc định khi vào trang chủ!', 'success');
      await loadBios(bioId);
    }
  } catch (err) {
    showToast('Lỗi: ' + err.message, 'error');
  }
}

/**
 * Delete Current Profile
 */
async function deleteCurrentProfile() {
  const bioId = currentBio?.id || currentBio?._id || currentBio?.slug;
  if (!bioId) return;

  if (!confirm(`Bạn có chắc chắn muốn xóa hồ sơ "${currentBio.name}" không?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/bios/${encodeURIComponent(bioId)}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (result.success) {
      showToast('Đã xóa hồ sơ thành công!', 'success');
      await loadBios();
    } else {
      showToast(result.message, 'error');
    }
  } catch (err) {
    showToast('Lỗi xóa hồ sơ: ' + err.message, 'error');
  }
}

/**
 * Prepare Blank Form for New Profile
 */
function prepareNewProfile() {
  isNewProfile = true;
  currentBio = null;

  inputName.value = '';
  inputRole.value = '';
  inputCompany.value = '';
  inputSlug.value = `user-${Math.floor(100 + Math.random() * 900)}`;
  inputPhone.value = '';
  inputEmail.value = '';
  inputDepartment.value = '';
  inputAvatarUrl.value = '/assets/images/avatar.jpg';
  avatarPreviewImg.src = '/assets/images/avatar.jpg';

  checkCall.checked = true;
  inputCallLabel.value = 'Gọi điện';
  checkEmail.checked = true;
  inputEmailLabel.value = 'Gửi email';

  // Default theme
  document.querySelectorAll('.theme-option').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === 'ocean');
  });

  customLinksContainer.innerHTML = '';
  addCustomLinkRow({ icon: 'phone', label: 'Số điện thoại', value: '', href: '' });
  addCustomLinkRow({ icon: 'email', label: 'Email', value: '', href: '' });

  btnDeleteProfile.style.display = 'none';
  btnSetDefault.style.display = 'none';

  uploadStatusText.textContent = '';
  updateLivePreview();
  showToast('Đã mở biểu mẫu tạo Bio mới. Hãy điền thông tin và nhấn "Lưu thông tin Bio".', 'info');
}

// Initial Setup
export function initAdmin() {
  loadSystemStatus();
  loadBios();

  // Profile selector change
  profileSelect.addEventListener('change', () => {
    const chosen = allBios.find((b) => (b.id || b._id || b.slug) === profileSelect.value);
    if (chosen) populateForm(chosen);
  });

  // Buttons
  btnNewProfile.addEventListener('click', prepareNewProfile);
  btnSetDefault.addEventListener('click', setAsDefault);
  btnDeleteProfile.addEventListener('click', deleteCurrentProfile);
  btnSave.addEventListener('click', saveBio);
  btnAddCustomLink.addEventListener('click', () => {
    addCustomLinkRow();
    updateLivePreview();
  });

  // Real-time inputs
  [
    inputName,
    inputRole,
    inputCompany,
    inputSlug,
    inputPhone,
    inputEmail,
    inputDepartment,
    inputAvatarUrl,
    inputCallLabel,
    inputEmailLabel,
  ].forEach((el) => el.addEventListener('input', updateLivePreview));

  checkCall.addEventListener('change', updateLivePreview);
  checkEmail.addEventListener('change', updateLivePreview);

  // Avatar file input change
  avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) handleAvatarUpload(file);
  });

  // Theme selection
  document.querySelectorAll('.theme-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-option').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      updateLivePreview();
    });
  });

  // View live button
  btnViewLive.addEventListener('click', () => {
    const slug = currentBio?.slug || 'default';
    const url = slug === 'default' ? '/' : `/u/${slug}`;
    window.open(url, '_blank');
  });
}
