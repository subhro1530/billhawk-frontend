import api from "../utils/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../utils/auth";
import { premiumAPI } from "../utils/api";
import { useState } from "react";

export default function PlanUpgrade() {
  const { plan, fetchUser } = useAuth();
  const [busy, setBusy] = useState(false); // add local busy state

  const upgrade = async () => {
    if (plan === "premium" || busy) return;
    setBusy(true);
    try {
      await premiumAPI.subscribe();
      await fetchUser();
      window.dispatchEvent(new CustomEvent("bh:planChanged"));
      toast.success("Premium activated");
    } catch {
      toast.error("Activate failed");
    } finally {
      setBusy(false);
    }
  };

  const deactivate = async () => {
    if (plan !== "premium" || busy) return;
    setBusy(true);
    try {
      await premiumAPI.unsubscribe();
      await fetchUser();
      window.dispatchEvent(new CustomEvent("bh:planChanged"));
      toast.success("Premium deactivated");
    } catch {
      toast.error("Deactivate failed");
    } finally {
      setBusy(false);
    }
  };

  const isPremium = plan === "premium";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".55rem" }}>
      <div style={{ fontSize: ".7rem", opacity: 0.78, lineHeight: 1.35 }}>
        {isPremium
          ? "Premium active – unlimited bills & advanced insights."
          : "Upgrade to remove limits & unlock analytics (stub)."}
      </div>
      <button
        onClick={isPremium ? deactivate : upgrade}
        disabled={busy}
        style={{
          maxWidth: 220,
          fontWeight: 600,
          letterSpacing: ".3px",
          opacity: busy ? 0.65 : 1,
          cursor: busy ? "not-allowed" : "pointer",
          background: isPremium
            ? "linear-gradient(135deg,#d4af37,#b68b07)"
            : "linear-gradient(135deg,#5564e6,#7c48b5)",
          color: "#fff",
          boxShadow: isPremium
            ? "0 0 0 1px rgba(212,175,55,0.35),0 4px 18px -4px rgba(212,175,55,0.5)"
            : "0 0 0 1px rgba(120,120,255,0.25),0 4px 18px -4px rgba(120,120,255,0.4)",
        }}
      >
        {busy
          ? "Please wait..."
          : isPremium
          ? "Deactivate Premium"
          : "Upgrade to Premium"}
      </button>
    </div>
  );
}
