import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { API_BASE_URL } from "../utils/api";
import { useAuth } from "../utils/auth";
import NavBar from "../components/NavBar";

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <Head>
        <title>BillHawk – Smart Bill & Reminder Tracker</title>
        <meta
          name="description"
          content="Track bills, reminders & upgrades with BillHawk."
        />
        <link rel="icon" href="/icon.png" />
      </Head>
      <NavBar />
      <main
        className={styles.container}
        style={{ width: "100vw", maxWidth: "100vw", paddingInline: 0 }}
      >
        <section
          className={styles.hero}
          style={{
            width: "100vw",
            minHeight: "calc(100vh - 60px)",
            padding: "4rem clamp(1rem,4vw,4rem)",
          }}
        >
          <div className={styles.heroContent}>
            <img
              src="/logo.png"
              alt="BillHawk"
              style={{
                height: 72,
                width: 72,
                marginBottom: "1.25rem",
                filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.55))",
              }}
            />
            <h1 className={styles.heroTitle}>
              Track. Remind. Win Your Finances.
            </h1>
            <p className={styles.heroSubtitle}>
              BillHawk watches your upcoming bills & deadlines, auto‑generates
              reminders and helps you plan payments effortlessly.
            </p>
            <div className={styles.heroCTA}>
              {!user && (
                <>
                  <Link href="/auth/register">
                    <button>Get Started</button>
                  </Link>
                  <a href={`${API_BASE_URL}/api/v1/auth/google`}>
                    <button className={styles.googleBtn}>
                      <span>Sign in with Google</span>
                    </button>
                  </a>
                </>
              )}
              {user && (
                <Link href="/dashboard">
                  <button>Go to Dashboard</button>
                </Link>
              )}
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.dashboardPreview}>
              <div className={`${styles.previewCard}`}>
                <div className={styles.previewHeader} />
                <div className={styles.previewContent}>
                  <div className={styles.previewChart} />
                  <div className={styles.previewStats}>
                    <div className={styles.stat} />
                    <div className={styles.stat} />
                    <div className={styles.stat} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Features */}
        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Why BillHawk?</h2>
          <div className={styles.featuresGrid}>
            {[
              [
                "🧠",
                "Smart Auto-Reminders",
                "Automatic scheduling before due dates.",
              ],
              [
                "⚡",
                "Fast Imports",
                "Create bills from SMS & emails (parsed).",
              ],
              ["🔐", "Secure", "Token-based auth with revocation."],
              ["📈", "Upgrade Ready", "Premium plan unlocks more capacity."],
            ].map(([icon, title, desc]) => (
              <div key={title} className={styles.featureCard + " glass"}>
                <div className={styles.featureIcon}>{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Pricing */}
        <section className={styles.pricing}>
          <h2 className={styles.sectionTitle}>Pricing</h2>
          <div className={styles.pricingGrid}>
            <div className={`${styles.pricingCard} glass`}>
              <div className={styles.pricingHeader}>
                <h3>Free</h3>
              </div>
              <div className={styles.price}>
                $0<span>/mo</span>
              </div>
              <ul className={styles.featuresList}>
                <li>Up to 2 active bills</li>
                <li>Auto reminders</li>
                <li>Email & SMS import</li>
                <li>Google login</li>
              </ul>
              <Link href="/auth/register">
                <button>Start</button>
              </Link>
            </div>
            <div
              className={`${styles.pricingCard} ${styles.highlighted} glass`}
            >
              <div className={styles.pricingHeader}>
                <h3>Premium</h3>
              </div>
              <div className={styles.price}>
                $—<span>/mo (coming)</span>
              </div>
              <ul className={styles.featuresList}>
                <li>Unlimited bills</li>
                <li>Priority reminders</li>
                <li>Advanced analytics</li>
                <li>Early feature access</li>
              </ul>
              <Link href="/dashboard">
                <button>Upgrade (Stub)</button>
              </Link>
            </div>
          </div>
        </section>
        <footer
          style={{
            marginTop: "4rem",
            padding: "3rem clamp(1rem,4vw,4rem)",
            background: "rgba(15,17,29,0.55)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gap: "2.5rem",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          }}
        >
          <div>
            <img
              src="/logo.png"
              alt="BillHawk"
              style={{ height: 48, width: 48, marginBottom: ".75rem" }}
            />
            <div style={{ fontSize: ".75rem", opacity: 0.65, lineHeight: 1.5 }}>
              Smart tracking of payables & receivables with structured reminders
              and clean financial visibility.
            </div>
          </div>
          <div>
            <div className="footer-h">Product</div>
            <ul className="footer-list">
              <li>
                <Link href="/docs">Docs</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/contacts">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-h">Resources</div>
            <ul className="footer-list">
              <li>
                <a
                  href="https://status.example.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Status
                </a>
              </li>
              <li>
                <a
                  href="https://forms.gle/example"
                  target="_blank"
                  rel="noreferrer"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-h">Security</div>
            <ul className="footer-list">
              <li>Token auth</li>
              <li>Role control</li>
              <li>Revocation</li>
            </ul>
          </div>
        </footer>
      </main>
    </>
  );
}
