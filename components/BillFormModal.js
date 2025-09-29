import { useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-hot-toast";

export default function BillFormModal({ onClose, onCreated, onUpdated, bill }) {
  const isEdit = !!bill;
  const [form, setForm] = useState({ name: "", amount: "", dueDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [flow, setFlow] = useState(
    (bill?.amount ?? 0) < 0 ? "payable" : "receivable"
  );

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: bill.name,
        amount: bill.amount ?? "",
        dueDate: bill.due_date
          ? new Date(bill.due_date).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [isEdit, bill]);

  const submit = async (e) => {
    e.preventDefault();
    let finalAmount = Number(form.amount || 0);
    if (flow === "payable" && finalAmount > 0) finalAmount = -finalAmount;
    if (flow === "receivable" && finalAmount < 0) finalAmount = -finalAmount;
    setSubmitting(true);
    try {
      let res;
      const payload = {
        name: form.name.trim(),
        amount: finalAmount,
        dueDate: form.dueDate,
      };
      if (isEdit) {
        res = await api.put(`/bills/${bill.id}`, payload);
        toast.success("Bill updated");
        onUpdated && onUpdated(res.data.data.bill);
      } else {
        res = await api.post("/bills", payload);
        toast.success("Bill created");
        onCreated(res.data.data.bill);
      }
      onClose();
    } catch {
      /* handled globally */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="glass-surface fade-in"
        style={{ maxWidth: 480, margin: "7vh auto 0", padding: "1.8rem" }}
      >
        <h2 style={{ margin: "0 0 1rem" }}>
          {isEdit ? "Edit Bill" : "New Bill"}
        </h2>
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}
        >
          <input
            placeholder="Bill name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div style={{ display: "flex", gap: ".75rem" }}>
            <label
              style={{
                fontSize: ".6rem",
                textTransform: "uppercase",
                opacity: 0.65,
              }}
            >
              Flow
              <select
                value={flow}
                onChange={(e) => setFlow(e.target.value)}
                style={{ marginTop: ".3rem" }}
              >
                <option value="receivable">Receivable (incoming)</option>
                <option value="payable">Payable (outgoing)</option>
              </select>
            </label>
            <input
              placeholder="Amount (optional)"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <input
            type="datetime-local"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <div
            style={{
              display: "flex",
              gap: ".6rem",
              justifyContent: "flex-end",
              marginTop: ".4rem",
            }}
          >
            <button
              type="button"
              style={{ background: "#252a44" }}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
