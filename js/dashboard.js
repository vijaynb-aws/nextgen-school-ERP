/**
 * ============================================================
 *  EduCore — Dashboard Module
 *  File: js/dashboard.js
 *  Purpose: Load dashboard stats, chart, recent admissions.
 *           Runs on page load and when user navigates here.
 * ============================================================
 */

import DB   from './db.service.js';
import { showToast, formatDate, getInitials, getAvatarStyle, renderBarChart, registerPageLoader } from './ui.js';

/* ── LOAD DASHBOARD ───────────────────────────────────────── */
async function loadDashboard() {
  await Promise.allSettled([
    loadStats(),
    loadRecentAdmissions(),
    loadBarChart(),
  ]);
}

/* ── STATS CARDS ──────────────────────────────────────────── */
async function loadStats() {
  try {
    const [students, employees, classes, accounts] = await Promise.all([
      DB.getAll('students', { limit: 9999 }),
      DB.getAll('employees', { limit: 9999 }),
      DB.getAll('classes',   { limit: 9999 }),
      DB.getAll('accounts',  { limit: 9999 }),
    ]);

    const totalIncome  = accounts.filter(a => a.type === 'income').reduce((s, a) => s + Number(a.amount), 0);
    const totalExpense = accounts.filter(a => a.type === 'expense').reduce((s, a) => s + Number(a.amount), 0);

    // Update stat cards
    setStatValue('stat-students',  students.length);
    setStatValue('stat-employees', employees.length);
    setStatValue('stat-classes',   classes.length);
    setStatValue('stat-income',    '₹' + formatLakh(totalIncome));
    setStatValue('stat-expense',   '₹' + formatLakh(totalExpense));

    // Update sidebar badge
    const badge = document.querySelector('#nav-students-badge');
    if (badge) badge.textContent = students.length;

  } catch (err) {
    // Fail silently on dashboard — don't block other widgets
    console.warn('Stats load error:', err);
  }
}

function setStatValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatLakh(n) {
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
  if (n >= 1000)   return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString('en-IN');
}

/* ── RECENT ADMISSIONS ────────────────────────────────────── */
async function loadRecentAdmissions() {
  const tbody = document.getElementById('recent-admissions-tbody');
  if (!tbody) return;

  try {
    const students = await DB.getAll('students', { orderBy: 'created_at', ascending: false, limit: 5 });

    tbody.innerHTML = students.map(s => {
      const av     = getAvatarStyle(s.name);
      const init   = getInitials(s.name);
      const status = s.status || 'Active';
      const badge  = status === 'Active' ? 'badge-green' : 'badge-yellow';
      return `
      <tr onclick="window.navigate('all-students')">
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="avatar" style="background:${av.bg};color:${av.text}">${init}</div>
            <strong>${s.name}</strong>
          </div>
        </td>
        <td>${s.class || '—'}</td>
        <td>${formatDate(s.admission_date)}</td>
        <td><span class="badge ${badge}">${status}</span></td>
      </tr>`;
    }).join('') || `<tr><td colspan="4" style="text-align:center;color:var(--text3)">No admissions yet</td></tr>`;
  } catch (err) {
    console.warn('Recent admissions error:', err);
  }
}

/* ── FEE COLLECTION BAR CHART ─────────────────────────────── */
async function loadBarChart() {
  try {
    const accounts = await DB.getAll('accounts', { limit: 9999 });
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyIncome = Array(12).fill(0);

    accounts
      .filter(a => a.type === 'income')
      .forEach(a => {
        const d = new Date(a.entry_date);
        const m = d.getMonth();
        monthlyIncome[m] += Number(a.amount);
      });

    // Only show months with data (or last 8 if no data yet, use sample)
    const hasData = monthlyIncome.some(v => v > 0);
    const values  = hasData ? monthlyIncome : [60000, 75000, 55000, 80000, 90000, 70000, 85000, 65000, 0, 0, 0, 0];

    renderBarChart('barChart', values.slice(0, 8));

    // Update month labels
    const labelEl = document.getElementById('chart-labels');
    if (labelEl) labelEl.innerHTML = months.slice(0, 8).map(m => `<span>${m}</span>`).join('');

  } catch (err) {
    // Render sample data if DB not connected
    renderBarChart('barChart', [60000, 75000, 55000, 80000, 90000, 70000, 85000, 65000]);
  }
}

/* ── REGISTER PAGE LOADER ─────────────────────────────────── */
registerPageLoader('dashboard', loadDashboard);

export default { loadDashboard };
