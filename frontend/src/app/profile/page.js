"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, TicketPercent, Users } from "lucide-react";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`${apiBase}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    };

    getUser();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Profile Page</h1>
          {user?.role === "admin" && (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/coupons"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500"
              >
                <TicketPercent className="h-4 w-4" />
                Coupons
              </Link>
              <Link
                href="/admin/user_manage"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                <Users className="h-4 w-4" />
                User manage
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin home
              </Link>
            </div>
          )}
        </div>

        {user ? (
          <pre className="mt-6 rounded-xl bg-white p-6 shadow-sm overflow-auto max-w-full">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p className="mt-4 text-slate-600">Loading user...</p>
        )}
      </div>
    </main>
  );
}