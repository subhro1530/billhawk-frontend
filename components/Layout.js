import Sidebar from "./Sidebar";
import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <NavBar />
        <div style={{ padding: "2rem", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
