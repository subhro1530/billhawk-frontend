import { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import api, { remindersExtAPI } from "../../utils/api";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import { toast } from "react-hot-toast";

export default function RemindersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reminders, setReminders] = useState([]);
  const [fetching, setFetching] = useState(false);

  const load = async () => {
    setFetching(true);
    try {
      const res = await api.get("/reminders");
      setReminders(res.data.data.reminders);
    } catch {
      /* handled */
    } finally {
      setFetching(false);
    }
  };

  const loadUpcoming = async () => {
    setFetching(true);
    try {
      const r = await remindersExtAPI.upcoming(30);
      setReminders(r.data.data.reminders);
    } catch {}
    setFetching(false);
  };

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) load();
  }, [user]);

  const del = async (id) => {
    if (!confirm("Delete reminder?")) return;
    try {
      await api.delete(`/reminders/${id}`);
      toast.success("Deleted");
      load();
    } catch {}
  };

  if (!user) return null;

  return (
    <Layout>
      <GlassCard title="Reminders">
        <div style={{ display: "flex", gap: ".4rem", marginBottom: ".5rem" }}>
          <button
            type="button"
            onClick={load}
            style={{ background: "#2b3152", fontSize: ".6rem" }}
          >
            All
          </button>
          <button
            type="button"
            onClick={loadUpcoming}
            style={{ background: "#313863", fontSize: ".6rem" }}
          >
            Upcoming 30d
          </button>
        </div>
        <table className="table-min">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Remind At</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {reminders.map((r) => (
              <tr key={r.id}>
                <td style={{ fontSize: ".7rem", opacity: 0.75 }}>
                  {r.bill_id}
                </td>
                <td>{new Date(r.remind_at).toLocaleString()}</td>
                <td>
                  <span className="tag" style={{ fontSize: ".55rem" }}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    style={{ background: "#ff5470" }}
                    onClick={() => del(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {reminders.length === 0 && !fetching && (
              <tr>
                <td colSpan={4} style={{ opacity: 0.6 }}>
                  No reminders scheduled
                </td>
              </tr>
            )}
            {fetching && (
              <tr>
                <td colSpan={4} style={{ opacity: 0.6 }}>
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </Layout>
  );
}
