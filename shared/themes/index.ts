export const darkTheme = {
  bg: "#0a0a0f",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  textMuted: "#6b7280",
  textSecondary: "#9ca3af",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
};

export const lightTheme = {
  bg: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  textMuted: "#64748b",
  textSecondary: "#475569",
  primary: "#2563eb",
  secondary: "#7c3aed",
  success: "#15803d",
  warning: "#d97706",
  error: "#dc2626",
  info: "#0284c7",
};

export type Theme = typeof darkTheme;
