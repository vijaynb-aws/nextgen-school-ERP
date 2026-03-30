/**
 * ============================================================
 *  EduCore — App Entry Point
 *  File: js/app.js
 *
 *  FIX SUMMARY (Cloudflare Pages compatibility):
 *  1. All import paths corrected to be relative to js/ folder
 *  2. Globals assigned to window BEFORE DOMContentLoaded
 *     so inline onclick handlers in HTML can find them
 *  3. Removed dependency on inline <script> block in HTML
 * ============================================================
 */

import { navigate, toggleSub, switchTab, showToast,
         openModal, closeModal, filterTable, toggleAll, initUI }
  from './ui.js';

import './dashboard.js';
import './students.js';
import './employees.js';
import './accounts.js';

/* ── ASSIGN GLOBALS IMMEDIATELY (before DOMContentLoaded) ─── */
// Cloudflare serves ES modules deferred — inline onclick handlers
// fire before DOMContentLoaded, so globals must exist NOW.
window.navigate    = navigate;
window.toggleSub   = toggleSub;
window.switchTab   = switchTab;
window.showToast   = showToast;
window.openModal   = openModal;
window.closeModal  = closeModal;
window.filterTable = filterTable;
window.toggleAll   = toggleAll;

/* ── KEYBOARD SHORTCUTS ───────────────────────────────────── */
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.topbar-search')?.focus();
  }
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open')
      .forEach(m => m.classList.remove('open'));
  }
});

/* ── MOBILE SIDEBAR ───────────────────────────────────────── */
function initMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  document.addEventListener('click', e => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target)) sidebar.classList.remove('open');
    }
  });
}

/* ── BOOTSTRAP ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[EduCore] Initialising...');

  initUI();
  initMobileSidebar();

  // Navigate to dashboard — triggers registerPageLoader('dashboard')
  navigate('dashboard');

  setTimeout(() => showToast('Welcome to EduCore!', 'info'), 700);

  console.log('[EduCore] Ready.');
});
