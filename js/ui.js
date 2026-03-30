/**
 * ============================================================
 *  EduCore — UI Utilities
 *  File: js/ui.js
 *
 *  FIX: Import path for app.config corrected.
 *  All exports work as ES module AND as window.* globals
 *  (app.js assigns them to window).
 * ============================================================
 */

import APP_CONFIG from '../config/app.config.js';

/* ── PAGE LABELS ──────────────────────────────────────────── */
const pageLabels = {
  'dashboard':         'Dashboard',
  'inst-profile':      'Institute Profile',
  'fees-particulars':  'Fees Particulars',
  'fees-structure':    'Fees Structure',
  'discount-type':     'Discount Type',
  'rules':             'Rules & Regulations',
  'marks-grading':     'Marks Grading',
  'theme-lang':        'Theme & Language',
  'account-settings':  'Account Settings',
  'all-classes':       'All Classes',
  'new-class':         'New Class',
  'classes-subjects':  'Classes with Subjects',
  'assign-subject':    'Assign Subject',
  'all-students':      'All Students',
  'add-student':       'Add New Student',
  'admission-letter':  'Admission Letter',
  'student-id':        'Student ID Cards',
  'promote-students':  'Promote Students',
  'all-employees':     'All Employees',
  'add-employee':      'Add New Employee',
  'staff-id':          'Staff ID Cards',
  'job-letter':        'Job Letter',
  'chart-accounts':    'Chart of Accounts',
  'add-income':        'Add Income',
  'add-expense':       'Add Expense',
  'account-statement': 'Account Statement',
};

/* ── NAVIGATE ─────────────────────────────────────────────── */
export function navigate(id, el = null) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  const crumb = document.getElementById('breadcrumb');
  if (crumb) crumb.innerHTML = `<strong>${pageLabels[id] || id}</strong>`;

  if (el) {
    document.querySelectorAll('.nav-item, .sub-nav-item')
      .forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }

  const content = document.querySelector('.page-content');
  if (content) content.scrollTop = 0;

  loadPageData(id);
}

/* ── SIDEBAR TOGGLE ───────────────────────────────────────── */
export function toggleSub(id) {
  const sub   = document.getElementById(id);
  const arrow = document.getElementById(id + '-arrow');
  if (!sub) return;
  sub.classList.toggle('open');
  if (arrow) arrow.classList.toggle('open');
}

/* ── TABS ─────────────────────────────────────────────────── */
export function switchTab(el, panelId) {
  const scope = el.closest('.card') || el.closest('.page');
  if (!scope) return;
  scope.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  scope.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

/* ── TOAST ────────────────────────────────────────────────── */
const TOAST_ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${TOAST_ICONS[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all .3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── MODAL ────────────────────────────────────────────────── */
export function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

export function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

export function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
}

/* ── TABLE FILTER ─────────────────────────────────────────── */
export function filterTable(inputEl, tbodyId) {
  const q = inputEl.value.toLowerCase().trim();
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.querySelectorAll('tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

/* ── CHECKBOX ALL ─────────────────────────────────────────── */
export function toggleAll(masterCb) {
  const table = masterCb.closest('table');
  if (!table) return;
  table.querySelectorAll('tbody input[type=checkbox]')
    .forEach(cb => { cb.checked = masterCb.checked; });
}

/* ── FORMAT HELPERS ───────────────────────────────────────── */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ── BAR CHART ────────────────────────────────────────────── */
export function renderBarChart(containerId, values = []) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = Math.max(...values) || 1;
  el.innerHTML = values.map(() => `
    <div style="flex:1;border-radius:4px 4px 0 0;height:0%;
      background:linear-gradient(to top,var(--accent),var(--accent2));
      opacity:.85;transition:height .6s ease;"></div>
  `).join('');
  requestAnimationFrame(() => {
    el.querySelectorAll('div').forEach((bar, i) => {
      bar.style.height = Math.round((values[i] / max) * 90) + '%';
    });
  });
}

/* ── AVATAR COLORS ────────────────────────────────────────── */
const AVATAR_COLORS = [
  { bg: 'rgba(79,142,247,.2)',  text: 'var(--accent)' },
  { bg: 'rgba(46,201,165,.2)', text: 'var(--accent3)' },
  { bg: 'rgba(124,92,191,.2)', text: 'var(--accent2)' },
  { bg: 'rgba(247,201,72,.2)', text: 'var(--warning)' },
  { bg: 'rgba(242,95,92,.2)',  text: 'var(--danger)' },
];

export function getAvatarStyle(name = '') {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

/* ── PAGE LOADER REGISTRY ─────────────────────────────────── */
function loadPageData(pageId) {
  const loaders = window.__pageLoaders || {};
  if (typeof loaders[pageId] === 'function') {
    loaders[pageId]().catch(err =>
      showToast('Load error: ' + err.message, 'error'));
  }
}

export function registerPageLoader(pageId, fn) {
  if (!window.__pageLoaders) window.__pageLoaders = {};
  window.__pageLoaders[pageId] = fn;
}

/* ── INIT UI ──────────────────────────────────────────────── */
export function initUI() {
  initModals();
  document.querySelectorAll('[data-school-name]')
    .forEach(el => el.textContent = APP_CONFIG.school.name);
}
