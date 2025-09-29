import { useAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { buildGoogleOAuthURL } from "../../utils/api";

export default function GoogleDataPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  const fetchData = async () => {
    setBusy(true);
    try {
      const res = await api.get("/auth/google/fetch");
      setData(res.data);
      toast.success("Fetched");
    } catch {
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };

  if (!user) return null;
  return (
    <Layout>
      <GlassCard
        title="Google Data"
        action={
          <button type="button" onClick={fetchData} disabled={busy}>
            {busy ? "Loading..." : "Fetch"}
          </button>
        }
      >
        <p style={{ fontSize: ".7rem", opacity: 0.75, marginTop: 0 }}>
          Ensure you have authenticated with Google.&nbsp;
          <button
            type="button"
            style={{ background: "#2b3152", fontSize: ".6rem" }}
            onClick={() => (window.location.href = buildGoogleOAuthURL())}
          >
            Start Google OAuth
          </button>
        </p>
        <pre
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: ".9rem",
            borderRadius: 16,
            maxHeight: 400,
            overflow: "auto",
            fontSize: ".65rem",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </GlassCard>
    </Layout>
  );
}
