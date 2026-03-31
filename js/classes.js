    1 /**
    2  * ============================================================
    3  *  EduCore — Classes Module
    4  *  File: js/classes.js
    5  *  Purpose: CRUD for classes/sections. Table render, add form,
    6  *           delete, class details. Connects to DB via db.service.js.
    7  * ============================================================
    8  */
    9
   10 import DB   from './db.service.js';
   11 import { showToast, formatDate, registerPageLoader } from './ui.js';
   12 import APP_CONFIG from '../config/app.config.js';
   13
   14 /* ── LOAD ALL CLASSES ──────────────────────────────────────── */
   15 async function loadAllClasses() {
   16   const tbody = document.getElementById('classes-tbody');
   17   if (!tbody) return;
   18
   19   tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text3)">Loading...</td></tr>`;
   20
   21   try {
   22     const classes = await DB.getAll('classes', { orderBy: 'class_name', ascending: true });
   23     renderClassesTable(classes);
   24   } catch (err) {
   25     showToast('Failed to load classes: ' + err.message, 'error');
   26     tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--danger)">Error loading data</td></tr>`;
   27   }
   28 }
   29
   30 function renderClassesTable(classes = []) {
   31   const tbody = document.getElementById('classes-tbody');
   32   if (!tbody) return;
   33
   34   if (!classes.length) {
   35     tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text3)">No classes found</td></tr>`;
   36     return;
   37   }
   38
   39   tbody.innerHTML = classes.map(c => {
   40     const teacherName = c.teacher || '—';
   41     const studentCount = c.student_count || 0;
   42     const maxStudents = c.max_students || 35;
   43     const fee = c.monthly_fee ? '₹' + Number(c.monthly_fee).toLocaleString('en-IN') : '—';
   44
   45     return `
   46     <tr onclick="window.Classes.openDetail('${c.id}')">
   47       <td><strong>${c.class_name || '—'}</strong></td>
   48       <td>${c.section || '—'}</td>
   49       <td>${teacherName}</td>
   50       <td><span class="c-blue">${studentCount}/${maxStudents}</span></td>
   51       <td>${fee}</td>
   52       <td>
   53         <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();window.Classes.openDetail('${c.id}')">View</button>
   54         <button class="btn btn-ghost btn-sm c-red" onclick="event.stopPropagation();window.Classes.deleteClass('${c.id}')">Delete</button>
   55       </td>
   56     </tr>`;
   57   }).join('');
   58 }
   59
   60 /* ── SAVE NEW CLASS ────────────────────────────────────────── */
   61 async function saveClass() {
   62   const form = document.getElementById('add-class-form');
   63   if (!form) return;
   64
   65   const payload = {
   66     class_name:     form.querySelector('[name=class_name]')?.value?.trim(),
   67     section:        form.querySelector('[name=section]')?.value?.trim(),
   68     monthly_fee:    parseFloat(form.querySelector('[name=monthly_fee]')?.value) || 0,
   69     teacher:        form.querySelector('[name=teacher]')?.value || null,
   70     max_students:   parseInt(form.querySelector('[name=max_students]')?.value) || 35,
   71     room_number:    form.querySelector('[name=room_number]')?.value?.trim() || null,
   72     status:         'Active',
   73   };
   74
   75   // Basic validation
   76   if (!payload.class_name) {
   77     showToast('Class Name is required.', 'error');
   78     return;
   79   }
   80
   81   try {
   82     await DB.insert('classes', payload);
   83     showToast('Class created successfully!', 'success');
   84     form.reset();
   85     window.navigate('all-classes');
   86   } catch (err) {
   87     showToast('Error: ' + err.message, 'error');
   88   }
   89 }
   90
   91 /* ── DELETE CLASS ───────────────────────────────────────────── */
   92 async function deleteClass(id) {
   93   if (!confirm('Delete this class? This cannot be undone.')) return;
   94   try {
   95     await DB.delete('classes', id);
   96     showToast('Class deleted.', 'success');
   97     loadAllClasses();
   98   } catch (err) {
   99     showToast('Delete failed: ' + err.message, 'error');
  100   }
  101 }
  102
  103 /* ── OPEN CLASS DETAIL ─────────────────────────────────────── */
  104 async function openDetail(id) {
  105   try {
  106     const c = await DB.getById('classes', id);
  107     if (!c) { showToast('Class not found', 'error'); return; }
  108
  109     // For now, show basic info. Future: open detail modal with full info
  110     const info = `Class: ${c.class_name}${c.section ? ' ' + c.section : ''}\nTeacher: ${c.teacher || 'Not assigned'}\nStudents: ${c.student_count |
      | 0}/${c.max_students || 35}\nFee: ₹${Number(c.monthly_fee || 0).toLocaleString('en-IN')}`;
  111     showToast(info.replace(/\n/g, ' | '), 'info');
  112
  113     // TODO: Populate a modal with class details, subjects, students list
  114   } catch (err) {
  115     showToast('Error: ' + err.message, 'error');
  116   }
  117 }
  118
  119 /* ── REGISTER PAGE LOADERS ─────────────────────────────────── */
  120 registerPageLoader('all-classes', loadAllClasses);
  121 registerPageLoader('new-class',    () => {
  122   // Optional: prefill form with defaults or load teachers dropdown
  123   const teacherSelect = document.querySelector('#add-class-form select[name=teacher]');
  124   if (teacherSelect && teacherSelect.options.length <= 1) {
  125     // Could load employees with role='Teacher' here
  126     showToast('Tip: Assign a class teacher', 'info');
  127   }
  128 });
  129
  130 /* ── PUBLIC API (window-accessible for inline onclick) ─────── */
  131 window.Classes = {
  132   save:         saveClass,
  133   deleteClass:  deleteClass,
  134   openDetail:   openDetail,
  135 };
  136
  137 export default { saveClass, loadAllClasses, deleteClass, openDetail };