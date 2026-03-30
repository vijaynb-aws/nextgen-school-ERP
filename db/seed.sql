-- ============================================================
--  EduCore — Seed Data
--  File: db/seed.sql
--  Purpose: Insert sample data for development & testing.
--           Run AFTER schema.sql.
--
--  Command: psql -U schooladmin -d schooldb -f db/seed.sql
-- ============================================================

-- ── INSTITUTE ──────────────────────────────────────────────
UPDATE institute SET
  name       = 'Sunshine Public School',
  tagline    = 'Shaping Tomorrow''s Leaders',
  phone      = '+91 98765 43210',
  email      = 'admin@sunshineschool.edu',
  website    = 'https://sunshineschool.edu',
  address    = '123, Education Lane, Near City Park',
  district   = 'Bengaluru Urban',
  state      = 'Karnataka',
  country    = 'India',
  pin_code   = '560001'
WHERE id = 1;

-- ── EMPLOYEES ──────────────────────────────────────────────
INSERT INTO employees (name, contact, email, role, joining_date, salary, gender, education, status) VALUES
  ('Mrs. Sunita Rao',    '9876500001', 'sunita@school.edu',    'Teacher',        '2020-06-01', 45000, 'Female', 'M.Ed',   'Active'),
  ('Mr. Rajesh Kumar',   '9876500002', 'rajesh@school.edu',    'Teacher',        '2019-07-15', 42000, 'Male',   'B.Ed',   'Active'),
  ('Mrs. Priya Sharma',  '9876500003', 'priya@school.edu',     'Teacher',        '2021-04-10', 40000, 'Female', 'M.Sc',   'Active'),
  ('Mr. Anil Verma',     '9876500004', 'anil@school.edu',      'Teacher',        '2018-06-01', 44000, 'Male',   'B.Sc',   'Active'),
  ('Mrs. Lakshmi Iyer',  '9876500005', 'lakshmi@school.edu',   'Teacher',        '2017-07-01', 46000, 'Female', 'M.Ed',   'Active'),
  ('Mr. Arjun Mehta',    '9876500006', 'arjun@school.edu',     'Admin Staff',    '2022-01-10', 35000, 'Male',   'B.Com',  'Active'),
  ('Mrs. Kavya Nair',    '9876500007', 'kavya@school.edu',     'Accountant',     '2021-08-01', 38000, 'Female', 'M.Com',  'Active'),
  ('Mr. Deepak Singh',   '9876500008', 'deepak@school.edu',    'Support Staff',  '2023-03-01', 22000, 'Male',   'HSC',    'Active')
ON CONFLICT DO NOTHING;

-- ── CLASSES ────────────────────────────────────────────────
INSERT INTO classes (name, section, monthly_fees, max_students, room_no) VALUES
  ('Class VI',   'A, B', 2000, 35, 'Room 01'),
  ('Class VII',  'A, B', 2200, 35, 'Room 03'),
  ('Class VIII', 'A, B', 2400, 35, 'Room 05'),
  ('Class IX',   'A, B', 2800, 35, 'Room 07'),
  ('Class X',    'A, B', 3000, 35, 'Room 09')
ON CONFLICT DO NOTHING;

-- ── FEES PARTICULARS ───────────────────────────────────────
INSERT INTO fees_particulars (name, fee_type, amount) VALUES
  ('Tuition Fee',   'Monthly',  2500),
  ('Library Fee',   'Annual',   1000),
  ('Sports Fee',    'Annual',    800),
  ('Exam Fee',      'Term',      500),
  ('Lab Fee',       'Annual',   1200),
  ('Transport Fee', 'Monthly',  1500)
ON CONFLICT DO NOTHING;

-- ── DISCOUNT TYPES ─────────────────────────────────────────
INSERT INTO discount_types (name, percentage, applicable_on, status) VALUES
  ('Sibling Discount',  10,  'Tuition Fee', 'Active'),
  ('Merit Scholarship', 25,  'All Fees',    'Active'),
  ('Staff Ward',        50,  'Tuition Fee', 'Active'),
  ('BPL Category',      100, 'All Fees',    'Active')
