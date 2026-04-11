"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import Loader from "@/components/common/Loader";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [showWaModal, setShowWaModal] = useState(false);

  const openWhatsapp = useCallback(() => {
    if (!course?.whatsappUrl) return;
    window.open(course.whatsappUrl, "_blank", "noopener,noreferrer");
  }, [course]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoadError("");
      try {
        const meRes = await fetch(`${apiUrl}/auth/me`, { credentials: "include" });
        const me = await meRes.json();

        if (!me.success || !me.user) {
          router.push("/login");
          return;
        }

        if (!me.user.profileCompleted) {
          router.push("/complete-profile");
          return;
        }

        const orderId = searchParams.get("order_id");
        if (orderId) {
          const verifyRes = await fetch(`${apiUrl}/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ orderId }),
          });
          const verifyData = await verifyRes.json();
          if (!cancelled && verifyData.success && verifyData.paymentStatus === "success") {
            try {
              sessionStorage.setItem("interncraft_open_wa_prompt", "1");
            } catch {
              /* ignore */
            }
            router.replace("/dashboard");
            return;
          }
          if (!cancelled) {
            setLoadError(
              verifyData.message ||
                "Payment is not confirmed yet. Wait a minute and open Dashboard from the menu, or contact support."
            );
          }
          return;
        }

        const mePaid = await fetch(`${apiUrl}/auth/me`, { credentials: "include" });
        const paidJson = await mePaid.json();
        if (!paidJson.success || paidJson.user?.paymentStatus !== "paid") {
          router.push("/checkout");
          return;
        }

        const enRes = await fetch(`${apiUrl}/users/enrollment`, {
          credentials: "include",
        });
        const en = await enRes.json();

        if (!enRes.ok || !en.success) {
          if (!cancelled) {
            setLoadError(en.message || "Could not load your dashboard.");
          }
          return;
        }

        if (!cancelled) {
          setUser(en.user);
          setCourse(en.course);
        }

        let prompt = false;
        try {
          prompt = sessionStorage.getItem("interncraft_open_wa_prompt") === "1";
          if (prompt) sessionStorage.removeItem("interncraft_open_wa_prompt");
        } catch {
          /* ignore */
        }

        if (!cancelled && prompt) {
          setShowWaModal(true);
        }
      } catch {
        if (!cancelled) setLoadError("Something went wrong. Try again.");
      } finally {
        if (!cancelled) setBooting(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  if (booting) {
    return (
      <PageWrapper>
        <Loader text="Opening your dashboard…" />
      </PageWrapper>
    );
  }

  if (loadError) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="text-red-700">{loadError}</p>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="mt-6 rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white"
          >
            Back to profile
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student dashboard</h1>
          <p className="mt-2 text-slate-600">
            Your enrollment details and cohort access.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Your details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Name</dt>
                <dd className="font-medium text-slate-900">{user?.fullName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Phone</dt>
                <dd className="font-medium text-slate-900">{user?.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">College</dt>
                <dd className="font-medium text-slate-900">
                  {user?.collegeName || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Course / Degree</dt>
                <dd className="font-medium text-slate-900">
                  {user?.courseDegree || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Year</dt>
                <dd className="font-medium text-slate-900">{user?.year || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Payment</dt>
                <dd className="font-medium text-green-700">Paid</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Your track</h2>
            {course ? (
              <div className="mt-4">
                <p className="text-xl font-bold text-slate-900">{course.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {course.description}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {course.whatsappUrl ? (
                    <button
                      type="button"
                      onClick={openWhatsapp}
                      className="rounded-full bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white shadow hover:bg-green-700"
                    >
                      Join WhatsApp cohort
                    </button>
                  ) : (
                    <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      Your WhatsApp invite link is not configured yet. Check your
                      email or contact support — you can still use this dashboard.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Back to home
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                No course track is linked to this payment. Please contact support
                with your payment receipt.
              </p>
            )}
          </div>
        </div>
      </div>

      {showWaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="max-w-md rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wa-title"
          >
            <h2 id="wa-title" className="text-xl font-bold text-slate-900">
              Join your batch on WhatsApp
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {course
                ? `You enrolled in ${course.name}. Accept to open WhatsApp and join the official group for this track.`
                : "Your cohort link will appear here once configured."}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowWaModal(false)}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Later
              </button>
              <button
                type="button"
                onClick={() => {
                  openWhatsapp();
                  setShowWaModal(false);
                }}
                disabled={!course?.whatsappUrl}
                className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Accept & open WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
