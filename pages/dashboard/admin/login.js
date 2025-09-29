import { useState } from "react";
import { useAuth } from "../../../utils/auth";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const { user, fetchUser } = useAuth();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const c = code.trim();
    if (!c) return;
    setBusy(true);
    try {
      const res = await api.post("/auth/admin-login", { code: c });
      const token = res.data.data.token;
      Cookies.set("token", token, { expires: 0.5 });
      toast.success("Admin token issued");
      await fetchUser();
      router.push("/dashboard/admin/users");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Admin login failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  if (user?.role === "admin") {
    router.replace("/dashboard/admin/users");
    return null;
  }

  return (
    <div
      className="glass-surface fade-in"
      style={{ maxWidth: 420, margin: "6rem auto", padding: "2rem" }}
    >
      <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Admin Login</h1>
      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".8rem",
          marginTop: "1rem",
        }}
      >
        <input
          placeholder="Admin Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" disabled={busy || !code.trim()}>
          {busy ? "Authenticating..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}
