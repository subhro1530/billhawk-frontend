import { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import api, { billsAPI, categoriesAPI } from "../../utils/api";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import BillFormModal from "../../components/BillFormModal";
import ReminderFormModal from "../../components/ReminderFormModal";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function BillsPage() {
  const { user, loading, plan } = useAuth();
  const router = useRouter();
  const [bills, setBills] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [remBill, setRemBill] = useState(null);
  const [editBill, setEditBill] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState([]);

  const load = async () => {
    setFetching(true);
    try {
      const res = await api.get("/bills");
      setBills(res.data.data.bills);
    } catch {
      /* handled */
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) load();
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const r = await categoriesAPI.list();
        setCategories(r.data.data.categories || r.data.data || []);
      } catch {}
    })();
  }, []);

  const search = async () => {
    if (!q.trim()) return load();
    setFetching(true);
    try {
      const r = await billsAPI.search(q.trim());
      setBills(r.data.data.bills);
    } catch {}
    setFetching(false);
  };

  const del = async (id) => {
    if (!confirm("Delete bill?")) return;
    try {
      await api.delete(`/bills/${id}`);
      toast.success("Deleted");
      load();
    } catch {}
  };

  if (!user) return null;

  // helper splits
  const receivables = bills.filter((b) => (b.amount ?? 0) > 0);
  const payables = bills.filter((b) => (b.amount ?? 0) <= 0);

  return (
    <Layout>
      <GlassCard
        title="Bills"
        action={
          <button
            onClick={() => setShowBill(true)}
            disabled={plan === "free" && bills.length >= 2}
            style={{
              opacity: plan === "free" && bills.length >= 2 ? 0.55 : 1,
            }}
          >
            New
          </button>
        }
      >
        {plan === "free" && bills.length >= 2 && (
          <div
            className="tag"
            style={{ marginBottom: ".75rem", background: "#442b32" }}
          >
            Free plan limit reached (2)
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            marginBottom: ".6rem",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Search bills..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ maxWidth: 200 }}
          />
          <button
            type="button"
            onClick={search}
            style={{ background: "#2b3152" }}
          >
            🔍
          </button>
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                load();
              }}
              style={{ background: "#444a66" }}
            >
              ✖
            </button>
          )}
        </div>
        <div
          style={{
            display: "grid",
            gap: "1.1rem",
            gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))",
          }}
        >
          {
            /*
             * Receivables / Payables sections
             */ [
              { label: "Receivables", list: receivables, color: "#40d97d" },
              { label: "Payables", list: payables, color: "#ff6a7d" },
            ].map(({ label, list, color }) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14,
                  padding: ".75rem .85rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: ".4rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: ".6rem",
                      letterSpacing: ".8px",
                      textTransform: "uppercase",
                      opacity: 0.6,
                    }}
                  >
                    {label} ({list.length})
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="table-min" style={{ fontSize: ".68rem" }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Amt</th>
                        <th>Due</th>
                        <th>Created</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((b) => (
                        <tr key={b.id}>
                          <td>
                            {b.name}
                            {!!b.category_name && (
                              <span
                                style={{
                                  marginLeft: ".35rem",
                                  fontSize: ".5rem",
                                  padding: ".15rem .35rem",
                                  background: "rgba(255,255,255,0.08)",
                                  borderRadius: 6,
                                  letterSpacing: ".5px",
                                  textTransform: "uppercase",
                                }}
                              >
                                {b.category_name}
                              </span>
                            )}
                          </td>
                          <td style={{ color, fontWeight: 600 }}>
                            {b.amount ?? "-"}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {new Date(b.due_date).toLocaleDateString()}
                          </td>
                          <td style={{ whiteSpace: "nowrap", opacity: 0.6 }}>
                            {new Date(b.created_at).toLocaleDateString()}
                          </td>
                          <td
                            style={{
                              display: "flex",
                              gap: ".3rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <Link href={`/dashboard/bills/${b.id}`}>
                              <button
                                type="button"
                                style={{ background: "#313863" }}
                              >
                                Open
                              </button>
                            </Link>
                            <button
                              type="button"
                              style={{ background: "#252a44" }}
                              onClick={() => setRemBill(b)}
                            >
                              Rem
                            </button>
                            <button
                              type="button"
                              style={{ background: "#667eea" }}
                              onClick={() => setEditBill(b)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              style={{ background: "#ff5470" }}
                              onClick={() => del(b.id)}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))}
                      {list.length === 0 && !fetching && (
                        <tr>
                          <td colSpan={5} style={{ opacity: 0.55 }}>
                            None
                          </td>
                        </tr>
                      )}
                      {fetching && (
                        <tr>
                          <td colSpan={5} style={{ opacity: 0.55 }}>
                            Loading...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          }
        </div>
      </GlassCard>
      {showBill && (
        <BillFormModal
          onClose={() => setShowBill(false)}
          onCreated={(bill) => setBills([bill, ...bills])}
        />
      )}
      {remBill && (
        <ReminderFormModal
          bill={remBill}
          onClose={() => setRemBill(null)}
          onCreated={() => toast.success("Reminder created")}
        />
      )}
      {editBill && (
        <BillFormModal
          bill={editBill}
          onClose={() => setEditBill(null)}
          onUpdated={(updated) =>
            setBills(bills.map((x) => (x.id === updated.id ? updated : x)))
          }
        />
      )}
    </Layout>
  );
}
