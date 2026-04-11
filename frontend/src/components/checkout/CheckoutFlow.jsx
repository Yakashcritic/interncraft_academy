"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import Loader from "@/components/common/Loader";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function CheckoutFlow() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  const [pricing, setPricing] = useState({
    originalAmount: 999,
    discountAmount: 0,
    finalAmount: 999,
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

  const handleApplyCoupon = async () => {
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
        body: JSON.stringify({ code: coupon }),
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
      setMessage("Select one of the six internship tracks to continue.");
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
        setMessage(data.message || "Failed to create payment");
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
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="mt-2 text-slate-600">
            Pick your internship track, then pay securely. Your WhatsApp cohort
            link matches the track you choose.
          </p>

          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-800">
              1. Select your program track <span className="text-red-600">*</span>
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
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {c.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Program</p>
              <p className="mt-1 font-semibold text-slate-900">
                InternCraft Academy Internship Program
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Learning Mode</p>
              <p className="mt-1 font-semibold text-slate-900">
                Live + Recorded
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Program Fee</span>
              <span className="font-medium text-slate-900">
                ₹{pricing.originalAmount}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Discount</span>
              <span className="font-medium text-green-600">
                - ₹{pricing.discountAmount}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Coupon / Referral Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter code"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={loading}
                  className="rounded-xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-900"
                >
                  {loading ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>

            {message && <p className="text-sm text-slate-600">{message}</p>}

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">
                  ₹{pricing.finalAmount}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={paying || !courseId}
              className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {paying ? "Processing..." : "Proceed to Pay"}
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
