/**
 * ============================================================
 *  EduCore — Employees Module
 *  File: js/employees.js
 *  Purpose: CRUD for employees/staff. Table render, add form,
 *           delete, staff ID card generation, job letters.
 * ============================================================
 */

import DB   from './db.service.js';
import { showToast, formatDate, getInitials, getAvatarStyle, registerPageLoader } from './ui.js';
import APP_CONFIG from '../config/app.config.js';

/* ── LOAD ALL EMPLOYEES ───────────────────────────────────── */
async function loadAllEmployees() {
  const tbody = document.getElementById('emp-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text3)">Loading...</td></tr>`;

  try {
    const employees = await DB.getAll('employees', { orderBy: 'created_at' });
    renderEmployeesTable(employees);
  } catch (err) {
    showToast('Failed to load employees: ' + err.message, 'error');
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--danger)">Error loading data</td></tr>`;
  }
}

function renderEmployeesTable(employees = []) {
  const tbody = document.getElementById('emp-tbody');
  if (!tbody) return;

  if (!employees.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text3)">No employees found</td></tr>`;
    return;
  }

  tbody.innerHTML = employees.map(e => {
    const initials = getInitials(e.name);
    const av       = getAvatarStyle(e.name);
    const roleBadge = e.role === 'Teacher' ? 'badge-blue' :
                      e.role === 'Admin'   ? 'badge-purple' : 'badge-green';

    return `
    <tr onclick="window.Employees.openDetail('${e.id}')">
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar" style="background:${av.bg};color:${av.text}">${initials}</div>
          <strong>${e.name}</strong>
        </div>
      </td>
      <td><span class="badge ${roleBadge}">${e.role || '—'}</span></td>
      <td>${e.contact || '—'}</td>
      <td>${e.salary ? '₹' + Number(e.salary).toLocaleString('en-IN') : '—'}</td>
      <td>${formatDate(e.joining_date)}</td>
      <td><span class="badge badge-green">Active</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();window.Employees.openDetail('${e.id}')">View</button>
        <button class="btn btn-ghost btn-sm c-red" onclick="event.stopPropagation();window.Employees.deleteEmployee('${e.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

/* ── SAVE NEW EMPLOYEE ────────────────────────────────────── */
async function saveEmployee() {
  const form = document.getElementById('add-employee-form');
  if (!form) return;

  const payload = {
    name:         form.querySelector('[name=name]')?.value?.trim(),
    contact:      form.querySelector('[name=contact]')?.value?.trim(),
    role:         form.querySelector('[name=role]')?.value,
    joining_date: form.querySelector('[name=joining_date]')?.value,
    salary:       parseFloat(form.querySelector('[name=salary]')?.value) || 0,
    supervisor:   form.querySelector('[name=supervisor]')?.value?.trim(),
    pan:          form.querySelector('[name=pan]')?.value?.trim(),
    email:        form.querySelector('[name=email]')?.value?.trim(),
    experience:   form.querySelector('[name=experience]')?.value,
    education:    form.querySelector('[name=education]')?.value?.trim(),
    dob:          form.querySelector('[name=dob]')?.value,
    gender:       form.querySelector('[name=gender]')?.value,
    address:      form.querySelector('[name=address]')?.value?.trim(),
    status:       'Active',
  };

  if (!payload.name || !payload.role) {
    showToast('Name and Role are required.', 'error');
    return;
  }

  // Photo upload
  const photoInput = document.getElementById('employee-photo-input');
  if (photoInput?.files?.[0]) {
    try {
      const path = `employees/${payload.name.replace(/\s+/g, '_')}_${Date.now()}`;
      payload.photo_url = await DB.uploadFile('employee-photos', path, photoInput.files[0]);
    } catch {
      showToast('Photo upload failed, saving without photo.', 'warning');
    }
  }

  try {
    await DB.insert('employees', payload);
    showToast('Employee added successfully!', 'success');
    form.reset();
    window.navigate('all-employees');
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

/* ── DELETE EMPLOYEE ──────────────────────────────────────── */
async function deleteEmployee(id) {
  if (!confirm('Delete this employee record?')) return;
  try {
    await DB.delete('employees', id);
    showToast('Employee deleted.', 'success');
    loadAllEmployees();
  } catch (err) {
    showToast('Delete failed: ' + err.message, 'error');
  }
}

/* ── VIEW DETAIL ──────────────────────────────────────────── */
async function openDetail(id) {
  try {
    const e = await DB.getById('employees', id);
    if (!e) { showToast('Employee not found', 'error'); return; }
    showToast(`Viewing: ${e.name}`, 'info');
    // TODO: open employee detail modal
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

/* ── REGISTER PAGE LOADERS ────────────────────────────────── */
registerPageLoader('all-employees', loadAllEmployees);

/* ── PUBLIC API ───────────────────────────────────────────── */
window.Employees = { save: saveEmployee, deleteEmployee, openDetail };

export default { saveEmployee, loadAllEmployees, deleteEmployee };
