import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GlassCard from "../../components/GlassCard";
import { exportAPI } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { toast } from "react-hot-toast";

export default function ExportPage() {
  const { user, loading } = useAuth();
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!loading && !user) window.location.href = "/auth/login";
  }, [user, loading]);

  const start = async () => {
    try {
      const r = await exportAPI.start();
      const j = r.data.data.jobId;
      setJobId(j);
      setStatus("pending");
      toast.success("Export started");
      poll(j);
    } catch {}
  };

  const poll = async (id) => {
    setPolling(true);
    const iv = setInterval(async () => {
      try {
        const s = await exportAPI.jobStatus(id);
        const st = s.data.data.job.status;
        setStatus(st);
        if (st === "completed") {
          clearInterval(iv);
          setPolling(false);
        }
      } catch {}
    }, 600);
  };

  const download = async () => {
    try {
      const blobRes = await exportAPI.download(jobId);
      const url = URL.createObjectURL(blobRes.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export_${jobId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  if (!user) return null;

  return (
    <Layout>
      <GlassCard title="Data Export">
        <div
          style={{ fontSize: ".65rem", opacity: 0.75, marginBottom: ".6rem" }}
        >
          Generate a JSON snapshot of your data (stub).
        </div>
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
          <button disabled={polling} onClick={start}>
            Start Export
          </button>
          <button
            disabled={status !== "completed"}
            onClick={download}
            style={{ background: "#2b3152" }}
          >
            Download
          </button>
          {jobId && (
            <span
              className="tag"
              style={{ background: "#2d3554", fontSize: ".55rem" }}
            >
              {jobId} • {status}
            </span>
          )}
        </div>
      </GlassCard>
    </Layout>
  );
}
