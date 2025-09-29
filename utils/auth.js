import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import api from "./api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper to extract {user, token} regardless of backend envelope shape
  const extractAuth = (resp) => {
    const raw = resp?.data ?? {};
    const dataLayer = raw.data && typeof raw.data === "object" ? raw.data : raw;
    const token =
      dataLayer?.token || dataLayer?.access_token || dataLayer?.jwt || null;
    const user =
      dataLayer?.user || dataLayer?.profile || (dataLayer?.data?.user ?? null);
    return { user, token };
  };

  useEffect(() => {
    let token = Cookies.get("token");
    // Fallback: fragment/localStorage & query (?token=) legacy
    if (!token && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const qpToken = url.searchParams.get("token");
      const state = url.searchParams.get("state");
      // state may look like 'redir=https://...'
      if (qpToken) {
        token = qpToken;
      } else if (state && state.includes("token=")) {
        const maybe = state.split("token=").pop();
        if (maybe && maybe.length > 20) token = maybe;
      }
      if (token) {
        Cookies.set("token", token, { expires: 0.5 });
        if (window.location.pathname.startsWith("/auth/"))
          window.history.replaceState(null, "", url.pathname);
      } else {
        token = localStorage.getItem("authToken");
        if (token) Cookies.set("token", token, { expires: 0.5 });
      }
    }
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // If we redirected after login/register the Provider may mount before fetchUser
  // This watches for a token newly present while user still null.
  useEffect(() => {
    if (!loading && !user && Cookies.get("token")) {
      fetchUser();
    }
  }, [loading, user]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/user/me");
      const u =
        response?.data?.data?.user ||
        response?.data?.user ||
        response?.data?.data ||
        null;
      if (u) setUser(u);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const e = (email || "").trim();
    const p = (password || "").trim();
    if (!e || !p) {
      toast.error("Enter email & password");
      return { success: false };
    }
    try {
      const response = await api.post("/auth/login", { email: e, password: p });
      console.debug("[auth.login.response]", response?.data);
      const { user: u, token } = extractAuth(response);
      if (!token) {
        toast.error("No token in response");
        return { success: false };
      }
      Cookies.set("token", token, { expires: 0.5 });
      if (u) {
        setUser(u);
      } else {
        // fallback: load profile if user object absent
        await fetchUser();
      }
      toast.success("Welcome back!");
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (email, password) => {
    const e = (email || "").trim();
    const p = (password || "").trim();
    if (!e || !p) {
      toast.error("Enter email & password");
      return { success: false };
    }
    try {
      const response = await api.post("/auth/register", {
        email: e,
        password: p,
      });
      console.debug("[auth.register.response]", response?.data);
      const { user: u, token } = extractAuth(response);
      if (!token) {
        toast.error("No token in response");
        return { success: false };
      }
      Cookies.set("token", token, { expires: 0.5 });
      if (u) {
        setUser(u);
      } else {
        await fetchUser();
      }
      toast.success("Account created!");
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("token");
      setUser(null);
      router.push("/");
      toast.success("Logged out successfully");
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/user/me", profileData);
      setUser(response.data.data.user);
      toast.success("Profile updated successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Update failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const refreshProfile = fetchUser;

  const value = {
    user,
    loading,
    isAdmin: !!user && user.role === "admin",
    plan: user?.plan || "free",
    login,
    register,
    logout,
    updateProfile,
    fetchUser: refreshProfile, // ensures PlanUpgrade can await
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
