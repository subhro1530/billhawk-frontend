import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import GlassCard from "../../../components/GlassCard";
import { categoriesAPI, billsAPI } from "../../../utils/api";
import { useAuth } from "../../../utils/auth";
import BillFormModal from "../../../components/BillFormModal";
import ReminderFormModal from "../../../components/ReminderFormModal";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

export default function BillDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();
  const [bill, setBill] = useState(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newReminder, setNewReminder] = useState(false);
  const [categories, setCategories] = useState([]);
  const [history, setHistory] = useState([]);
  const [settling, setSettling] = useState(false);

  const loadCats = async () => {
    try {
      const r = await categoriesAPI.list();
      setCategories(r.data.data.categories || r.data.data || []);
    } catch {}
  };
  const loadHistory = async (billId) => {
    try {
      const h = await billsAPI.history(billId);
      setHistory(h.data.data.history || []);
    } catch {}
  };

  const load = async () => {
    if (!id) return;
    setLoadingBill(true);
    try {
      const res = await api.get(`/bills/${id}`);
      setBill(res.data.data.bill);
      await loadCats();
      await loadHistory(id);
    } catch {
      /* handled */
    } finally {
      setLoadingBill(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user && id) load();
  }, [user, id]);

  const del = async () => {
    if (!confirm("Delete bill?")) return;
    try {
      await api.delete(`/bills/${id}`);
      toast.success("Bill deleted");
      router.push("/dashboard/bills");
    } catch {}
  };

  if (!user) return null;

  return (
    <Layout>
      <GlassCard
        title="Bill Detail"
        action={
          bill && (
            <div style={{ display: "flex", gap: ".5rem" }}>
              <button
                type="button"
                style={{ background: "#252a44" }}
                onClick={() => setNewReminder(true)}
              >
                Reminder
              </button>
              <button
                type="button"
                style={{ background: "#667eea" }}
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
              <button
                type="button"
                style={{ background: "#ff5470" }}
                onClick={del}
              >
                Delete
              </button>
            </div>
          )
        }
      >
        {loadingBill && <div style={{ opacity: 0.6 }}>Loading...</div>}
        {!loadingBill && !bill && (
          <div style={{ opacity: 0.6 }}>Bill not found or inaccessible.</div>
        )}
        {bill && (
          <div
            style={{
              display: "grid",
              gap: ".9rem",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            }}
          >
            <Detail label="Name" value={bill.name} />
            <Detail label="Amount" value={bill.amount ?? "-"} />
            <Detail
              label="Due"
              value={new Date(bill.due_date).toLocaleString()}
            />
            <Detail label="Source" value={bill.source_type} />
            <Detail label="Status" value={bill.status} />
            <Detail
              label="Updated"
              value={new Date(bill.updated_at).toLocaleString()}
            />
            <Detail
              label="Category"
              value={
                <select
                  value={bill.category_id || ""}
                  onChange={async (e) => {
                    const cid = e.target.value || null;
                    try {
                      await billsAPI.setCategory(bill.id, cid);
                      load();
                    } catch {}
                  }}
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              }
            />
          </div>
        )}
        {!bill?.settled_at && bill && (
          <div style={{ gridColumn: "1 / -1" }}>
            <button
              type="button"
              disabled={settling}
              style={{ background: "#40d97d" }}
              onClick={async () => {
                setSettling(true);
                try {
                  await billsAPI.settle(bill.id, {});
                  toast.success("Settled");
                  load();
                } catch {
                  toast.error("Settle failed");
                } finally {
                  setSettling(false);
                }
              }}
            >
              {settling ? "Settling..." : "Mark Settled"}
            </button>
          </div>
        )}
        {history.length > 0 && (
          <div style={{ gridColumn: "1 / -1" }}>
            <div
              style={{
                fontSize: ".55rem",
                textTransform: "uppercase",
                opacity: 0.55,
                letterSpacing: ".6px",
                margin: ".6rem 0 .3rem",
              }}
            >
              History
            </div>
            <table className="table-min" style={{ fontSize: ".65rem" }}>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>At</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td>{h.event || h.action}</td>
                    <td>{new Date(h.created_at || h.at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
      {edit && bill && (
        <BillFormModal
          bill={bill}
          onUpdated={(b) => setBill(b)}
          onClose={() => setEdit(false)}
        />
      )}
      {newReminder && bill && (
        <ReminderFormModal
          bill={bill}
          onCreated={() => toast.success("Reminder created")}
          onClose={() => setNewReminder(false)}
        />
      )}
    </Layout>
  );
}

function Detail({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        padding: ".9rem .95rem",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontSize: ".6rem",
          letterSpacing: ".6px",
          opacity: 0.55,
          textTransform: "uppercase",
          marginBottom: ".25rem",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: ".9rem" }}>{value}</div>
    </div>
  );
}
