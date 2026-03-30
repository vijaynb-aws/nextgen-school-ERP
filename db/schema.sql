-- ============================================================
--  EduCore — Database Schema
--  File: db/schema.sql
--  Purpose: Run this ONCE to create all tables.
--           Works for both Supabase (paste in SQL editor)
--           and on-prem PostgreSQL (psql -f db/schema.sql).
--
--  Command: psql -U schooladmin -d schooldb -f db/schema.sql
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── INSTITUTE PROFILE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS institute (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  tagline     TEXT,
  phone       TEXT,
  email       TEXT,
  website     TEXT,
  address     TEXT,
  district    TEXT,
  state       TEXT,
  country     TEXT DEFAULT 'India',
  pin_code    TEXT,
  logo_url    TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row so the profile page can UPDATE instead of INSERT
INSERT INTO institute (id, name) VALUES (1, 'My School') ON CONFLICT DO NOTHING;

-- ── EMPLOYEES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  contact       TEXT,
  email         TEXT,
  role          TEXT,
  joining_date  DATE,
  salary        NUMERIC(10,2),
  supervisor    TEXT,
  pan           TEXT,
  gender        TEXT,
  experience    INTEGER,
  education     TEXT,
  dob           DATE,
  address       TEXT,
  photo_url     TEXT,
  status        TEXT DEFAULT 'Active',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── CLASSES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  section       TEXT,
  teacher_id    UUID REFERENCES employees(id) ON DELETE SET NULL,
  monthly_fees  NUMERIC(10,2) DEFAULT 0,
  max_students  INTEGER DEFAULT 35,
  room_no       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── SUBJECTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id      UUID REFERENCES classes(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  code          TEXT,
  teacher_id    UUID REFERENCES employees(id) ON DELETE SET NULL,
  periods_week  INTEGER DEFAULT 5,
  max_marks     INTEGER DEFAULT 100,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── STUDENTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  reg_number     TEXT UNIQUE NOT NULL,
  class          TEXT,
  dob            DATE,
  admission_date DATE DEFAULT CURRENT_DATE,
  gender         TEXT,
  blood_group    TEXT,
  mobile         TEXT,
  religion       TEXT,
  caste          TEXT,
  discount       TEXT,
  prev_school    TEXT,
  id_marks       TEXT,
  address        TEXT,
  note           TEXT,
  father_name    TEXT,
  father_contact TEXT,
  mother_name    TEXT,
  mother_contact TEXT,
  photo_url      TEXT,
  status         TEXT DEFAULT 'Active',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── FEES PARTICULARS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS fees_particulars (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  fee_type    TEXT DEFAULT 'Monthly',   -- Monthly|Annual|Term|One-time
  amount      NUMERIC(10,2) DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── DISCOUNT TYPES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS discount_types (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  percentage    NUMERIC(5,2) DEFAULT 0,
  applicable_on TEXT DEFAULT 'Tuition Fee',
  status        TEXT DEFAULT 'Active',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── MARKS GRADING ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marks_grading (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade       TEXT NOT NULL,
  min_marks   INTEGER NOT NULL,
  max_marks   INTEGER NOT NULL,
  remarks     TEXT
);

-- Default grading scale
INSERT INTO marks_grading (grade, min_marks, max_marks, remarks) VALUES
  ('A+', 90, 100, 'Outstanding'),
  ('A',  80,  89, 'Excellent'),
  ('B+', 70,  79, 'Very Good'),
  ('B',  60,  69, 'Good'),
  ('C',  50,  59, 'Average'),
  ('D',  35,  49, 'Below Average'),
  ('F',   0,  34, 'Fail')
ON CONFLICT DO NOTHING;

-- ── ACCOUNTS (income + expense) ────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount      NUMERIC(12,2) NOT NULL,
  account     TEXT,
  method      TEXT DEFAULT 'Cash',
  receipt_no  TEXT,
  voucher_no  TEXT,
  description TEXT,
  entry_date  DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES (for fast lookups) ──────────────────────────────
CREATE INDEX IF NOT EXISTS idx_students_class      ON students(class);
CREATE INDEX IF NOT EXISTS idx_students_status     ON students(status);
CREATE INDEX IF NOT EXISTS idx_accounts_type       ON accounts(type);
CREATE INDEX IF NOT EXISTS idx_accounts_entry_date ON accounts(entry_date);
CREATE INDEX IF NOT EXISTS idx_subjects_class      ON subjects(class_id);

-- ── ROW LEVEL SECURITY (Supabase only) ─────────────────────
-- Uncomment these after enabling RLS in Supabase dashboard:
--
-- ALTER TABLE students   ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE employees  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE accounts   ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Authenticated users only" ON students
--   FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users only" ON employees
--   FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users only" ON accounts
--   FOR ALL USING (auth.role() = 'authenticated');
