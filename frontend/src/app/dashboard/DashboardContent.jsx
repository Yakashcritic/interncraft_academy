"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Mail,
  Phone,
  School,
  Users,
} from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import Loader from "@/components/common/Loader";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [referral, setReferral] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [showWaModal, setShowWaModal] = useState(false);

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";
    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openWhatsapp = useCallback(() => {
    if (!course?.whatsappUrl) return;
    window.open(course.whatsappUrl, "_blank", "noopener,noreferrer");
  }, [course]);

  const copyReferralLink = async () => {
    if (!referral?.referralLink) return;
    try {
      await navigator.clipboard.writeText(referral.referralLink);
    } catch {
      /* ignore */
    }
  };

  const shareReferralOnWhatsapp = () => {
    if (!referral?.referralLink) return;
    const message = encodeURIComponent(
      `Join Learn Mythos with my referral link and get a discount: ${referral.referralLink}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer");
  };

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
          setReferral(en.referral || null);
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
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="surface-card-premium rounded-[1.75rem] border border-white/10 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-sky-300/80">
                Student Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Welcome back, {user?.fullName?.split(" ")[0] || "Student"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Your selected internship track, payment details, and cohort access
                are available here.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                Payment Verified
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface-card-premium rounded-[1.5rem] border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white">Profile Snapshot</h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="inline-flex items-center gap-2 text-slate-400">
                  <GraduationCap className="h-4 w-4" />
                  Name
                </dt>
                <dd className="mt-1 font-medium text-white">{user?.fullName || "—"}</dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                  Email
                </dt>
                <dd className="mt-1 font-medium text-white">{user?.email || "—"}</dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-2 text-slate-400">
                  <Phone className="h-4 w-4" />
                  Phone
                </dt>
                <dd className="mt-1 font-medium text-white">{user?.phone || "—"}</dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-2 text-slate-400">
                  <School className="h-4 w-4" />
                  College
                </dt>
                <dd className="mt-1 font-medium text-white">
                  {user?.collegeName || "—"}
                </dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-2 text-slate-400">
                  <BookOpen className="h-4 w-4" />
                  Course / Degree
                </dt>
                <dd className="mt-1 font-medium text-white">
                  {user?.courseDegree || "—"}
                </dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-2 text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  Member Since
                </dt>
                <dd className="mt-1 font-medium text-white">{formatDate(user?.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="surface-card-premium rounded-[1.5rem] border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white">Your Selected Track</h2>
            {course ? (
              <div className="mt-5">
                <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
                  <p className="text-sm text-sky-300">Enrolled Program</p>
                  <p className="mt-1 text-xl font-bold text-white">{course.name}</p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {course.description}
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-200">
                    <Users className="h-4 w-4 text-emerald-300" />
                    WhatsApp Cohort Access
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Join your dedicated mentor + learner community.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {course.whatsappUrl ? (
                    <button
                      type="button"
                      onClick={openWhatsapp}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white shadow hover:bg-green-700"
                    >
                      Join WhatsApp cohort
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                      Your WhatsApp invite link is not configured yet. Check your
                      email or contact support — you can still use this dashboard.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
                  >
                    Back to home
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-300">
                No course track is linked to this payment. Please contact support
                with your payment receipt.
              </p>
            )}
          </div>
        </div>

        <div className="surface-card-premium rounded-[1.5rem] border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white">Referral Wallet</h2>
          <p className="mt-1 text-sm text-slate-400">
            Rewards are credited only after the referred student's payment is successful.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Referral code</p>
              <p className="mt-1 text-lg font-bold text-white">
                {referral?.referralCode || "N/A"}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Total earnings</p>
              <p className="mt-1 text-lg font-bold text-emerald-300">
                ₹{referral?.totalEarnings || 0}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Referrals completed</p>
              <p className="mt-1 text-lg font-bold text-white">
                {referral?.totalReferrals || 0}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Referral link</p>
            <p className="mt-1 break-all text-sm text-slate-200">
              {referral?.referralLink || "Referral link unavailable"}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyReferralLink}
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              Copy link
            </button>
            <button
              type="button"
              onClick={shareReferralOnWhatsapp}
              className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Share on WhatsApp
            </button>
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
