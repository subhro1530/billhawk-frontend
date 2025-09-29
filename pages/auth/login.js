import { useState, useEffect } from "react";
import { useAuth } from "../../utils/auth";
import Link from "next/link";
import { API_BASE_URL, buildGoogleOAuthURL } from "../../utils/api";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const submitting = !form.email.trim() || !form.password.trim();
  const submit = (e) => {
    e.preventDefault();
    if (submitting) return;
    login(form.email.trim(), form.password.trim());
  };

  // Google OAuth callback token handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#token=")) {
        const token = hash.slice(7);
        if (token) {
          // Store in cookie and localStorage for frontend auth
          try {
            document.cookie = `token=${token}; path=/; max-age=43200;`;
            localStorage.setItem("authToken", token);
          } catch {}
          // Remove hash from URL for cleanliness
          window.history.replaceState(null, "", window.location.pathname);
          window.location.replace("/dashboard");
        }
      }
    }
  }, []);

  const startGoogle = () => {
    const url = buildGoogleOAuthURL();
    window.location.href = url;
  };

  return (
    <div
      style={{ maxWidth: 420, margin: "4rem auto" }}
      className="glass-surface fade-in"
    >
      <div style={{ padding: "2.2rem 2.2rem 2rem" }}>
        <h1 style={{ margin: "0 0 1.25rem" }}>Login</h1>
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" disabled={submitting}>
            Login
          </button>
          <button
            type="button"
            onClick={startGoogle}
            style={{ width: "100%", background: "#1f2340" }}
          >
            Google Sign In
          </button>
        </form>
        <p style={{ marginTop: "1rem", fontSize: ".85rem", opacity: 0.8 }}>
          No account? <Link href="/auth/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
    </div>
  );
}
