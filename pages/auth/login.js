import { useState } from "react";
import { useAuth } from "../../utils/auth";
import Link from "next/link";
import { API_BASE_URL } from "../../utils/api";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const submit = (e) => {
    e.preventDefault();
    login(form.email, form.password);
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
          <button type="submit">Login</button>
          <a href={`${API_BASE_URL}/api/v1/auth/google`}>
            <button
              type="button"
              style={{ width: "100%", background: "#1f2340" }}
            >
              Google Sign In
            </button>
          </a>
        </form>
        <p style={{ marginTop: "1rem", fontSize: ".85rem", opacity: 0.8 }}>
          No account? <Link href="/auth/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
