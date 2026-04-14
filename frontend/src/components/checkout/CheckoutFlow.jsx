"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import Loader from "@/components/common/Loader";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";
const REFERRAL_STORAGE_KEY = "learnmythos_referral_code";

export default function CheckoutFlow() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  const [pricing, setPricing] = useState({
    originalAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/courses`);
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        setCourses(data.courses);
        if (data.courses[0]) {
          setPricing({
            originalAmount: data.courses[0].price,
            discountAmount: 0,
            finalAmount: data.courses[0].price,
          });
        }
      }
    } catch {
      setMessage("Could not load program tracks. Refresh and try again.");
    }
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const userRes = await fetch(`${apiUrl}/auth/me`, {
          credentials: "include",
        });
        const userData = await userRes.json();

        if (!userData.success) {
          router.push("/login");
          return;
        }

        if (!userData.user.profileCompleted) {
          router.push("/complete-profile");
          return;
        }

        if (userData.user.paymentStatus === "paid") {
          router.push("/dashboard");
          return;
        }

        await loadCourses();
      } catch {
        router.push("/login");
      } finally {
        setPageLoading(false);
      }
    };

    checkAccess();
  }, [router, loadCourses]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCodeFromUrl = params.get("ref");

    if (refCodeFromUrl) {
      const normalized = refCodeFromUrl.toUpperCase().trim();
      setCoupon(normalized);
      try {
        localStorage.setItem(REFERRAL_STORAGE_KEY, normalized);
      } catch {
        /* ignore */
      }
      return;
    }

    try {
      const storedRef = localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (storedRef) {
        setCoupon(storedRef);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!courseId) return;
    const selected = courses.find((c) => c.id === courseId);
    if (!selected) return;
    setPricing({
      originalAmount: selected.price,
      discountAmount: 0,
      finalAmount: selected.price,
    });
  }, [courseId, courses]);

  const handleApplyCoupon = async () => {
    if (!courseId) {
      setMessage("Please select a program first.");
      return;
    }

    if (!coupon.trim()) {
      setMessage("Please enter a coupon code");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiUrl}/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code: coupon, courseId }),
      });

      const data = await res.json();

      if (data.success) {
        setPricing(data.pricing);
        setMessage(data.message);
      } else {
        setMessage(data.message || "Invalid coupon");
      }
    } catch {
      setMessage("Failed to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!courseId) {
      setMessage("Select your internship track to continue.");
      return;
    }

    try {
      setPaying(true);
      setMessage("");

      const res = await fetch(`${apiUrl}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          couponCode: coupon,
          courseId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        // Show specific error from backend
        const errorMsg = data.message || data.error || "Failed to create payment order";
        setMessage(errorMsg);
        console.error("Payment order creation failed:", data);
        setPaying(false);
        return;
      }

      // Validate response has required fields
      if (!data.paymentSessionId || !data.orderId) {
        setMessage("Payment session creation failed. Missing session details.");
        console.error("Invalid payment response:", data);
        setPaying(false);
        return;
      }

      const mode = data.cashfreeMode === "production" ? "production" : "sandbox";

      if (typeof window === "undefined" || !window.Cashfree) {
        setMessage("Payment SDK not loaded. Refresh the page.");
        setPaying(false);
        return;
      }

      const cashfree = window.Cashfree({ mode });

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });

      const verifyRes = await fetch(`${apiUrl}/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderId: data.orderId,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success && verifyData.paymentStatus === "success") {
        try {
          sessionStorage.setItem("interncraft_open_wa_prompt", "1");
        } catch {
          /* ignore */
        }
        router.push("/dashboard");
      } else {
        setMessage(verifyData.message || "Payment verification failed");
      }
    } catch {
      setMessage("Payment failed or cancelled");
    } finally {
      setPaying(false);
    }
  };

  if (pageLoading) {
    return (
      <PageWrapper>
        <Loader text="Loading checkout..." />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card-premium rounded-[1.75rem] p-8">
          <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
          <p className="mt-2 text-slate-400">
            Pick your internship track, then pay securely. Your WhatsApp cohort
            link matches the track you choose.
          </p>

          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-200">
              1. Select your program track{" "}
              <span className="text-rose-400">*</span>
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {courses.map((c) => {
                const selected = courseId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCourseId(c.id);
                      setMessage("");
                      setPricing({
                        originalAmount: c.price,
                        discountAmount: 0,
                        finalAmount: c.price,
                      });
                    }}
                    className={`rounded-2xl border p-4 text-left premium-transition ${
                      selected
                        ? "border-sky-500/60 bg-sky-500/15 ring-2 ring-sky-400/30"
                        : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
                    }`}
                  >
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {c.description}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-sky-300">
                      <span className="mr-2 text-xs text-slate-500 line-through">
                        ₹{c.strikePrice}
                      </span>
                      ₹{c.price}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-500">Program</p>
              <p className="mt-1 font-semibold text-white">
                InternCraft Academy Internship Program
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-500">Learning Mode</p>
              <p className="mt-1 font-semibold text-white">
                Live + Recorded
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card-premium rounded-[1.75rem] p-8">
          <h2 className="font-display text-2xl font-bold text-white">
            Order summary
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Program fee</span>
              <span className="font-medium text-white">
                ₹{pricing.originalAmount}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Discount</span>
              <span className="font-medium text-emerald-400">
                - ₹{pricing.discountAmount}
              </span>
            </div>

            <div className="border-t border-white/10 pt-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Coupon / referral code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter code"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500/50"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={loading}
                  className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/15"
                >
                  {loading ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>

            {message && <p className="text-sm text-slate-400">{message}</p>}

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-white">
                  ₹{pricing.finalAmount}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={paying || !courseId}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:opacity-95 disabled:opacity-40"
            >
              {paying ? "Processing..." : "Proceed to pay"}
            </button>

            <p className="text-center text-xs text-slate-500">
              Secure payment powered by Cashfree.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
