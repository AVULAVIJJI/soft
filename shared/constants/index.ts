export const APP_NAME = "Softmaster Technology Solutions Pvt Ltd";
export const APP_SHORT_NAME = "Softmaster";
export const COMPANY_ADDRESS = "No:07, George E De Silva Mawatha, Kandy 20000, Sri Lanka";
export const COMPANY_PHONE = "+94 81 220 4130";
export const COMPANY_EMAIL = "info@softmastergroup.com";
export const COMPANY_WEBSITE = "softmastertech.com";
export const FOUNDED_YEAR = 2000;
export const TOTAL_CLIENTS = 1700;

export const DOMAINS = {
  WEBSITE: "https://softmastertech.com",
  ACADEMY: "https://academy.softmastertech.com",
  JOBS: "https://jobs.softmastertech.com",
  CLIENT: "https://client.softmastertech.com",
  WORKSPACE: "https://workspace.softmastertech.com",
  EMPLOYEE: "https://employee.softmastertech.com",
  PLACEMENT: "https://placement.softmastertech.com",
  ADMIN: "https://admin.softmastertech.com",
  API: "https://api.softmastertech.com",
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  HR: "hr",
  TRAINER: "trainer",
  STUDENT: "student",
  RECRUITER: "recruiter",
  CLIENT: "client",
  EMPLOYEE: "employee",
  GUEST: "guest",
} as const;

export const COURSE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export const JOB_TYPES = {
  FULL_TIME: "full_time",
  PART_TIME: "part_time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
  REMOTE: "remote",
} as const;

export const PROJECT_STATUS = {
  PLANNING: "planning",
  ACTIVE: "active",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const TICKET_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export const LEAVE_TYPES = {
  ANNUAL: "annual",
  SICK: "sick",
  CASUAL: "casual",
  MATERNITY: "maternity",
  PATERNITY: "paternity",
  UNPAID: "unpaid",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  USERS: {
    LIST: "/api/users/",
    ME: "/api/users/me",
    DETAIL: (id: number) => `/api/users/${id}`,
    UPDATE: (id: number) => `/api/users/${id}`,
    ACTIVATE: (id: number) => `/api/users/${id}/activate`,
  },
  COURSES: {
    LIST: "/api/courses/",
    MY_COURSES: "/api/courses/my-courses",
    DETAIL: (id: number) => `/api/courses/${id}`,
    ENROLL: (id: number) => `/api/courses/${id}/enroll`,
    LESSONS: (id: number) => `/api/courses/${id}/lessons`,
  },
  JOBS: {
    LIST: "/api/jobs/",
    DETAIL: (id: number) => `/api/jobs/${id}`,
    APPLY: (id: number) => `/api/jobs/${id}/apply`,
    MY_APPLICATIONS: "/api/jobs/applications/my",
    MY_RESUMES: "/api/jobs/resumes/my",
  },
  PROJECTS: {
    LIST: "/api/projects/",
    DETAIL: (id: number) => `/api/projects/${id}`,
    TICKETS: "/api/projects/tickets/list",
    CREATE_TICKET: "/api/projects/tickets",
    INVOICES: "/api/projects/invoices/list",
  },
  ATTENDANCE: {
    LIST: "/api/attendance/",
    CHECK_IN: "/api/attendance/check-in",
    CHECK_OUT: "/api/attendance/check-out",
    TODAY: "/api/attendance/today-summary",
    LEAVES: "/api/attendance/leaves",
    APPLY_LEAVE: "/api/attendance/leaves",
  },
  PAYROLL: {
    LIST: "/api/payroll/",
    SLIP: (id: number) => `/api/payroll/${id}/slip`,
  },
  ANALYTICS: {
    DASHBOARD: "/api/analytics/dashboard",
    USERS: "/api/analytics/users",
    COURSES: "/api/analytics/courses",
    JOBS: "/api/analytics/jobs",
  },
  NOTIFICATIONS: {
    LIST: "/api/notifications/",
    READ: (id: number) => `/api/notifications/${id}/read`,
    READ_ALL: "/api/notifications/mark-all-read",
  },
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const COLORS = {
  PRIMARY: "#3b82f6",
  SECONDARY: "#8b5cf6",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#06b6d4",
  BG: "#0a0a0f",
  SURFACE: "rgba(255,255,255,0.04)",
  BORDER: "rgba(255,255,255,0.08)",
  TEXT: "#ffffff",
  TEXT_MUTED: "#6b7280",
  TEXT_SECONDARY: "#9ca3af",
} as const;
