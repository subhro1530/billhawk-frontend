import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import { activityAPI } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function ActivityPage() {
  const { user, loading } = useAuth();
  const [rows, setRows] = useState([]);
  const load = async () => {
    try {
      const r = await activityAPI.list();
      setRows(r.data.data.activity || []);
    } catch {}
  };
  useEffect(() => {
    if (!loading && !user) window.location.href = "/auth/login";
  }, [user, loading]);
  useEffect(() => {
    if (user) load();
  }, [user]);
  if (!user) return null;
  return (
    <Layout>
      <GlassCard title="Recent Activity">
        <table className="table-min">
          <thead>
            <tr>
              <th>Action</th>
              <th>Entity</th>
              <th>At</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.action}</td>
                <td>
                  {r.entity_type}#{r.entity_id}
                </td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
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