ON CONFLICT DO NOTHING;

-- ── STUDENTS ───────────────────────────────────────────────
INSERT INTO students (name, reg_number, class, dob, gender, blood_group, mobile, father_name, mother_name, address, status, admission_date) VALUES
  ('Rahul Kumar',   '2026001', 'Class X-A',    '2010-01-15', 'Male',   'O+',  '9900001001', 'Suresh Kumar',   'Meena Kumar',   'MG Road, Bengaluru',        'Active',  '2026-03-28'),
  ('Priya Sharma',  '2026002', 'Class IX-B',   '2011-03-22', 'Female', 'A+',  '9900001002', 'Ashok Sharma',   'Rekha Sharma',  'Koramangala, Bengaluru',    'Active',  '2026-03-27'),
  ('Amit Verma',    '2026003', 'Class VIII-A', '2012-07-08', 'Male',   'B+',  '9900001003', 'Ravi Verma',     'Suman Verma',   'Jayanagar, Bengaluru',      'Pending', '2026-03-26'),
  ('Sneha Gupta',   '2026004', 'Class VII-B',  '2012-11-30', 'Female', 'AB+', '9900001004', 'Pavan Gupta',    'Anita Gupta',   'Indiranagar, Bengaluru',    'Active',  '2026-03-25'),
  ('Karan Patel',   '2026005', 'Class VI-A',   '2013-04-12', 'Male',   'O-',  '9900001005', 'Nilesh Patel',   'Sweta Patel',   'Whitefield, Bengaluru',     'Inactive','2026-03-20'),
  ('Ananya Singh',  '2026006', 'Class X-B',    '2010-08-05', 'Female', 'A-',  '9900001006', 'Vinod Singh',    'Preeti Singh',  'HSR Layout, Bengaluru',     'Active',  '2026-03-18'),
  ('Rohit Das',     '2026007', 'Class IX-A',   '2011-12-19', 'Male',   'B-',  '9900001007', 'Bikash Das',     'Mita Das',      'BTM Layout, Bengaluru',     'Active',  '2026-03-15'),
  ('Divya Nair',    '2026008', 'Class VIII-B', '2012-05-27', 'Female', 'O+',  '9900001008', 'Balan Nair',     'Usha Nair',     'Yelahanka, Bengaluru',      'Active',  '2026-03-10')
ON CONFLICT DO NOTHING;

-- ── ACCOUNTS (income + expense samples) ────────────────────
INSERT INTO accounts (title, type, amount, account, method, entry_date) VALUES
  ('Term 2 Fees Collection', 'income',  85000, 'Fees Income',    'Bank Transfer', '2026-03-28'),
  ('Donation - Alumni',      'income',  25000, 'Donation Income','Cash',          '2026-03-25'),
  ('Exam Fee Collection',    'income',  18500, 'Fees Income',    'UPI',           '2026-03-20'),
  ('Sports Fee',             'income',  12000, 'Fees Income',    'Cash',          '2026-03-15'),
  ('Staff Salaries',         'expense',120000, 'Salary Expense', 'Bank Transfer', '2026-03-28'),
  ('Electricity Bill',       'expense',  8500, 'Utilities',      'Online',        '2026-03-22'),
  ('Stationery Purchase',    'expense',  4200, 'Supplies',       'Cash',          '2026-03-18'),
  ('Maintenance Work',       'expense',  6500, 'Maintenance',    'Cheque',        '2026-03-12'),
  ('Term 1 Fees',            'income', 120000, 'Fees Income',    'Bank Transfer', '2026-02-28'),
  ('Internet Bill',          'expense',  2400, 'Utilities',      'Online',        '2026-02-22')
ON CONFLICT DO NOTHING;
