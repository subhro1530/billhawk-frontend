import { useAuth } from "../utils/auth";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { notificationsAPI } from "../utils/api";

export default function NavBar() {
  const { user, logout, plan } = useAuth();
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const loadUnread = async () => {
    try {
      const r = await notificationsAPI.list(1);
      setUnread(r.data.data.notifications.length);
    } catch {
      setUnread(0);
    }
  };
  useEffect(() => {
    if (user) loadUnread();
  }, [user]);
  useEffect(() => {
    const handler = () => user && loadUnread();
    window.addEventListener("bh:notificationsChanged", handler);
    window.addEventListener("bh:planChanged", handler);
    return () => {
      window.removeEventListener("bh:notificationsChanged", handler);
      window.removeEventListener("bh:planChanged", handler);
    };
  }, [user]);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const premiumStyle =
    plan === "premium"
      ? {
          background:
            "linear-gradient(135deg,rgba(212,175,55,0.18),rgba(182,139,7,0.15))",
          color: "#e5d89a",
          border: "1px solid rgba(212,175,55,0.4)",
        }
      : {};

  const Icon = {
    dashboard: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M3 13h8V3H3v10Zm10 8h8v-6h-8v6Zm0-8h8V3h-8v10ZM3 21h8v-6H3v6Z"
        />
      </svg>
    ),
    bills: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="2" d="M6 2h9l5 5v15H6z" />
        <path stroke="currentColor" strokeWidth="2" d="M14 2v6h6" />
        <path stroke="currentColor" strokeWidth="2" d="M9 13h6M9 17h6M9 9h2" />
      </svg>
    ),
    reminders: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" />
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M12 6V3M5 13H3M21 13h-2M12 10v4l3 2"
        />
      </svg>
    ),
    analytics: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M4 20h16M7 16V8M12 16V4M17 16v-6"
        />
      </svg>
    ),
    recurring: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M12 6V3L8 7l4 4V8c3.3 0 6 2.7 6 6 0 1-.25 1.94-.7 2.76"
        />
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M12 18v3l4-4-4-4v3a4 4 0 0 1-4-4c0-.98.27-1.9.74-2.7"
        />
      </svg>
    ),
    categories: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM16 13h4v4h-4z"
        />
      </svg>
    ),
    apikeys: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M10 16h4l5-5-4-4-5 5v4Z"
        />
      </svg>
    ),
    export: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M12 3v14M6 9l6 6 6-6M5 21h14"
        />
      </svg>
    ),
    activity: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M3 12h4l2 7 4-14 2 7h4"
        />
      </svg>
    ),
    notifications: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M6 18h12l-1.5-2V11a4.5 4.5 0 0 0-9 0v5L6 18Z"
        />
        <path stroke="currentColor" strokeWidth="2" d="M10 21a2 2 0 0 0 4 0" />
      </svg>
    ),
    contacts: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M4 20c1.5-3.5 5-5 8-5s6.5 1.5 8 5"
        />
      </svg>
    ),
    docs: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="2" d="M6 3h9l5 5v13H6z" />
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M15 3v6h6M9 13h6M9 17h4"
        />
      </svg>
    ),
  };

  const linkBtn = (icon, label, path) => (
    <button
      type="button"
      onClick={() => {
        setOpen(false);
        router.push(path);
      }}
      style={{
        background: "transparent",
        justifyContent: "flex-start",
        color: router.pathname === path ? "#fff" : "rgba(255,255,255,0.78)",
        fontSize: ".68rem",
        padding: ".48rem .6rem",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        gap: ".55rem",
        lineHeight: 1.2,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color =
          router.pathname === path ? "#fff" : "rgba(255,255,255,0.78)")
      }
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div
      style={{
        padding: ".55rem .95rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(15,17,29,0.7)",
        backdropFilter: "blur(18px)",
        position: "sticky",
        top: 0,
        zIndex: 9000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".85rem",
          cursor: "pointer",
        }}
        onClick={() => router.push(user ? "/dashboard" : "/")}
      >
        <img
          src="/logo.png"
          alt="logo"
          style={{
            height: 44,
            width: 44,
            objectFit: "contain",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.55))",
          }}
        />
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.05rem",
            letterSpacing: ".5px",
          }}
        >
          BillHawk
        </span>
        <span className="tag" style={{ fontSize: ".55rem", ...premiumStyle }}>
          {plan}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/docs");
          }}
          style={{
            background: "transparent",
            color: "rgba(255,255,255,0.78)",
            fontSize: ".68rem",
            padding: ".4rem .65rem",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {Icon.docs}
          Docs
        </button>
      </div>
      <div style={{ display: "flex", gap: ".7rem", alignItems: "center" }}>
        {user && (
          <>
            <button
              type="button"
              onClick={() => router.push("/dashboard/notifications")}
              style={{
                position: "relative",
                background: "#2d3554",
                color: "#f2f6fb",
                fontSize: ".65rem",
              }}
            >
              🔔
              {unread > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "#ff5470",
                    borderRadius: "50%",
                    width: 16,
                    height: 16,
                    fontSize: ".55rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unread}
                </span>
              )}
            </button>
            <div style={{ position: "relative" }} ref={ref}>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".45rem",
                  background: "#2b3152",
                  color: "#f5f7fa",
                  padding: ".45rem .65rem",
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    fontSize: ".65rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {user.email[0]?.toUpperCase()}
                </span>
                ▾
              </button>
              {open && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + .4rem)",
                    background: "rgba(20,22,34,0.95)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: ".5rem .55rem .55rem",
                    width: 230,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow:
                      "0 4px 28px -6px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.05)",
                    zIndex: 12000,
                  }}
                >
                  {linkBtn(Icon.dashboard, "Dashboard", "/dashboard")}
                  {linkBtn(Icon.bills, "Bills", "/dashboard/bills")}
                  {linkBtn(Icon.reminders, "Reminders", "/dashboard/reminders")}
                  {linkBtn(Icon.analytics, "Analytics", "/dashboard/analytics")}
                  {linkBtn(Icon.recurring, "Recurring", "/dashboard/recurring")}
                  {linkBtn(
                    Icon.categories,
                    "Categories",
                    "/dashboard/categories"
                  )}
                  {linkBtn(Icon.apikeys, "API Keys", "/dashboard/api-keys")}
                  {linkBtn(Icon.export, "Export", "/dashboard/export")}
                  {linkBtn(Icon.activity, "Activity", "/dashboard/activity")}
                  {linkBtn(
                    Icon.notifications,
                    "Notifications",
                    "/dashboard/notifications"
                  )}
                  {linkBtn(Icon.contacts, "Contacts", "/contacts")}
                  {linkBtn(Icon.docs, "Docs", "/docs")}
                  <button
                    type="button"
                    onClick={logout}
                    style={{
                      background: "linear-gradient(135deg,#ff6a7d,#ff9f6a)",
                      marginTop: ".4rem",
                      fontSize: ".68rem",
                      fontWeight: 600,
                      display: "flex",
                      gap: ".55rem",
                      justifyContent: "center",
                    }}
                  >
                    {Icon.export}
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
