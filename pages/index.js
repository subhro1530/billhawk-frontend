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
                height: 54,
                width: 54,
                marginBottom: "1rem",
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
      </main>
    </>
  );
}
