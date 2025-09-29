import Link from "next/link";
import { useAuth } from "../utils/auth";
import { useRouter } from "next/router";

const links = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/bills", label: "Bills", icon: "🧾" },
  { href: "/dashboard/reminders", label: "Reminders", icon: "⏰" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  { href: "/dashboard/import", label: "Import", icon: "📥" },
  { href: "/dashboard/google", label: "Google", icon: "🧩" },
  { href: "/dashboard/health", label: "Health", icon: "❤️" },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  return (
    <aside
      style={{
        width: 220,
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(15,17,29,0.55)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div style={{ marginBottom: "1rem", fontSize: ".7rem", opacity: 0.6 }}>
        NAVIGATION
      </div>
      {links.map((l) => {
        const active = router.pathname === l.href;
        return (
          <Link key={l.href} href={l.href}>
            <div
              style={{
                padding: ".75rem .9rem",
                borderRadius: 14,
                display: "flex",
                gap: ".65rem",
                alignItems: "center",
                cursor: "pointer",
                fontSize: ".9rem",
                background: active
                  ? "linear-gradient(135deg,#667eea,#764ba2)"
                  : "transparent",
                transition: "var(--transition)",
              }}
              className="fade-in"
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </div>
          </Link>
        );
      })}
      {isAdmin && (
        <>
          <div
            style={{
              margin: "1.5rem 0 .4rem",
              fontSize: ".7rem",
              opacity: 0.6,
            }}
          >
            ADMIN
          </div>
          <Link href="/dashboard/admin/users">
            <div
              style={{
                padding: ".75rem .9rem",
                borderRadius: 14,
                display: "flex",
                gap: ".65rem",
                alignItems: "center",
                cursor: "pointer",
                fontSize: ".9rem",
                background: router.pathname.startsWith("/dashboard/admin")
                  ? "linear-gradient(135deg,#ff5470,#ff9966)"
                  : "transparent",
              }}
            >
              <span>🛡️</span>
              <span>Users</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/login">
            <div
              style={{
                padding: ".75rem .9rem",
                borderRadius: 14,
                display: "flex",
                gap: ".65rem",
                alignItems: "center",
                cursor: "pointer",
                fontSize: ".9rem",
                background:
                  router.pathname === "/dashboard/admin/login"
                    ? "linear-gradient(135deg,#ff5470,#ff9966)"
                    : "transparent",
              }}
            >
              <span>🔑</span>
              <span>Admin Auth</span>
            </div>
          </Link>
        </>
      )}
    </aside>
  );
}
