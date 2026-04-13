"use client";

import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/lib/adminService";
import { Search, ChevronLeft, ChevronRight, Save, Trash2, MessageCircle } from "lucide-react";

const PAGE_SIZE = 15;

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";

export default function UserManagePage() {
  const [courseLabels, setCourseLabels] = useState({});
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [drafts, setDrafts] = useState({});

  const loadUsers = useCallback(async () => {
    setListError("");
    setLoading(true);
    try {
      const data = await adminService.getUsers({
        page,
        limit: PAGE_SIZE,
        search: appliedSearch || undefined,
      });
      const list = data.users || [];
      setUsers(list);
      setTotal(data.total ?? 0);
      const next = {};
      list.forEach((u) => {
        next[u._id] = {
          role: u.role,
          paymentStatus: u.paymentStatus,
          profileCompleted: Boolean(u.profileCompleted),
        };
      });
      setDrafts(next);
    } catch (error) {
      console.error(error);
      setListError(
        error.response?.data?.message ||
          error.message ||
          "Could not load users."
      );
      setUsers([]);
      setTotal(0);
      setDrafts({});
    } finally {
      setLoading(false);
    }
  }, [page, appliedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const loadCourseNames = async () => {
      try {
        const res = await fetch(`${apiUrl}/courses`);
        const data = await res.json();
        if (data.success && Array.isArray(data.courses)) {
          const map = {};
          data.courses.forEach((c) => {
            map[c.id] = c.name;
          });
          setCourseLabels(map);
        }
      } catch {
        /* ignore */
      }
    };
    loadCourseNames();
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const applySearch = (e) => {
    e?.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput.trim());
  };

  const updateDraft = (userId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  };

  const hasChanges = (user) => {
    const d = drafts[user._id];
    if (!d) return false;
    return (
      d.role !== user.role ||
      d.paymentStatus !== user.paymentStatus ||
      d.profileCompleted !== Boolean(user.profileCompleted)
    );
  };

  const handleSave = async (user) => {
    const d = drafts[user._id];
    if (!d || !hasChanges(user)) return;
    setSavingId(user._id);
    try {
      const data = await adminService.updateUser(user._id, {
        role: d.role,
        paymentStatus: d.paymentStatus,
        profileCompleted: d.profileCompleted,
      });
      if (data.user) {
        setUsers((prev) =>
          prev.map((u) => (u._id === data.user._id ? data.user : u))
        );
        setDrafts((prev) => ({
          ...prev,
          [user._id]: {
            role: data.user.role,
            paymentStatus: data.user.paymentStatus,
            profileCompleted: Boolean(data.user.profileCompleted),
          },
        }));
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update user"
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`Are you sure you want to delete user "${user.fullName}" (${user.email})?\n\nThis will permanently remove the user and all their payment records.`)) {
      return;
    }
    setSavingId(user._id);
    try {
      const res = await fetch(`${apiUrl}/admin/users/${user._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        setDrafts((prev) => {
          const { [user._id]: _, ...rest } = prev;
          return rest;
        });
        setTotal((prev) => prev - 1);
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (error) {
      alert(error.message || "Failed to delete user");
    } finally {
      setSavingId(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">User management</h1>
        <p className="mt-2 text-slate-400">
          Search learners, update roles, payment status, and profile completion.
        </p>
      </div>

      <form
        onSubmit={applySearch}
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2.5 pl-10 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-500"
        >
          Search
        </button>
      </form>

      {listError ? (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {listError}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <span>
          {total === 0
            ? "No users"
            : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                page * PAGE_SIZE,
                total
              )} of ${total}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-slate-200 hover:bg-white/5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="text-slate-500">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-slate-200 hover:bg-white/5 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-300">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    {appliedSearch
                      ? "No users match this search."
                      : "No users registered yet."}
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const d = drafts[user._id];
                  return (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          {user.profilePicture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.profilePicture}
                              alt=""
                              className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-xs font-bold text-slate-400">
                              {(user.fullName || "?").slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {user.fullName}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[140px] px-4 py-3 text-xs text-slate-400">
                        {user.enrolledCourseId
                          ? courseLabels[user.enrolledCourseId] ||
                            user.enrolledCourseId
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="w-full max-w-[120px] rounded-lg border border-white/10 bg-slate-800/80 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                          value={d?.role ?? user.role}
                          onChange={(e) =>
                            updateDraft(user._id, "role", e.target.value)
                          }
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="w-full max-w-[130px] rounded-lg border border-white/10 bg-slate-800/80 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                          value={d?.paymentStatus ?? user.paymentStatus}
                          onChange={(e) =>
                            updateDraft(
                              user._id,
                              "paymentStatus",
                              e.target.value
                            )
                          }
                        >
                          <option value="unpaid">unpaid</option>
                          <option value="pending">pending</option>
                          <option value="paid">paid</option>
                          <option value="failed">failed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-slate-300">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-white/20 bg-slate-800 text-blue-600"
                            checked={d?.profileCompleted ?? user.profileCompleted}
                            onChange={(e) =>
                              updateDraft(
                                user._id,
                                "profileCompleted",
                                e.target.checked
                              )
                            }
                          />
                          <span className="text-xs">Done</span>
                        </label>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={
                              !hasChanges(user) || savingId === user._id
                            }
                            onClick={() => handleSave(user)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Save className="h-3.5 w-3.5" />
                            {savingId === user._id ? "Saving…" : "Save"}
                          </button>
                          <button
                            type="button"
                            disabled={savingId === user._id || !user.phone}
                            onClick={() => {
                              const phone = user.phone.replace(/\D/g, '');
                              const msg = encodeURIComponent(`Hi ${user.fullName}, your payment is confirmed! Here is your WhatsApp group link: [ADD_LINK_HERE]`);
                              window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                            title={user.phone ? `Send WhatsApp to ${user.phone}` : 'No phone number'}
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            WhatsApp
                          </button>
                          <button
                            type="button"
                            disabled={savingId === user._id}
                            onClick={() => handleDelete(user)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
