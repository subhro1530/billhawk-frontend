import { useState } from "react";
import api from "../utils/api";
import { toast } from "react-hot-toast";

export default function ReminderFormModal({ bill, onClose, onCreated }) {
  const [remindAt, setRemindAt] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!remindAt) return toast.error("Select schedule time");
    setSaving(true);
    try {
      const res = await api.post("/reminders", {
        billId: bill.id,
        remindAt,
      });
      toast.success("Reminder scheduled");
      onCreated(res.data.data.reminder);
      onClose();
    } catch {
      /* handled */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="glass-surface fade-in"
        style={{ maxWidth: 460, margin: "15vh auto 0", padding: "1.7rem" }}
      >
        <h2 style={{ margin: "0 0 1rem" }}>
          New Reminder <span style={{ opacity: 0.55 }}>({bill.name})</span>
        </h2>
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}
        >
          <input
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: ".6rem",
            }}
          >
            <button
              type="button"
              style={{ background: "#252a44" }}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
