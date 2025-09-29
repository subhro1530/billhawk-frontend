import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import { notificationsAPI } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { toast } from "react-hot-toast";

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [filterUnread, setFilterUnread] = useState(false);
  const load = async () => {
    try {
      const r = await notificationsAPI.list(filterUnread ? 1 : undefined);
      setItems(r.data.data.notifications || []);
    } catch {}
  };
  useEffect(() => {
    if (!loading && !user) window.location.href = "/auth/login";
  }, [user, loading]);
  useEffect(() => {
    if (user) load();
  }, [user, filterUnread]);
  const mark = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      window.dispatchEvent(new CustomEvent("bh:notificationsChanged"));
      load();
    } catch {}
  };
  const markAll = async () => {
    try {
      await notificationsAPI.markAll();
      window.dispatchEvent(new CustomEvent("bh:notificationsChanged"));
      toast.success("All read");
      load();
    } catch {}
  };
  if (!user) return null;
  return (
    <Layout>
      <GlassCard
        title="Notifications"
        action={
          <div style={{ display: "flex", gap: ".4rem" }}>
            <button
              type="button"
              style={{ background: "#2b3152" }}
              onClick={() => setFilterUnread((f) => !f)}
            >
              {filterUnread ? "Show All" : "Unread"}
            </button>
            <button
              type="button"
              style={{ background: "#313863" }}
              onClick={markAll}
            >
              Mark All
            </button>
          </div>
        }
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((n) => (
            <li
              key={n.id}
              style={{
                padding: ".65rem .7rem",
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: ".45rem",
                opacity: n.read_at ? 0.55 : 1,
              }}
            >
              <div style={{ fontSize: ".7rem" }}>{n.title || n.type}</div>
              {!n.read_at && (
                <button
                  type="button"
                  style={{ background: "#252a44", fontSize: ".55rem" }}
                  onClick={() => mark(n.id)}
                >
                  Read
                </button>
              )}
            </li>
          ))}
          {items.length === 0 && (
            <li style={{ opacity: 0.6, fontSize: ".7rem" }}>None</li>
          )}
        </ul>
      </GlassCard>
    </Layout>
  );
}
