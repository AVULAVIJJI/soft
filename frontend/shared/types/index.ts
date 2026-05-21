// SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
// Shared TypeScript Types
// File: frontend/shared/types/index.ts

// ============================================================
// AUTH TYPES
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'hr'
  | 'trainer'
  | 'student'
  | 'recruiter'
  | 'client'
  | 'employee'
  | 'placement_officer'
  | 'guest';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: UserRole;
}

// ============================================================
// COURSE TYPES
// ============================================================

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  thumbnail_url?: string;
  preview_video_url?: string;
  level: CourseLevel;
  category_id: string;
  category_name?: string;
  price: number;
  discounted_price?: number;
  currency: string;
  duration_hours: number;
  total_lessons: number;
  language: string;
  instructor_id: string;
  instructor_name?: string;
  rating: number;
  total_ratings: number;
  total_students: number;
  tags: string[];
  status: CourseStatus;
  is_published: boolean;
  certificate_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  course?: Course;
  progress_percent: number;
  status: 'active' | 'completed' | 'cancelled';
  enrolled_at: string;
  completed_at?: string;
  last_accessed_at?: string;
  certificate_issued: boolean;
}

// ============================================================
// JOB TYPES
// ============================================================

export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'remote';
export type JobStatus = 'active' | 'closed' | 'paused' | 'draft';
export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'selected' | 'rejected' | 'withdrawn';

export interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo?: string;
  location: string;
  job_type: JobType;
  experience_min: number;
  experience_max: number;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  description: string;
  requirements: string[];
  skills_required: string[];
  benefits: string[];
  status: JobStatus;
  application_deadline?: string;
  total_applications: number;
  posted_by: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  job?: Job;
  applicant_id: string;
  applicant?: User;
  cover_letter?: string;
  resume_url?: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
}

// ============================================================
// CLIENT TYPES
// ============================================================

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id: string;
  client_name?: string;
  status: ProjectStatus;
  start_date: string;
  end_date?: string;
  budget: number;
  spent_amount: number;
  progress_percent: number;
  project_manager_id?: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  client_id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  currency: string;
  created_at: string;
}

// ============================================================
// EMPLOYEE / HR TYPES
// ============================================================

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'work_from_home' | 'on_leave' | 'holiday';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Employee {
  id: string;
  user_id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: string;
  department_name?: string;
  designation: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  join_date: string;
  basic_salary: number;
  status: 'active' | 'inactive' | 'resigned' | 'terminated';
  avatar_url?: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  attendance_date: string;
  check_in_time?: string;
  check_out_time?: string;
  status: AttendanceStatus;
  work_hours?: number;
  notes?: string;
}

export interface LeaveApplication {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: LeaveStatus;
  applied_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface Payslip {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  basic_salary: number;
  hra: number;
  allowances: number;
  gross_salary: number;
  pf_deduction: number;
  professional_tax: number;
  income_tax: number;
  total_deductions: number;
  net_salary: number;
  status: 'draft' | 'processed' | 'paid';
  payment_date?: string;
}

// ============================================================
// ANALYTICS TYPES
// ============================================================

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_revenue: number;
  monthly_revenue: number;
  total_courses: number;
  total_enrollments: number;
  total_placements: number;
  active_projects: number;
  open_tickets: number;
  pending_leaves: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// ============================================================
// PLACEMENT TYPES
// ============================================================

export interface PlacementDrive {
  id: string;
  company_name: string;
  company_logo?: string;
  drive_title: string;
  description?: string;
  roles_offered: string[];
  salary_package_lpa: number;
  eligibility_criteria: string;
  drive_date: string;
  registration_deadline: string;
  venue: string;
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled';
  total_registrations: number;
  total_selected: number;
  created_at: string;
}

export interface PlacedStudent {
  id: string;
  student_id: string;
  student_name: string;
  company_name: string;
  role: string;
  package_lpa: number;
  joining_date?: string;
  drive_id?: string;
  placed_at: string;
}
