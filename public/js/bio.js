// Icon helper map
export const ICONS = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>`,
  handset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>`,
  building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  'map-pin': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  'message-circle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

/**
 * Get icon SVG string
 */
export function getIcon(iconName) {
  return ICONS[iconName] || ICONS.link;
}

/**
 * Render bio card HTML
 */
export function renderBioCard(bio) {
  const coverTheme = bio.coverTheme || 'ocean';
  const name = bio.name || 'Người dùng';
  const role = bio.role || '';
  const company = bio.company || '';
  const avatarUrl = bio.avatarUrl || '/assets/images/avatar.jpg';
  const phone = bio.phone || '';
  const email = bio.email || '';
  const department = bio.department || '';

  // Action buttons
  let actionsHtml = '';
  const hasCall = bio.enableCallAction !== false && phone;
  const hasEmail = bio.enableEmailAction !== false && email;

  if (hasCall || hasEmail) {
    const singleColClass = (hasCall && !hasEmail) || (!hasCall && hasEmail) ? ' single-col' : '';
    actionsHtml = `<div class="actions${singleColClass}">`;

    if (hasCall) {
      actionsHtml += `
        <a class="btn primary" href="tel:${phone.replace(/\s+/g, '')}">
          ${ICONS.handset}
          ${bio.callActionLabel || 'Gọi điện'}
        </a>
      `;
    }

    if (hasEmail) {
      actionsHtml += `
        <a class="btn ghost" href="mailto:${email.trim()}">
          ${ICONS.email}
          ${bio.emailActionLabel || 'Gửi email'}
        </a>
      `;
    }

    actionsHtml += `</div>`;
  }

  // Info rows
  const rows = [];

  // Default contact rows if filled
  if (phone) {
    rows.push({
      label: 'Số điện thoại',
      value: phone,
      href: `tel:${phone.replace(/\s+/g, '')}`,
      icon: 'phone',
    });
  }

  if (email) {
    rows.push({
      label: 'Email',
      value: email,
      href: `mailto:${email.trim()}`,
      icon: 'email',
    });
  }

  if (department) {
    rows.push({
      label: 'Phòng ban',
      value: department,
      href: '',
      icon: 'building',
    });
  }

  // Custom additional rows
  if (Array.isArray(bio.customLinks)) {
    for (const item of bio.customLinks) {
      if (item.label || item.value) {
        rows.push({
          label: item.label,
          value: item.value,
          href: item.href,
          icon: item.icon || 'link',
        });
      }
    }
  }

  // Build rows HTML
  let rowsHtml = '';
  if (rows.length > 0) {
    rowsHtml = `<ul class="list">` + rows.map((r) => {
      const iconSvg = getIcon(r.icon);
      const content = `
        <span class="ico">${iconSvg}</span>
        <span class="txt">
          ${r.label ? `<span class="k">${escapeHtml(r.label)}</span>` : ''}
          <span class="v">${escapeHtml(r.value || r.label)}</span>
        </span>
      `;

      if (r.href && r.href.trim()) {
        const isExternal = r.href.startsWith('http://') || r.href.startsWith('https://');
        const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<li><a class="row" href="${escapeHtml(r.href)}"${targetAttr}>${content}</a></li>`;
      } else {
        return `<li><div class="row">${content}</div></li>`;
      }
    }).join('') + `</ul>`;
  }

  return `
    <main class="card" data-cover="${coverTheme}">
      <div class="cover" aria-hidden="true"></div>
      <header class="head">
        <div class="avatar">
          <img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(name)}" onerror="this.src='/assets/images/avatar.jpg'">
        </div>
        <h1>${escapeHtml(name)}</h1>
        ${role ? `<p class="role">${escapeHtml(role)}</p>` : ''}
        ${company ? `<span class="chip">${escapeHtml(company)}</span>` : ''}
      </header>
      ${actionsHtml}
      ${rowsHtml}
    </main>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Fetch and display Bio profile on page load
 */
export async function initBioPage() {
  const container = document.getElementById('bio-container');
  if (!container) return;

  // Determine requested slug
  let slug = '';
  const pathname = window.location.pathname;
  if (pathname.startsWith('/u/')) {
    slug = pathname.replace('/u/', '').trim();
  } else {
    const params = new URLSearchParams(window.location.search);
    slug = params.get('u') || params.get('slug') || '';
  }

  const endpoint = slug ? `/api/bios/${encodeURIComponent(slug)}` : '/api/bios/default';

  try {
    const res = await fetch(endpoint);
    const json = await res.json();

    if (!res.ok || !json.data) {
      throw new Error(json.message || 'Không tìm thấy hồ sơ người dùng');
    }

    const bio = json.data;
    document.title = `${bio.name || 'Bio'} – ${bio.company || bio.role || 'Trang cá nhân'}`;
    document.body.setAttribute('data-cover', bio.coverTheme || 'ocean');

    container.innerHTML = renderBioCard(bio);
  } catch (error) {
    console.error('Lỗi khi tải thông tin Bio:', error);
    container.innerHTML = `
      <main class="card" style="padding: 32px 24px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
        <h2 style="font-size: 20px; margin-bottom: 8px;">Không tìm thấy hồ sơ</h2>
        <p style="color: var(--muted); font-size: 14px; margin-bottom: 24px;">${escapeHtml(error.message)}</p>
        <a class="btn primary" href="/admin" style="display: inline-flex;">Vào trang Admin</a>
      </main>
    `;
  }
}
