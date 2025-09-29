import Head from "next/head";
import NavBar from "../components/NavBar";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Docs() {
  return (
    <>
      <Head>
        <title>BillHawk Docs</title>
        <meta
          name="description"
          content="How to use BillHawk – bills, reminders, analytics & exports."
        />
      </Head>
      <NavBar />
      <main
        style={{
          maxWidth: 980,
          margin: "2.5rem auto 4rem",
          padding: "0 1.5rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.9rem" }}>
          BillHawk Documentation
        </h1>
        <p style={{ opacity: 0.7, fontSize: ".9rem", lineHeight: 1.5 }}>
          Quick guide to operate the platform.
        </p>
        <section style={{ marginTop: "2rem", display: "grid", gap: "1.8rem" }}>
          <div className="glass-surface" style={{ padding: "1.4rem 1.6rem" }}>
            <h2 style={{ margin: "0 0 .6rem", fontSize: "1.05rem" }}>
              1. Bills
            </h2>
            <p style={{ margin: 0, fontSize: ".8rem", lineHeight: 1.5 }}>
              Create receivable (incoming) or payable (outgoing) entries. You
              can search, import via SMS / Email or bulk JSON. Settling a bill
              records a history event. Negative amounts are treated as payables;
              positive as receivables.
            </p>
          </div>
          <div className="glass-surface" style={{ padding: "1.4rem 1.6rem" }}>
            <h2 style={{ margin: "0 0 .6rem", fontSize: "1.05rem" }}>
              2. Reminders
            </h2>
            <p style={{ margin: 0, fontSize: ".8rem", lineHeight: 1.5 }}>
              Automatic reminders are generated based on your profile offset.
              You may add manual reminders or bulk create. Upcoming 30 days
              filter helps focus on near-term actions.
            </p>
          </div>
          <div className="glass-surface" style={{ padding: "1.4rem 1.6rem" }}>
            <h2 style={{ margin: "0 0 .6rem", fontSize: "1.05rem" }}>
              3. Analytics
            </h2>
            <p style={{ margin: 0, fontSize: ".8rem", lineHeight: 1.5 }}>
              Overview surfaces counts and trend shows monthly aggregated
              amounts. Additional breakdown (aging, categories) is extendable.
            </p>
          </div>
          <div className="glass-surface" style={{ padding: "1.4rem 1.6rem" }}>
            <h2 style={{ margin: "0 0 .6rem", fontSize: "1.05rem" }}>
              4. Categories & Recurring
            </h2>
            <p style={{ margin: 0, fontSize: ".8rem", lineHeight: 1.5 }}>
              Tag bills logically. Recurring rules auto-generate bills and
              attach history entries. Adjust cadence & next due date to control
              generation timing.
            </p>
          </div>
          <div className="glass-surface" style={{ padding: "1.4rem 1.6rem" }}>
            <h2 style={{ margin: "0 0 .6rem", fontSize: "1.05rem" }}>
              5. API Keys & Export
            </h2>
            <p style={{ margin: 0, fontSize: ".8rem", lineHeight: 1.5 }}>
              Use API keys (revocable) for programmatic integrations. Exports
              run async; download once marked complete. CSV export for bills is
              also available.
            </p>
          </div>
          <div className="glass-surface" style={{ padding: "1.4rem 1.6rem" }}>
            <h2 style={{ margin: "0 0 .6rem", fontSize: "1.05rem" }}>
              6. Notifications & Activity
            </h2>
            <p style={{ margin: 0, fontSize: ".8rem", lineHeight: 1.5 }}>
              System events (expiration, generation) create notifications. Mark
              them read individually or all at once. Activity log provides audit
              trail for your account changes.
            </p>
          </div>
        </section>
        <div style={{ marginTop: "2.5rem", fontSize: ".75rem", opacity: 0.65 }}>
          Need support? <Link href="/contacts">Contact us</Link>.
        </div>
      </main>
    </>
  );
}
