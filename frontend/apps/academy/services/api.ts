const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },
  getToken: () => localStorage.getItem("access_token"),
  getUser: () => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  },
  isAuthenticated: () => !!localStorage.getItem("access_token"),
};

export default API_URL;