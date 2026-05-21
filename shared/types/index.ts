export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  created_at: string;
}

export type UserRole =
  | "super_admin" | "admin" | "hr" | "trainer"
  | "student" | "recruiter" | "client" | "employee" | "guest";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration_hours?: number;
  category?: string;
  tags?: string[];
  thumbnail_url?: string;
  status: "draft" | "published" | "archived";
  instructor_id: number;
  instructor_name?: string;
  enrolled_count: number;
  rating: number;
  created_at: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  video_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_free: boolean;
}

export interface Enrollment {
  id: number;
  course_id: number;
  student_id: number;
  course_title?: string;
  progress_percent: number;
  status: "active" | "completed" | "suspended";
  enrolled_at: string;
  completed_at?: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements?: string;
  location?: string;
  is_remote: boolean;
  job_type: "full_time" | "part_time" | "contract" | "internship" | "remote";
  salary_min?: number;
  salary_max?: number;
  experience_years?: number;
  skills_required?: string[];
  category?: string;
  status: "open" | "closed" | "paused";
  applications_count: number;
  created_at: string;
}

export interface JobApplication {
  id: number;
  job_id: number;
  job_title?: string;
  company?: string;
  applicant_id: number;
  applicant_name?: string;
  status: "applied" | "reviewed" | "shortlisted" | "interview" | "offered" | "hired" | "rejected";
  cover_letter?: string;
  applied_at: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  client_id: number;
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  progress_percent: number;
  budget?: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  client_id: number;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  ticket_number: string;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  project_id?: number;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  due_date?: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  status: "present" | "absent" | "half_day" | "late";
  total_hours?: number;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: "annual" | "sick" | "casual" | "maternity" | "paternity" | "unpaid";
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  total_days: number;
}

export interface PayrollRecord {
  id: number;
  employee_id: number;
  month: number;
  year: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  bonus: number;
  gross_salary: number;
  net_salary: number;
  tax_amount: number;
  status: "generated" | "approved" | "paid";
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  notification_type: "general" | "course" | "job" | "payment" | "system";
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  total_students: number;
  total_courses: number;
  total_jobs: number;
  total_enrollments: number;
  total_certificates: number;
  active_projects: number;
  placements_this_month: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
