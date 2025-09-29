import { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import PlanUpgrade from "../../components/PlanUpgrade";

export default function ProfilePage() {
  const { user, loading, updateProfile, fetchUser } = useAuth();
  const router = useRouter();
  const [reminderOffsetDays, setReminderOffsetDays] = useState(2);
  const [push, setPush] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setReminderOffsetDays(user.profile?.reminderOffsetDays ?? 2);
      setPush(user.profile?.notifications?.push ?? true);
      setWhatsapp(user.profile?.notifications?.whatsapp ?? false);
      setDisplayName(user.profile?.displayName ?? "");
    }
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    const data = {
      reminderOffsetDays: Number(reminderOffsetDays),
      notifications: { push, whatsapp },
      displayName: displayName.trim(),
    };
    const r = await updateProfile(data);
    if (r.success) {
      fetchUser();
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
        }}
      >
        <GlassCard title="Profile">
          <form
            onSubmit={save}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".9rem",
              maxWidth: 380,
            }}
          >
            <input value={user.email} disabled />
            <input
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <div>
              <label
                style={{
                  fontSize: ".65rem",
                  letterSpacing: ".5px",
                  opacity: 0.7,
                }}
              >
                Reminder Offset (days before due)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={reminderOffsetDays}
                onChange={(e) => setReminderOffsetDays(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "1.2rem",
                flexWrap: "wrap",
                fontSize: ".8rem",
              }}
            >
              <label
                style={{ display: "flex", gap: ".4rem", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={push}
                  onChange={(e) => setPush(e.target.checked)}
                  style={{ width: "auto" }}
                />
                Push
              </label>
              <label
                style={{ display: "flex", gap: ".4rem", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.checked)}
                  style={{ width: "auto" }}
                />
                WhatsApp
              </label>
            </div>
            <button type="submit">Save</button>
          </form>
        </GlassCard>
        <GlassCard title="Google Data (Stub)">
          <div style={{ fontSize: ".75rem", opacity: 0.75, lineHeight: 1.6 }}>
            Google OAuth endpoint is integrated on backend. After Google login,
            you can optionally fetch Gmail/Calendar by calling:
            <code style={{ display: "block", marginTop: ".4rem" }}>
              api.get("/auth/google/fetch")
            </code>
          </div>
        </GlassCard>
        <GlassCard title="Plan">
          <PlanUpgrade />
        </GlassCard>
      </div>
    </Layout>
  );
}
