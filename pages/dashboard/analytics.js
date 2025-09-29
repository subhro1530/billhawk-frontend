import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import { analyticsAPI } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  useEffect(() => {
    if (!loading && !user) window.location.href = "/auth/login";
  }, [user, loading]);
  useEffect(() => {
    const load = async () => {
      try {
        const [o, m] = await Promise.all([
          analyticsAPI.overview(),
          analyticsAPI.monthlyTrend(),
        ]);
        setOverview(o.data.data);
        setTrend(m.data.data.trend || m.data.data || []);
      } catch {}
    };
    if (user) load();
  }, [user]);
  if (!user) return null;
  return (
    <Layout>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          marginBottom: "1.2rem",
        }}
      >
        {[
          "totalBills",
          "openPayables",
          "openReceivables",
          "settledThisMonth",
        ].map((k) => (
          <GlassCard key={k} title={k}>
            <div style={{ fontSize: "1.6rem", fontWeight: 600 }}>
              {overview?.[k] ?? "—"}
            </div>
          </GlassCard>
        ))}
      </div>
      <GlassCard title="Monthly Trend">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
            gap: ".6rem",
          }}
        >
          {trend.map((t, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: ".6rem .65rem",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: ".55rem",
                  textTransform: "uppercase",
                  letterSpacing: ".7px",
                  opacity: 0.6,
                }}
              >
                {t.month}
              </div>
              <div style={{ fontSize: ".85rem", fontWeight: 600 }}>
                {t.net ?? 0}
              </div>
            </div>
          ))}
          {trend.length === 0 && (
            <div style={{ opacity: 0.6 }}>No data yet</div>
          )}
        </div>
      </GlassCard>
    </Layout>
  );
}
