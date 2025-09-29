import { useState } from "react";
import { useAuth } from "../../utils/auth";
import Link from "next/link";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const submitting = !form.email.trim() || !form.password.trim();
  const submit = (e) => {
    e.preventDefault();
    if (submitting) return;
    register(form.email.trim(), form.password.trim());
  };
  return (
    <div
      style={{ maxWidth: 460, margin: "4rem auto" }}
      className="glass-surface fade-in"
    >
      <div style={{ padding: "2.2rem 2.2rem 2rem" }}>
        <h1 style={{ margin: "0 0 1.25rem" }}>Create Account</h1>
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
            Register
          </button>
        </form>
        <p style={{ marginTop: "1rem", fontSize: ".85rem", opacity: 0.8 }}>
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
