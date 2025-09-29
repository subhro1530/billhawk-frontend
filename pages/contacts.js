import Head from "next/head";
import Layout from "../components/Layout";

export default function Contacts() {
  return (
    <Layout>
      <Head>
        <title>Contact • BillHawk</title>
      </Head>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>Contact & Support</h1>
        <p style={{ fontSize: ".8rem", opacity: 0.75 }}>
          For queries, feedback or issues reach us anytime.
        </p>
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "1rem 1.2rem",
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: ".6rem",
          }}
        >
          <div>
            <strong>Email:</strong>{" "}
            <a href="mailto:shaswata.ssaha@gmail.com">
              shaswata.ssaha@gmail.com
            </a>
          </div>
          <div>
            <strong>Support Form:</strong>{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://forms.gle/example"
            >
              https://forms.gle/example
            </a>
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://status.example.com"
            >
              status page (stub)
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
