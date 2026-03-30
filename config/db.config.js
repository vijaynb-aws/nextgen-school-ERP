/**
 * ============================================================
 *  EduCore — Database Configuration
 *  File: config/db.config.js
 *  Purpose: Central place to swap between Supabase (cloud)
 *           or local PostgreSQL (on-prem). Change ONE value
 *           here and the entire app picks it up.
 * ============================================================
 */

const DB_CONFIG = {

  // ── CHOOSE YOUR BACKEND ──────────────────────────────────
  // 'supabase'  → hosted cloud DB (recommended for quick start)
  // 'local'     → on-prem PostgreSQL via your own API
  provider: 'supabase',

  // ── SUPABASE SETTINGS ────────────────────────────────────
  supabase: {
    url:     'https://cprijhytfdoumkqpenss.supabase.co',
    anonKey: 'sb_publishable_iLs3GIfESeHO-K1JXNZLOw_mXa65eja',
  },

  // ── LOCAL / ON-PREM API SETTINGS ─────────────────────────
  local: {
    apiBase: 'http://localhost:3000/api',
    timeout: 8000,
  },

  // ── TABLE NAMES ──────────────────────────────────────────
  tables: {
    students:   'students',
    employees:  'employees',
    classes:    'classes',
    subjects:   'subjects',
    accounts:   'accounts',
    institute:  'institute',
    fees:       'fees_particulars',
    discounts:  'discount_types',
    grades:     'marks_grading',
  },

  // ── STORAGE BUCKETS ──────────────────────────────────────
  storage: {
    studentPhotos:  'student-photos',
    employeePhotos: 'employee-photos',
    schoolLogo:     'school-assets',
    documents:      'documents',
  },
};

export default DB_CONFIG;
