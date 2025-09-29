import { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import PlanUpgrade from "../../components/PlanUpgrade";
import BillFormModal from "../../components/BillFormModal";
import ReminderFormModal from "../../components/ReminderFormModal";

export default function DashboardHome() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ bills: 0, reminders: 0, upcoming: [] });
  const [showBill, setShowBill] = useState(false);
  const [remBill, setRemBill] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    async function load() {
      try {
        const [b, r] = await Promise.all([
          api.get("/bills"),
          api.get("/reminders"),
        ]);
        const bills = b.data.data.bills;
        const reminders = r.data.data.reminders;
        setStats({
          bills: bills.length,
          reminders: reminders.length,
          upcoming: bills.slice(0, 5),
        });
      } catch {}
    }
    if (user) load();
  }, [user]);

  if (!user) return null;

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          margin: "0 0 1.25rem",
          padding: ".85rem 1rem",
          background:
            "linear-gradient(135deg,rgba(40,46,72,0.55),rgba(28,32,54,0.55))",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 18,
        }}
      >
        <img
          src="/logo.png"
          alt="BillHawk"
          style={{
            height: 60,
            width: 60,
            objectFit: "contain",
            filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.6))",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              letterSpacing: ".6px",
            }}
          >
            BillHawk Dashboard
          </span>
          <span
            style={{
              fontSize: ".65rem",
              opacity: 0.65,
              letterSpacing: ".5px",
            }}
          >
            Overview of your finance reminders & bill flow
          </span>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          marginBottom: "2rem",
        }}
      >
        <GlassCard title="Bills">
          <div style={{ fontSize: "2.4rem", fontWeight: 700 }}>
            {stats.bills}
          </div>
          <div style={{ opacity: 0.6, fontSize: ".75rem" }}>Active bills</div>
        </GlassCard>
        <GlassCard title="Reminders">
          <div style={{ fontSize: "2.4rem", fontWeight: 700 }}>
            {stats.reminders}
          </div>
          <div style={{ opacity: 0.6, fontSize: ".75rem" }}>
            Scheduled reminders
          </div>
        </GlassCard>
        <GlassCard title="Upgrade">
          <PlanUpgrade />
        </GlassCard>
      </div>
      <GlassCard
        title="Upcoming Bills"
        action={
          <button
            type="button"
            style={{ background: "#2b3152" }}
            onClick={() => setShowBill(true)}
          >
            New
          </button>
        }
      >
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          }}
        >
          {["receivable", "payable"].map((group) => {
            const list = stats.upcoming.filter((b) =>
              group === "receivable"
                ? (b.amount ?? 0) > 0
                : (b.amount ?? 0) <= 0
            );
            return (
              <div
                key={group}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14,
                  padding: ".75rem .85rem",
                }}
              >
                <div
                  style={{
                    fontSize: ".6rem",
                    letterSpacing: ".8px",
                    textTransform: "uppercase",
                    opacity: 0.55,
                    marginBottom: ".35rem",
                  }}
                >
                  {group === "receivable" ? "Receivables" : "Payables"}
                </div>
                <table className="table-min" style={{ fontSize: ".7rem" }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Amt</th>
                      <th>Due</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((b) => (
                      <tr key={b.id}>
                        <td>{b.name}</td>
                        <td
                          style={{
                            color: (b.amount ?? 0) > 0 ? "#40d97d" : "#ff6a7d",
                            fontWeight: 600,
                          }}
                        >
                          {b.amount ?? "-"}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {new Date(b.due_date).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            type="button"
                            style={{
                              background: "#252a44",
                              fontSize: ".58rem",
                              padding: ".35rem .5rem",
                            }}
                            onClick={() => setRemBill(b)}
                          >
                            Reminder
                          </button>
                        </td>
                      </tr>
                    ))}
                    {list.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ opacity: 0.5 }}>
                          None
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </GlassCard>
      {showBill && (
        <BillFormModal
          onClose={() => setShowBill(false)}
          onCreated={() => {
            setShowBill(false);
            window.location.reload();
          }}
        />
      )}
      {remBill && (
        <ReminderFormModal
          bill={remBill}
          onCreated={() => setRemBill(null)}
          onClose={() => setRemBill(null)}
        />
      )}
    </Layout>
  );
}
