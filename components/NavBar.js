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

  const linkBtn = (label, path) => (
    <button
      type="button"
      onClick={() => {
        setOpen(false);
        router.push(path);
      }}
      style={{
        background: "transparent",
        justifyContent: "flex-start",
        color: router.pathname === path ? "#ffffff" : "rgba(255,255,255,0.78)",
        fontSize: ".68rem",
        padding: ".45rem .6rem",
        borderRadius: 8,
        display: "flex",
        gap: ".5rem",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color =
          router.pathname === path ? "#fff" : "rgba(255,255,255,0.78)")
      }
    >
      {label}
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
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".55rem",
          cursor: "pointer",
        }}
        onClick={() => router.push(user ? "/dashboard" : "/")}
      >
        <img
          src="/logo.png"
          alt="logo"
          style={{ height: 28, width: 28, objectFit: "contain" }}
        />
        <span style={{ fontWeight: 600, fontSize: ".95rem" }}>BillHawk</span>
        <span
          className="tag"
          style={{
            textTransform: "uppercase",
            fontSize: ".55rem",
            letterSpacing: ".9px",
            ...premiumStyle,
          }}
        >
          {plan}
        </span>
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
                    padding: ".45rem .5rem",
                    width: 210,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow:
                      "0 4px 24px -6px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.04)",
                  }}
                >
                  {linkBtn("🏠 Dashboard", "/dashboard")}
                  {linkBtn("📄 Bills", "/dashboard/bills")}
                  {linkBtn("⏰ Reminders", "/dashboard/reminders")}
                  {linkBtn("📊 Analytics", "/dashboard/analytics")}
                  {linkBtn("🔁 Recurring", "/dashboard/recurring")}
                  {linkBtn("🏷 Categories", "/dashboard/categories")}
                  {linkBtn("🔑 API Keys", "/dashboard/api-keys")}
                  {linkBtn("📦 Export", "/dashboard/export")}
                  {linkBtn("🧾 Activity", "/dashboard/activity")}
                  {linkBtn("✉ Notifications", "/dashboard/notifications")}
                  {linkBtn("📬 Contacts", "/contacts")}
                  <button
                    type="button"
                    onClick={logout}
                    style={{
                      background: "linear-gradient(135deg,#ff6a7d,#ff9f6a)",
                      marginTop: ".35rem",
                      fontSize: ".65rem",
                      fontWeight: 600,
                    }}
                  >
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
