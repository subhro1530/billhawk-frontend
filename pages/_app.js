import "../styles/globals.css";
import { AuthProvider } from "../utils/auth";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    function on404(e) {
      const { url, method } = e.detail || {};
      console.log("[BillHawk][404]", method?.toUpperCase(), url);
      toast.error("Not found: " + url);
    }
    window.addEventListener("billhawk:api404", on404);
    return () => window.removeEventListener("billhawk:api404", on404);
  }, []);
  return (
    <AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "toast-custom",
          style: { background: "#1d2133", color: "#fff" },
        }}
      />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
