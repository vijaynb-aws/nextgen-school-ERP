/**
 * ============================================================
 *  EduCore — Students Module
 *  File: js/students.js
 *  Purpose: All CRUD operations for students. Renders tables,
 *           handles form submission, admission letters, ID cards.
 *           Connects to DB via db.service.js (no direct DB calls).
 * ============================================================
 */

import DB   from './db.service.js';
import { showToast, formatDate, getInitials, getAvatarStyle, registerPageLoader } from './ui.js';
import APP_CONFIG from '../config/app.config.js';

/* ── RENDER ALL STUDENTS TABLE ────────────────────────────── */
async function loadAllStudents() {
  const tbody = document.getElementById('students-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text3)">Loading...</td></tr>`;

  try {
    const students = await DB.getAll('students', { orderBy: 'created_at', ascending: false });
    renderStudentsTable(students);
  } catch (err) {
    showToast('Failed to load students: ' + err.message, 'error');
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--danger)">Error loading data</td></tr>`;
  }
}

function renderStudentsTable(students = []) {
  const tbody = document.getElementById('students-tbody');
  if (!tbody) return;

  if (!students.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text3)">No students found</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(s => {
    const initials = getInitials(s.name);
    const av       = getAvatarStyle(s.name);
    const status   = s.status || 'Active';
    const badgeCls = status === 'Active' ? 'badge-green' : status === 'Pending' ? 'badge-yellow' : 'badge-red';

    return `
    <tr onclick="window.Students.openDetail('${s.id}')">
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar" style="background:${av.bg};color:${av.text}">${initials}</div>
          <strong>${s.name}</strong>
        </div>
      </td>
      <td>${s.reg_number || '—'}</td>
      <td>${s.class || '—'}</td>
      <td>${s.gender || '—'}</td>
      <td>${formatDate(s.dob)}</td>
      <td><span class="badge ${badgeCls}">${status}</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();window.Students.openDetail('${s.id}')">View</button>
        <button class="btn btn-ghost btn-sm c-red" onclick="event.stopPropagation();window.Students.deleteStudent('${s.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

/* ── SAVE NEW STUDENT ─────────────────────────────────────── */
async function saveStudent() {
  const form = document.getElementById('add-student-form');
  if (!form) return;

  const payload = {
    name:           form.querySelector('[name=name]')?.value?.trim(),
    reg_number:     form.querySelector('[name=reg_number]')?.value?.trim(),
    class:          form.querySelector('[name=class]')?.value,
    dob:            form.querySelector('[name=dob]')?.value,
    gender:         form.querySelector('[name=gender]')?.value,
    blood_group:    form.querySelector('[name=blood_group]')?.value,
    mobile:         form.querySelector('[name=mobile]')?.value?.trim(),
    religion:       form.querySelector('[name=religion]')?.value?.trim(),
    caste:          form.querySelector('[name=caste]')?.value?.trim(),
    discount:       form.querySelector('[name=discount]')?.value,
    prev_school:    form.querySelector('[name=prev_school]')?.value?.trim(),
    id_marks:       form.querySelector('[name=id_marks]')?.value?.trim(),
    address:        form.querySelector('[name=address]')?.value?.trim(),
    note:           form.querySelector('[name=note]')?.value?.trim(),
    father_name:    form.querySelector('[name=father_name]')?.value?.trim(),
    father_contact: form.querySelector('[name=father_contact]')?.value?.trim(),
    mother_name:    form.querySelector('[name=mother_name]')?.value?.trim(),
    mother_contact: form.querySelector('[name=mother_contact]')?.value?.trim(),
    admission_date: form.querySelector('[name=admission_date]')?.value || new Date().toISOString().split('T')[0],
    status:         'Active',
  };

  // Basic validation
  if (!payload.name || !payload.reg_number) {
    showToast('Name and Registration Number are required.', 'error');
    return;
  }

  // Photo upload (if selected)
  const photoInput = document.getElementById('student-photo-input');
  if (photoInput?.files?.[0]) {
    try {
      const path = `students/${payload.reg_number}_${Date.now()}`;
      payload.photo_url = await DB.uploadFile(
        APP_CONFIG.storage?.studentPhotos || 'student-photos',
        path,
        photoInput.files[0]
      );
    } catch {
      showToast('Photo upload failed, saving without photo.', 'warning');
    }
  }

  try {
    await DB.insert('students', payload);
    showToast('Student admitted successfully!', 'success');
    form.reset();
    window.navigate('all-students');
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

/* ── DELETE STUDENT ───────────────────────────────────────── */
async function deleteStudent(id) {
  if (!confirm('Delete this student? This cannot be undone.')) return;
  try {
    await DB.delete('students', id);
    showToast('Student deleted.', 'success');
    loadAllStudents();
  } catch (err) {
    showToast('Delete failed: ' + err.message, 'error');
  }
}

/* ── OPEN STUDENT DETAIL ──────────────────────────────────── */
async function openDetail(id) {
  try {
    const s = await DB.getById('students', id);
    if (!s) { showToast('Student not found', 'error'); return; }
    const av = getAvatarStyle(s.name);
    // Populate a modal or navigate to detail page
    showToast(`Viewing: ${s.name}`, 'info');
    // TODO: populate #modal-student-detail and openModal(...)
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

/* ── GENERATE REG NUMBER ──────────────────────────────────── */
function generateRegNumber() {
  const year  = new Date().getFullYear();
  const rand  = Math.floor(1000 + Math.random() * 9000);
  return `${year}${rand}`;
}

export function prefillRegNumber() {
  const input = document.querySelector('[name=reg_number]');
  if (input && !input.value) input.value = generateRegNumber();
}

/* ── REGISTER PAGE LOADERS ────────────────────────────────── */
registerPageLoader('all-students', loadAllStudents);
registerPageLoader('add-student',  prefillRegNumber);

/* ── PUBLIC API (window-accessible for inline onclick) ───── */
window.Students = {
  save:          saveStudent,
  deleteStudent: deleteStudent,
  openDetail:    openDetail,
  prefillReg:    prefillRegNumber,
};

export default { saveStudent, loadAllStudents, deleteStudent, openDetail };
