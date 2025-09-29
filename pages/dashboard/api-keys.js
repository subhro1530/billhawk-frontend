import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import { apiKeysAPI } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { toast } from "react-hot-toast";

export default function ApiKeysPage() {
  const { user, loading } = useAuth();
  const [keys, setKeys] = useState([]);
  const [label, setLabel] = useState("");
  const load = async () => {
    try {
      const r = await apiKeysAPI.list();
      setKeys(r.data.data.keys || r.data.data.api_keys || []);
    } catch {}
  };
  useEffect(() => {
    if (!loading && !user) window.location.href = "/auth/login";
  }, [user, loading]);
  useEffect(() => {
    if (user) load();
  }, [user]);
  const create = async (e) => {
    e.preventDefault();
    try {
      await apiKeysAPI.create(label);
      toast.success("Key created");
      setLabel("");
      load();
    } catch {
      toast.error("Failed");
    }
  };
  const revoke = async (id) => {
    if (!confirm("Revoke key?")) return;
    try {
      await apiKeysAPI.revoke(id);
      toast.success("Revoked");
      load();
    } catch {}
  };
  if (!user) return null;
  return (
    <Layout>
      <GlassCard title="Create API Key">
        <form onSubmit={create} style={{ display: "flex", gap: ".5rem" }}>
          <input
            placeholder="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button disabled={!label.trim()} type="submit">
            Create
          </button>
        </form>
      </GlassCard>
      <GlassCard title="API Keys">
        <table className="table-min">
          <thead>
            <tr>
              <th>Label</th>
              <th>Key</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td>{k.label}</td>
                <td style={{ fontSize: ".55rem" }}>
                  {k.prefix}...{k.suffix}
                </td>
                <td>
                  <span className="tag" style={{ fontSize: ".5rem" }}>
                    {k.revoked_at ? "revoked" : "active"}
                  </span>
                </td>
                <td>
                  {!k.revoked_at && (
                    <button
                      type="button"
                      style={{ background: "#ff5470" }}
                      onClick={() => revoke(k.id)}
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {keys.length === 0 && (
              <tr>
                <td colSpan={4} style={{ opacity: 0.6 }}>
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
