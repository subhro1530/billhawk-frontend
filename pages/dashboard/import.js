import { useAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

export default function ImportPage() {
  const { user, loading, plan } = useAuth();
  const router = useRouter();
  const [smsRaw, setSmsRaw] = useState("");
  const [emailRaw, setEmailRaw] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  const submitSMS = async () => {
    if (!smsRaw.trim()) return toast.error("Enter JSON array");
    try {
      setBusy(true);
      const messages = JSON.parse(smsRaw);
      const res = await api.post("/bills/import/sms", { messages });
      toast.success(`Imported ${res.data.data.imported} from SMS`);
    } catch (e) {
      toast.error("Import failed");
    } finally {
      setBusy(false);
    }
  };
  const submitEmail = async () => {
    if (!emailRaw.trim()) return toast.error("Enter JSON array");
    try {
      setBusy(true);
      const emails = JSON.parse(emailRaw);
      const res = await api.post("/bills/import/email", { emails });
      toast.success(`Imported ${res.data.data.imported} from Email`);
    } catch {
      toast.error("Import failed");
    } finally {
      setBusy(false);
    }
  };

  if (!user) return null;
  return (
    <Layout>
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
        }}
      >
        <GlassCard
          title="Import via SMS JSON"
          footer={
            <button
              type="button"
              disabled={busy || (plan === "free" && false)}
              onClick={submitSMS}
            >
              {busy ? "Working..." : "Import SMS"}
            </button>
          }
        >
          <p style={{ fontSize: ".7rem", opacity: 0.7, margin: 0 }}>
            Provide an array of objects each with parsed.name, parsed.dueDate
            (ISO) and optional parsed.amount.
          </p>
          <textarea
            rows={8}
            value={smsRaw}
            onChange={(e) => setSmsRaw(e.target.value)}
            placeholder='[{"parsed":{"name":"Power Bill","dueDate":"2025-10-01T10:00:00Z","amount":120.5}}]'
          />
        </GlassCard>
        <GlassCard
          title="Import via Email JSON"
          footer={
            <button type="button" disabled={busy} onClick={submitEmail}>
              {busy ? "Working..." : "Import Email"}
            </button>
          }
        >
          <p style={{ fontSize: ".7rem", opacity: 0.7, margin: 0 }}>
            Same shape as SMS import. This is a manual placeholder UI.
          </p>
          <textarea
            rows={8}
            value={emailRaw}
            onChange={(e) => setEmailRaw(e.target.value)}
            placeholder='[{"parsed":{"name":"Hosting","dueDate":"2025-11-15T12:00:00Z","amount":19}}]'
          />
        </GlassCard>
      </div>
    </Layout>
  );
}
