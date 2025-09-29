import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const API_BASE_URL = "https://billhawk-backend.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json", // added
  },
});

// Request interceptor (removed custom X-Sent-Auth-Payload to satisfy CORS)
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Normalize payload for auth endpoints so backend never receives empty body
    if (
      config.method === "post" &&
      /\/auth\/(login|register|admin-login)$/.test(config.url || "")
    ) {
      let body = config.data || {};
      // In case a JSON string accidentally passed
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }
      if (config.url.endsWith("/admin-login")) {
        const code = (body.code ?? "").toString().trim();
        config.data = { code };
        if (!code) {
          console.warn("[auth.admin-login] empty code blocked");
        }
      } else {
        const email = (body.email ?? "").toString().trim();
        const password = (body.password ?? "").toString().trim();
        config.data = { email, password };
        if (!email || !password) {
          console.warn("[auth.sanitize] empty credentials being sent", {
            emailPresent: !!email,
            passwordPresent: !!password,
          });
        }
      }
      // ensure no legacy custom header stays (CORS fix)
      if (config.headers["X-Sent-Auth-Payload"])
        delete config.headers["X-Sent-Auth-Payload"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling + clearer auth validation messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    if (status === 400 && /\/auth\/(login|register|admin-login)$/.test(url)) {
      const backendMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Invalid credentials";
      toast.error(backendMsg);
    } else if (status === 404) {
      console.error("❌ 404 Error:", {
        url: error.config?.url,
        method: error.config?.method,
        message: error.response?.data?.error || "Endpoint not found",
      });
      toast.error("Resource not found");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("billhawk:api404", {
            detail: {
              url: error.config?.url,
              method: error.config?.method,
              time: Date.now(),
            },
          })
        );
      }
    } else if (status === 401) {
      Cookies.remove("token");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth")
      ) {
        window.location.href = "/auth/login";
      }
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default api;

// Specific API functions
export const GOOGLE_CALLBACK_URL = `${API_BASE_URL}/api/v1/auth/google/callback`;

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (email, password) =>
    api.post("/auth/register", { email, password }),
  logout: () => api.post("/auth/logout"),
  googleAuth: () => `${API_BASE_URL}/api/v1/auth/google`,
  // optional direct callback (normally backend handles redirect)
  googleCallback: () => GOOGLE_CALLBACK_URL,
  adminLogin: (code) => api.post("/auth/admin-login", { code }),
};

export const userAPI = {
  getProfile: () => api.get("/user/me"),
  updateProfile: (data) => api.put("/user/me", data),
};

export const billsAPI = {
  getAll: () => api.get("/bills"),
  getById: (id) => api.get(`/bills/${id}`),
  create: (data) => api.post("/bills", data),
  update: (id, data) => api.put(`/bills/${id}`, data),
  delete: (id) => api.delete(`/bills/${id}`),
  importSMS: (messages) => api.post("/bills/import/sms", { messages }),
  importEmail: (emails) => api.post("/bills/import/email", { emails }),
  search: (q) => api.get(`/bills/search`, { params: { q } }),
  settle: (id, data = {}) => api.post(`/bills/${id}/settle`, data),
  history: (id) => api.get(`/bills/${id}/history`),
  setCategory: (id, category_id) =>
    api.patch(`/bills/${id}/category`, { category_id }),
  exportCSV: (format = "csv") =>
    api.get(`/bills/export`, { params: { format } }),
  importManual: (items) => api.post("/bills/import/manual", { items }),
};

export const categoriesAPI = {
  list: () => api.get("/categories"),
  create: (name) => api.post("/categories", { name }),
};

export const recurringAPI = {
  create: (data) => api.post("/bills/recurring", data),
  list: () => api.get("/bills/recurring"),
};

export const remindersExtAPI = {
  bulk: (items) => api.post("/reminders/bulk", { items }),
  upcoming: (days = 30) => api.get("/reminders/upcoming", { params: { days } }),
  templates: () => api.get("/reminders/templates"),
  createTemplate: (data) => api.post("/reminders/templates", data),
};

export const notificationsAPI = {
  list: (unread) => api.get("/notifications", { params: { unread } }),
  markRead: (id) => api.post(`/notifications/${id}/read`),
  markAll: () => api.post("/notifications/read-all"),
  // stream: SSE handled client-side
};

export const analyticsAPI = {
  overview: () => api.get("/analytics/overview"),
  cashflow: (range = "YTD") =>
    api.get("/analytics/cashflow", { params: { range } }),
  aging: () => api.get("/analytics/aging"),
  categoryBreakdown: () => api.get("/analytics/category-breakdown"),
  monthlyTrend: () => api.get("/analytics/monthly-trend"),
  topCounterparties: () => api.get("/analytics/top-counterparties"),
};

export const userSecurityAPI = {
  updateSecurity: (data) => api.patch("/user/security", data),
};

export const apiKeysAPI = {
  list: () => api.get("/user/api-keys"),
  create: (label) => api.post("/user/api-keys", { label }),
  revoke: (id) => api.delete(`/user/api-keys/${id}`),
};

export const exportAPI = {
  start: () => api.post("/user/export"),
  jobStatus: (jobId) => api.get(`/user/export/${jobId}/status`),
  download: (jobId) =>
    api.get(`/user/export/${jobId}/download`, { responseType: "blob" }),
};

export const activityAPI = {
  list: () => api.get("/user/activity"),
};

export const premiumAPI = {
  getStatus: () => api.get("/premium/status"),
  subscribe: () => api.post("/premium/subscribe"),
  unsubscribe: () =>
    api.post("/premium/unsubscribe").catch((e) => {
      console.error("[premium.unsubscribe.api.error]", e?.response || e);
      throw e;
    }),
};
