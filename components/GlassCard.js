export default function GlassCard({ title, action, children, footer, style }) {
  return (
    <div
      className="glass-surface fade-in"
      style={{
        padding: "1.4rem 1.5rem 1.2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
            {title}
          </h3>
          {action}
        </div>
      )}
      <div style={{ flex: 1 }}>{children}</div>
      {footer && <div style={{ paddingTop: ".4rem" }}>{footer}</div>}
    </div>
  );
}
