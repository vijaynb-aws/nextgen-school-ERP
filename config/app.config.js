/**
 * ============================================================
 *  EduCore — App Configuration
 *  File: config/app.config.js
 *  Purpose: All school-level settings, theme, and feature
 *           flags in one place. Edit here, not in HTML.
 * ============================================================
 */

const APP_CONFIG = {

  // ── SCHOOL INFO ──────────────────────────────────────────
  school: {
    name:      'Next Gen. International School',
    tagline:   'Shaping Tomorrow\'s Leaders',
    phone:     '+91 98765 43210',
    email:     'admin@sunshineschool.edu',
    website:   'https://sunshineschool.edu',
    address:   '123, Education Lane, Near City Park',
    district:  'Bengaluru Urban',
    state:     'Karnataka',
    country:   'India',
    pinCode:   '560001',
    logo:      '/assets/logo.png',   // path to school logo
  },

  // ── ACADEMIC YEAR ────────────────────────────────────────
  academic: {
    currentYear: '2025-2026',
    startMonth:  'June',
    endMonth:    'March',
    terms:       ['Term 1', 'Term 2', 'Term 3'],
  },

  // ── THEME ────────────────────────────────────────────────
  theme: {
    mode:        'dark',           // 'dark' | 'light'
    accentColor: '#4f8ef7',        // primary accent
    accentColor2:'#7c5cbf',        // secondary accent
    accentColor3:'#2ec9a5',        // success/green
    fontFamily:  "'Plus Jakarta Sans', sans-serif",
    dateFormat:  'DD/MM/YYYY',
    currency:    '₹',
    locale:      'en-IN',
  },

  // ── FEATURE FLAGS ────────────────────────────────────────
  features: {
    studentLogin:     true,
    employeeLogin:    true,
    onlinePayment:    false,   // set true when payment gateway ready
    smsNotifications: false,
    emailNotifications: true,
    attendanceModule: false,   // coming soon
    examModule:       false,
  },

  // ── PAGINATION ───────────────────────────────────────────
  pagination: {
    studentsPerPage:  25,
    employeesPerPage: 20,
    transactionsPerPage: 30,
  },

  // ── ROLES ────────────────────────────────────────────────
  roles: ['Admin', 'Principal', 'Teacher', 'Accountant', 'Support Staff'],

  // ── BLOOD GROUPS ─────────────────────────────────────────
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],

  // ── GENDERS ──────────────────────────────────────────────
  genders: ['Male', 'Female', 'Other'],
};

export default APP_CONFIG;
