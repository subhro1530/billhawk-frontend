import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../../utils/auth";
import { API_BASE_URL } from "../../utils/api";

/**
 * This page is the safe landing target after the backend finishes Google OAuth.
 * Backend should: set the session cookie (token) then `302` here (no JSON body).
 * If legacy flow still appends `#token=...`, we read it, set cookie, and proceed.
 */
export default function OAuthComplete() {
  const { user, loading, fetchUser } = useAuth();
  const [phase, setPhase] = useState("initial"); // initial | waiting | redirect | error
  const [elapsed, setElapsed] = useState(0);
  const [msg, setMsg] = useState("");

  // Handle legacy fragment (#token=...) OR rely on cookie already set by backend.
  useEffect(() => {
    let done = false;
    const init = async () => {
      setPhase("waiting");
      // 1. Legacy hash support
      if (typeof window !== "undefined") {
        const hash = window.location.hash;
        if (hash?.startsWith("#token=")) {
          const token = hash.slice(7);
          if (token) {
            try {
              Cookies.set("token", token, { expires: 0.5 });
            } catch {}
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      }
      // 2. Ensure we have a token cookie
      const token = Cookies.get("token");
      if (!token) {
        // Wait a brief moment in case backend race (cookie not flushed yet)
        await new Promise((r) => setTimeout(r, 600));
      }
      try {
        await fetchUser();
      } catch {
        /* fetchUser already handles 401 */
      }
      done = true;
    };
    init();
    // elapsed timer
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [fetchUser]);

  // Redirect once user present & not loading
  useEffect(() => {
    if (!loading && user) {
      setPhase("redirect");
      const t = setTimeout(() => router.replace("/dashboard"), 250);
      return () => clearTimeout(t);
    }
    if (!loading && !user && elapsed > 5) {
      setPhase("error");
    }
  }, [user, loading, elapsed, router]);

  useEffect(() => {
    const run = async () => {
      // 1. Token in hash (#token=...)
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash.startsWith("#token=")) {
        const tok = hash.slice(7);
        persistToken(tok);
        cleanUrl();
        setPhase("exchanging");
        await finalize();
        return;
      }

      // 2. Token in query (?token=...)
      const qp = new URL(window.location.href).searchParams.get("token");
      if (qp) {
        persistToken(qp);
        cleanUrl();
        setPhase("exchanging");
        await finalize();
        return;
      }

      // 3. Code in query -> exchange
      const code = new URL(window.location.href).searchParams.get("code");
      if (code) {
        setPhase("exchanging");
        try {
          const r = await fetch(
            `${API_BASE_URL}/api/v1/auth/google/callback?code=${encodeURIComponent(
              code
            )}`,
            { credentials: "include" }
          );
          // backend returns JSON with token & user
          const json = await r.json().catch(() => ({}));
          const tok =
            json?.token || json?.data?.token || json?.data?.data?.token || null;
          if (tok) {
            persistToken(tok);
          } else {
            setMsg("No token in exchange response");
            setPhase("error");
            return;
          }
          cleanUrl();
          await finalize();
        } catch (e) {
          setMsg("Exchange failed");
          setPhase("error");
        }
        return;
      }

      setMsg("No token or code present");
      setPhase("error");
    };
    run();
  }, []);

  useEffect(() => {
    if (!loading && user && phase !== "error") {
      setPhase("done");
      const t = setTimeout(() => (window.location.href = "/dashboard"), 300);
      return () => clearTimeout(t);
    }
  }, [user, loading, phase]);

  function persistToken(token) {
    try {
      Cookies.set("token", token, { expires: 0.5 });
      localStorage.setItem("authToken", token);
    } catch {}
  }
  function cleanUrl() {
    try {
      window.history.replaceState(null, "", "/auth/oauth-complete");
    } catch {}
  }
  async function finalize() {
    try {
      await fetchUser();
    } catch {}
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        className="glass-surface fade-in"
        style={{
          padding: "2rem 2.2rem",
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 1rem", fontSize: "1.2rem" }}>
          Completing Sign‑In
        </h1>
        {phase === "init" && (
          <p style={{ opacity: 0.7, fontSize: ".8rem" }}>
            Processing OAuth response…
          </p>
        )}
        {phase === "exchanging" && (
          <p style={{ opacity: 0.7, fontSize: ".8rem" }}>
            Exchanging / loading profile…
          </p>
        )}
        {phase === "done" && (
          <p style={{ opacity: 0.7, fontSize: ".8rem" }}>
            Redirecting to dashboard…
          </p>
        )}
        {phase === "error" && (
          <p style={{ color: "#ff6a7d", fontSize: ".8rem" }}>{msg}</p>
        )}
        {phase === "error" && (
          <div style={{ display: "flex", gap: ".6rem", marginTop: ".4rem" }}>
            <button
              type="button"
              onClick={() => (window.location.href = "/auth/login")}
              style={{ flex: 1, background: "#2b3152" }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              style={{ flex: 1 }}
            >
              Home
            </button>
          </div>
        )}
        {phase !== "error" && (
          <div
            style={{
              marginTop: "1.2rem",
              height: 6,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width:
                  phase === "done"
                    ? "100%"
                    : phase === "exchanging"
                    ? "70%"
                    : "30%",
                background: "linear-gradient(90deg,#667eea,#764ba2)",
                transition: "width .6s ease",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
