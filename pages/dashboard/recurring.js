import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import { recurringAPI } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { toast } from "react-hot-toast";

export default function RecurringPage() {
  const { user, loading } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    cadence: "monthly",
    next_due: "",
  });
  const load = async () => {
    try {
      const r = await recurringAPI.list();
      setList(r.data.data.recurring || r.data.data || []);
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
      await recurringAPI.create(form);
      toast.success("Created");
      setForm({ name: "", amount: "", cadence: "monthly", next_due: "" });
      load();
    } catch {
      toast.error("Failed");
    }
  };
  if (!user) return null;
  return (
    <Layout>
      <GlassCard title="New Recurring">
        <form
          onSubmit={create}
          style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}
        >
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            style={{ width: 120 }}
          />
          <select
            value={form.cadence}
            onChange={(e) => setForm({ ...form, cadence: e.target.value })}
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input
            type="datetime-local"
            value={form.next_due}
            onChange={(e) => setForm({ ...form, next_due: e.target.value })}
          />
          <button type="submit" disabled={!form.name || !form.next_due}>
            Create
          </button>
        </form>
      </GlassCard>
      <GlassCard title="Recurring Rules">
        <table className="table-min">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Cadence</th>
              <th>Next Due</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.amount}</td>
                <td>{r.cadence}</td>
                <td>{new Date(r.next_due).toLocaleDateString()}</td>
              </tr>
            ))}
            {list.length === 0 && (
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
