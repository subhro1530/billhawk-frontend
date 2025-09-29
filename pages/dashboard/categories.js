import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import { categoriesAPI } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { toast } from "react-hot-toast";

export default function CategoriesPage() {
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const load = async () => {
    try {
      const r = await categoriesAPI.list();
      setCategories(r.data.data.categories || r.data.data || []);
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
      await categoriesAPI.create(name);
      toast.success("Added");
      setName("");
      load();
    } catch {
      toast.error("Failed");
    }
  };
  if (!user) return null;
  return (
    <Layout>
      <GlassCard title="Add Category">
        <form onSubmit={create} style={{ display: "flex", gap: ".5rem" }}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" disabled={!name.trim()}>
            Save
          </button>
        </form>
      </GlassCard>
      <GlassCard title="Categories">
        <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
          {categories.map((c) => (
            <span
              key={c.id}
              style={{
                background: "rgba(255,255,255,0.08)",
                padding: ".35rem .55rem",
                borderRadius: 8,
                fontSize: ".65rem",
              }}
            >
              {c.name}
            </span>
          ))}
          {categories.length === 0 && (
            <div style={{ opacity: 0.6, fontSize: ".7rem" }}>None</div>
          )}
        </div>
      </GlassCard>
    </Layout>
  );
}
