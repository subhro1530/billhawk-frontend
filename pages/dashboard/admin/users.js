import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/auth";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import GlassCard from "../../../components/GlassCard";
import { adminAPI } from "../../../utils/api";
import { toast } from "react-hot-toast";

export default function AdminUsersPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/dashboard");
  }, [user, isAdmin, loading, router]);

  const load = async () => {
    setFetching(true);
    try {
      const res = await adminAPI.getUsers({ limit: 100 });
      setUsers(res.data.data.users);
    } catch {
      /* handled */
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const patchUser = async (id, body) => {
    try {
      await adminAPI.updateUser(id, body);
      toast.success("Updated");
      load();
    } catch {}
  };

  const disable = async (id) => {
    if (!confirm("Disable this user?")) return;
    try {
      await adminAPI.disableUser(id);
      toast.success("Disabled");
      load();
    } catch {}
  };

  const del = async (id) => {
    if (!confirm("Delete user (cascade)?")) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success("Deleted");
      load();
    } catch {}
  };

  if (!isAdmin) return null;

  return (
    <Layout>
      <GlassCard
        title="Users"
        action={
          <button
            type="button"
            style={{ background: "#252a44" }}
            onClick={load}
          >
            Refresh
          </button>
        }
      >
        <div style={{ overflowX: "auto" }}>
          <table className="table-min">
            <thead>
              <tr>
                <th>Email</th>
                <th>Plan</th>
                <th>Role</th>
                <th>Created</th>
                <th style={{ width: 250 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontSize: ".8rem" }}>{u.email}</td>
                  <td>{u.plan}</td>
                  <td>{u.role}</td>
                  <td style={{ fontSize: ".65rem", opacity: 0.6 }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td
                    style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}
                  >
                    <button
                      type="button"
                      style={{ background: "#252a44" }}
                      onClick={() =>
                        patchUser(u.id, {
                          plan: u.plan === "premium" ? "free" : "premium",
                        })
                      }
                    >
                      {u.plan === "premium" ? "Make Free" : "Make Premium"}
                    </button>
                    <button
                      type="button"
                      style={{ background: "#313863" }}
                      onClick={() =>
                        patchUser(u.id, {
                          role: u.role === "admin" ? "user" : "admin",
                        })
                      }
                    >
                      {u.role === "admin" ? "Demote" : "Promote"}
                    </button>
                    <button
                      type="button"
                      style={{ background: "#ff9966" }}
                      onClick={() => disable(u.id)}
                    >
                      Disable
                    </button>
                    <button
                      type="button"
                      style={{ background: "#ff5470" }}
                      onClick={() => del(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !fetching && (
                <tr>
                  <td colSpan={5} style={{ opacity: 0.6 }}>
                    No users
                  </td>
                </tr>
              )}
              {fetching && (
                <tr>
                  <td colSpan={5} style={{ opacity: 0.6 }}>
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </Layout>
  );
}
