export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[0-9]{7,15}$/;
export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Invalid email address";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  return null;
}

export function validateFullName(name: string): string | null {
  if (!name) return "Full name is required";
  if (name.trim().length < NAME_MIN_LENGTH) return "Name too short";
  if (name.trim().length > NAME_MAX_LENGTH) return "Name too long";
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return null;
  if (!PHONE_REGEX.test(phone)) return "Invalid phone number";
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return null;
}

export function validateMinLength(value: string, min: number, fieldName: string): string | null {
  if (value && value.length < min) return `${fieldName} must be at least ${min} characters`;
  return null;
}

export function validateMaxLength(value: string, max: number, fieldName: string): string | null {
  if (value && value.length > max) return `${fieldName} cannot exceed ${max} characters`;
  return null;
}

export function validatePositiveNumber(value: number | string, fieldName: string): string | null {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num <= 0) return `${fieldName} must be a positive number`;
  return null;
}

export function validateDateRange(startDate: string, endDate: string): string | null {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime())) return "Invalid start date";
  if (isNaN(end.getTime())) return "Invalid end date";
  if (end < start) return "End date must be after start date";
  return null;
}

export interface FormErrors {
  [key: string]: string | null;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(error => error !== null);
}
