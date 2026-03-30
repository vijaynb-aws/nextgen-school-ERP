/**
 * ============================================================
 *  EduCore — App Entry Point
 *  File: js/app.js
 *  Purpose: Bootstrap the app. Import all modules, wire up
 *           global event handlers, check auth, init UI.
 *           This is the ONLY script tag you need in index.html.
 * ============================================================
 */

import { navigate, toggleSub, switchTab, showToast, filterTable, toggleAll, initUI } from '../ui.js';
import './dashboard.js';
import '../students.js';
import './employees.js';
import './accounts.js';

/* ── EXPOSE GLOBALS FOR INLINE HTML onclick HANDLERS ──────── */
// (needed since HTML is not bundled — inline onclicks call these)
window.navigate   = navigate;
window.toggleSub  = toggleSub;
window.switchTab  = switchTab;
window.showToast  = showToast;
window.filterTable= filterTable;
window.toggleAll  = toggleAll;

/* ── AUTH GUARD ───────────────────────────────────────────── */
async function checkAuth() {
  // Import DB lazily to avoid circular dep
  const { default: DB } = await import('./db.service.js');
  try {
    const session = await DB.getSession();
    if (!session) {
      // Redirect to login page if auth required
      // window.location.href = '/login.html';
      // For dev: skip auth check
      console.log('[EduCore] Dev mode: skipping auth check');
    }
  } catch {
    console.log('[EduCore] Auth check skipped (no backend yet)');
  }
}

/* ── GLOBAL KEYBOARD SHORTCUTS ────────────────────────────── */
document.addEventListener('keydown', e => {
  // Ctrl+K → focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.topbar-search')?.click();
  }
  // Escape → close open modals
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

/* ── MOBILE SIDEBAR OVERLAY ───────────────────────────────── */
function initMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  if (!sidebar) return;
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', e => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target)) sidebar.classList.remove('open');
    }
  });
}

/* ── BOOTSTRAP ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[EduCore] Initialising...');

  // 1. Init UI (modals, school name, etc.)
  initUI();

  // 2. Check auth
  await checkAuth();

  // 3. Mobile sidebar
  initMobileSidebar();

  // 4. Navigate to dashboard (triggers loadDashboard via page loader)
  navigate('dashboard');

  // 5. Welcome toast
  setTimeout(() => showToast('Welcome to EduCore!', 'info'), 600);

  console.log('[EduCore] Ready.');
});
