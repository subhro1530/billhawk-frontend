import Link from "next/link";
import { useAuth } from "../utils/auth";
import { useRouter } from "next/router";

const ICONS = {
  overview: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        stroke="currentColor"
        strokeWidth="2"
        d="M3 13h8V3H3v10Zm10 8h8v-6h-8v6Zm0-8h8V3h-8v10ZM3 21h8v-6H3v6Z"
      />
    </svg>
  ),
  bills: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeWidth="2" d="M6 2h9l5 5v15H6z" />
      <path stroke="currentColor" strokeWidth="2" d="M14 2v6h6" />
      <path stroke="currentColor" strokeWidth="2" d="M9 13h6M9 17h6M9 9h2" />
    </svg>
  ),
  reminders: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        stroke="currentColor"
        strokeWidth="2"
        d="M12 6V3M5 13H3M21 13h-2M12 10v4l3 2"
      />
    </svg>
  ),
  profile: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        stroke="currentColor"
        strokeWidth="2"
        d="M4 20c1.5-3.5 5-5 8-5s6.5 1.5 8 5"
      />
    </svg>
  ),
  import: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeWidth="2" d="M12 3v14M6 11l6 6 6-6" />
      <path stroke="currentColor" strokeWidth="2" d="M5 21h14" />
    </svg>
  ),
  google: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path stroke="currentColor" strokeWidth="2" d="M12 7v10M7 12h10" />
    </svg>
  ),
  health: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        stroke="currentColor"
        strokeWidth="2"
        d="M4 12c0-5 4-8 8-8s8 3 8 8-4 8-8 8-8-3-8-8Z"
      />
      <path stroke="currentColor" strokeWidth="2" d="M8 12h2l1 3 2-6 1 3h2" />
    </svg>
  ),
  adminUsers: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        stroke="currentColor"
        strokeWidth="2"
        d="M3 21c.8-4 3.2-6 5-6s4.2 2 5 6M14 15c2 0 4.2 2 5 6"
      />
    </svg>
  ),
  adminAuth: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeWidth="2" d="M5 11h14v10H5z" />
      <path stroke="currentColor" strokeWidth="2" d="M9 11V7a3 3 0 0 1 6 0v4" />
    </svg>
  ),
};

const links = [
  { href: "/dashboard", label: "Overview", icon: ICONS.overview },
  { href: "/dashboard/bills", label: "Bills", icon: ICONS.bills },
  { href: "/dashboard/reminders", label: "Reminders", icon: ICONS.reminders },
  { href: "/dashboard/profile", label: "Profile", icon: ICONS.profile },
  { href: "/dashboard/import", label: "Import", icon: ICONS.import },
  { href: "/dashboard/google", label: "Google", icon: ICONS.google },
  { href: "/dashboard/health", label: "Health", icon: ICONS.health },
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
                padding: ".7rem .85rem",
                borderRadius: 14,
                display: "flex",
                gap: ".65rem",
                alignItems: "center",
                cursor: "pointer",
                fontSize: ".8rem",
                background: active
                  ? "linear-gradient(135deg,#5564e6,#764ba2)"
                  : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.72)",
                fontWeight: active ? 600 : 500,
                transition: "var(--transition)",
              }}
            >
              <span style={{ display: "flex", color: "currentColor" }}>
                {l.icon}
              </span>
              <span style={{ lineHeight: 1.15 }}>{l.label}</span>
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
                padding: ".7rem .85rem",
                borderRadius: 14,
                display: "flex",
                gap: ".65rem",
                alignItems: "center",
                cursor: "pointer",
                fontSize: ".8rem",
                background: router.pathname.startsWith("/dashboard/admin/users")
                  ? "linear-gradient(135deg,#ff5470,#ff9966)"
                  : "transparent",
                color: router.pathname.startsWith("/dashboard/admin/users")
                  ? "#fff"
                  : "rgba(255,255,255,0.75)",
              }}
            >
              <span>{ICONS.adminUsers}</span>
              <span>Users</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/login">
            <div
              style={{
                padding: ".7rem .85rem",
                borderRadius: 14,
                display: "flex",
                gap: ".65rem",
                alignItems: "center",
                cursor: "pointer",
                fontSize: ".8rem",
                background:
                  router.pathname === "/dashboard/admin/login"
                    ? "linear-gradient(135deg,#ff5470,#ff9966)"
                    : "transparent",
                color:
                  router.pathname === "/dashboard/admin/login"
                    ? "#fff"
                    : "rgba(255,255,255,0.75)",
              }}
            >
              <span>{ICONS.adminAuth}</span>
              <span>Admin Auth</span>
            </div>
          </Link>
        </>
      )}
    </aside>
  );
}
