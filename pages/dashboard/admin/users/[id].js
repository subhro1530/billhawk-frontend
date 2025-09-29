import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../../components/Layout";
import GlassCard from "../../../../components/GlassCard";
import { adminAPI } from "../../../../utils/api";
import { useAuth } from "../../../../utils/auth";
import { toast } from "react-hot-toast";

export default function AdminUserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAdmin, user, loading } = useAuth();
  const [info, setInfo] = useState(null);
  const [bills, setBills] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/dashboard");
  }, [user, isAdmin, loading, router]);

  const load = async () => {
    if (!id) return;
    setPending(true);
    try {
      const [u, b, r] = await Promise.all([
        adminAPI.getUser(id),
        adminAPI.getUserBills(id),
        adminAPI.getUserReminders(id),
      ]);
      setInfo(u.data.data.user);
      setBills(b.data.data.bills);
      setReminders(r.data.data.reminders);
    } catch {
      toast.error("Load failed");
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (isAdmin && id) load();
  }, [isAdmin, id]);

  if (!isAdmin) return null;

  return (
    <Layout>
      <GlassCard
        title="User Detail"
        action={
          <button type="button" onClick={load} disabled={pending}>
            {pending ? "Refreshing..." : "Refresh"}
          </button>
        }
      >
        {!info && <div style={{ opacity: 0.6 }}>Loading...</div>}
        {info && (
          <div
            style={{
              display: "grid",
              gap: ".9rem",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              marginBottom: "1.5rem",
            }}
          >
            <Field label="Email" value={info.email} />
            <Field label="Plan" value={info.plan} />
            <Field label="Role" value={info.role} />
            <Field
              label="Created"
              value={new Date(info.created_at).toLocaleString()}
            />
          </div>
        )}
        <h4 style={{ margin: "0 0 .5rem" }}>Bills</h4>
        <table className="table-min" style={{ marginBottom: "1.5rem" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Due</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.amount ?? "-"}</td>
                <td>{new Date(b.due_date).toLocaleString()}</td>
                <td>{b.source_type}</td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr>
                <td colSpan={4} style={{ opacity: 0.6 }}>
                  None
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <h4 style={{ margin: "0 0 .5rem" }}>Reminders</h4>
        <table className="table-min">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Remind At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((r) => (
              <tr key={r.id}>
                <td style={{ fontSize: ".65rem", opacity: 0.7 }}>
                  {r.bill_id}
                </td>
                <td>{new Date(r.remind_at).toLocaleString()}</td>
                <td>
                  <span className="tag" style={{ fontSize: ".55rem" }}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {reminders.length === 0 && (
              <tr>
                <td colSpan={3} style={{ opacity: 0.6 }}>
                  None
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </Layout>
  );
}

function Field({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        padding: ".85rem .9rem",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontSize: ".55rem",
          letterSpacing: ".5px",
          opacity: 0.55,
          textTransform: "uppercase",
          marginBottom: ".25rem",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: ".8rem" }}>{value}</div>
    </div>
  );
}
