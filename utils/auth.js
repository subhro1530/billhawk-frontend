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

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/user/me");
      setUser(response.data.data.user);
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
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data.data;

      Cookies.set("token", token, { expires: 0.5 }); // 12 hours
      setUser(user);
      toast.success("Welcome back!");
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await api.post("/auth/register", { email, password });
      const { user, token } = response.data.data;

      Cookies.set("token", token, { expires: 0.5 });
      setUser(user);
      toast.success("Account created successfully!");
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed";
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
