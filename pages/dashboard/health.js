import { useEffect } from "react";
import { useAuth } from "../../utils/auth";
import { useRouter } from "next/router";

// Deprecated health page – intentionally left blank per redesign.
export default function HealthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  return null;
}
