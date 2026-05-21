export const formatCurrency = (amount: number, currency = "INR"): string => {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export const truncate = (str: string, length = 100): string =>
  str.length > length ? str.slice(0, length) + "..." : str;

export const capitalize = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ") : "";

export const getInitials = (name: string): string =>
  name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

export const debounce = <T extends (...args: any[]) => void>(fn: T, delay = 300) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

export const slugify = (str: string): string =>
  str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
