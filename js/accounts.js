/**
 * ============================================================
 *  EduCore — Accounts Module
 *  File: js/accounts.js
 *  Purpose: Income/expense CRUD, chart of accounts, account
 *           statement with date filtering, balance summaries.
 * ============================================================
 */

import DB   from './db.service.js';
import { showToast, formatDate, formatCurrency, registerPageLoader } from './ui.js';

/* ── LOAD ACCOUNT STATEMENT ───────────────────────────────── */
async function loadAccountStatement() {
  const tbody = document.getElementById('statement-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text3)">Loading...</td></tr>`;

  try {
    const rows = await DB.getAll('accounts', { orderBy: 'entry_date', ascending: false });
    renderStatement(rows);
    updateStatementSummary(rows);
  } catch (err) {
    showToast('Failed to load transactions: ' + err.message, 'error');
  }
}

function renderStatement(rows = []) {
  const tbody = document.getElementById('statement-tbody');
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text3)">No transactions found</td></tr>`;
    return;
  }

  let balance = 0;
  tbody.innerHTML = rows.map(r => {
    const isIncome  = r.type === 'income';
    balance += isIncome ? Number(r.amount) : -Number(r.amount);
    const badgeCls  = isIncome ? 'badge-green' : 'badge-red';
    const amtClass  = isIncome ? 'c-green' : 'c-red';
    const debit     = isIncome ? '—' : `<span class="${amtClass}">₹${Number(r.amount).toLocaleString('en-IN')}</span>`;
    const credit    = isIncome ? `<span class="${amtClass}">₹${Number(r.amount).toLocaleString('en-IN')}</span>` : '—';

    return `
    <tr>
      <td>${formatDate(r.entry_date)}</td>
      <td><strong>${r.title}</strong></td>
      <td><span class="badge ${badgeCls}">${r.type === 'income' ? 'Income' : 'Expense'}</span></td>
      <td>${debit}</td>
      <td>${credit}</td>
      <td>₹${balance.toLocaleString('en-IN')}</td>
    </tr>`;
  }).join('');
}

function updateStatementSummary(rows = []) {
  const income  = rows.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0);
  const expense = rows.filter(r => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0);
  const net     = income - expense;

  const incEl  = document.getElementById('summary-income');
  const expEl  = document.getElementById('summary-expense');
  const netEl  = document.getElementById('summary-net');

  if (incEl)  incEl.textContent  = '₹' + income.toLocaleString('en-IN');
  if (expEl)  expEl.textContent  = '₹' + expense.toLocaleString('en-IN');
  if (netEl)  netEl.textContent  = '₹' + net.toLocaleString('en-IN');
}

/* ── SAVE INCOME ──────────────────────────────────────────── */
async function saveIncome() {
  const form = document.getElementById('add-income-form');
  if (!form) return;

  const payload = {
    title:      form.querySelector('[name=title]')?.value?.trim(),
    amount:     parseFloat(form.querySelector('[name=amount]')?.value) || 0,
    entry_date: form.querySelector('[name=date]')?.value || new Date().toISOString().split('T')[0],
    account:    form.querySelector('[name=account]')?.value,
    method:     form.querySelector('[name=method]')?.value,
    receipt_no: form.querySelector('[name=receipt_no]')?.value?.trim(),
    description:form.querySelector('[name=description]')?.value?.trim(),
    type:       'income',
  };

  if (!payload.title || !payload.amount) {
    showToast('Title and Amount are required.', 'error');
    return;
  }

  try {
    await DB.insert('accounts', payload);
    showToast('Income recorded!', 'success');
    form.reset();
    loadRecentIncome();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

/* ── SAVE EXPENSE ─────────────────────────────────────────── */
async function saveExpense() {
  const form = document.getElementById('add-expense-form');
  if (!form) return;

  const payload = {
    title:       form.querySelector('[name=title]')?.value?.trim(),
    amount:      parseFloat(form.querySelector('[name=amount]')?.value) || 0,
    entry_date:  form.querySelector('[name=date]')?.value || new Date().toISOString().split('T')[0],
    account:     form.querySelector('[name=account]')?.value,
    method:      form.querySelector('[name=method]')?.value,
    voucher_no:  form.querySelector('[name=voucher_no]')?.value?.trim(),
    description: form.querySelector('[name=description]')?.value?.trim(),
    type:        'expense',
  };

  if (!payload.title || !payload.amount) {
    showToast('Title and Amount are required.', 'error');
    return;
  }

  try {
    await DB.insert('accounts', payload);
    showToast('Expense recorded!', 'success');
    form.reset();
    loadRecentExpense();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

/* ── LOAD RECENT INCOME ───────────────────────────────────── */
async function loadRecentIncome() {
  const tbody = document.getElementById('income-recent-tbody');
  if (!tbody) return;
  try {
    const rows = await DB.getAll('accounts', { orderBy: 'entry_date', ascending: false, limit: 5, filters: [{ col: 'type', val: 'income' }] });
    tbody.innerHTML = rows.map(r => `
      <tr>
        <td>${formatDate(r.entry_date)}</td>
        <td><strong>${r.title}</strong></td>
        <td class="c-green">₹${Number(r.amount).toLocaleString('en-IN')}</td>
        <td>${r.method || '—'}</td>
      </tr>`).join('') || `<tr><td colspan="4" style="text-align:center;color:var(--text3)">No records</td></tr>`;
  } catch (err) {
    showToast('Error loading income: ' + err.message, 'error');
  }
}

/* ── LOAD RECENT EXPENSE ──────────────────────────────────── */
async function loadRecentExpense() {
  const tbody = document.getElementById('expense-recent-tbody');
  if (!tbody) return;
  try {
    const rows = await DB.getAll('accounts', { orderBy: 'entry_date', ascending: false, limit: 5, filters: [{ col: 'type', val: 'expense' }] });
    tbody.innerHTML = rows.map(r => `
      <tr>
        <td>${formatDate(r.entry_date)}</td>
        <td><strong>${r.title}</strong></td>
        <td class="c-red">₹${Number(r.amount).toLocaleString('en-IN')}</td>
        <td>${r.method || '—'}</td>
      </tr>`).join('') || `<tr><td colspan="4" style="text-align:center;color:var(--text3)">No records</td></tr>`;
  } catch (err) {
    showToast('Error loading expenses: ' + err.message, 'error');
  }
}

/* ── REGISTER PAGE LOADERS ────────────────────────────────── */
registerPageLoader('account-statement', loadAccountStatement);
registerPageLoader('add-income',        loadRecentIncome);
registerPageLoader('add-expense',       loadRecentExpense);

/* ── PUBLIC API ───────────────────────────────────────────── */
window.Accounts = { saveIncome, saveExpense, loadAccountStatement };

export default { saveIncome, saveExpense, loadAccountStatement };
