"use client";

import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/lib/adminService";
import {
  Plus,
  Trash2,
  Tag,
  Percent,
  Sparkles,
  Power,
  PowerOff,
} from "lucide-react";

function randomCouponCode(prefix = "IC") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${s}`;
}

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    usageLimit: "",
    expiresAt: "",
  });

  const fetchCoupons = useCallback(async () => {
    setListError("");
    try {
      const data = await adminService.getCoupons();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      setListError(
        error.response?.data?.message ||
          error.message ||
          "Could not load coupons. Check that you are logged in as admin."
      );
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleGenerateCode = () => {
    setFormData((prev) => ({ ...prev, code: randomCouponCode() }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const valueNum = Number(formData.discountValue);
    if (!Number.isFinite(valueNum) || valueNum <= 0) {
      alert("Enter a valid discount value greater than zero.");
      return;
    }
    if (formData.discountType === "percentage" && valueNum > 100) {
      alert("Percentage cannot exceed 100.");
      return;
    }
    try {
      await adminService.createCoupon({
        code: formData.code.trim(),
        discountType: formData.discountType,
        discountValue: valueNum,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : 0,
        expiresAt: formData.expiresAt || undefined,
      });
      setIsCreating(false);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        usageLimit: "",
        expiresAt: "",
      });
      fetchCoupons();
    } catch (error) {
      alert(
        "Failed to create coupon: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await adminService.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete coupon");
    }
  };

  const handleToggle = async (coupon) => {
    try {
      const data = await adminService.toggleCouponActive(coupon._id);
      if (data.coupon) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? data.coupon : c))
        );
      }
    } catch {
      alert("Failed to update coupon status");
    }
  };

  const formatExpiry = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Coupon Management</h1>
          <p className="mt-2 text-slate-400">
            Generate codes, set discount and usage limits, activate or retire
            coupons.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-blue-500/25"
        >
          <Plus className="h-5 w-5" />
          Create coupon
        </button>
      </div>

      {listError ? (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {listError}
        </div>
      ) : null}

      {isCreating && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-white">
              Generate new coupon
            </h2>
            <button
              type="button"
              onClick={handleGenerateCode}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              Random code
            </button>
          </div>
          <form
            onSubmit={handleCreateSubmit}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium text-slate-400">
                Coupon code
              </label>
              <input
                required
                type="text"
                placeholder="e.g. EARLYBIRD"
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-800/50 px-4 py-2 font-mono text-white outline-none focus:border-blue-500"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">
                Discount type
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-800/50 px-4 py-2 text-white outline-none focus:border-blue-500"
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({ ...formData, discountType: e.target.value })
                }
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">
                Value
              </label>
              <input
                required
                type="number"
                placeholder="e.g. 20"
                min="1"
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-800/50 px-4 py-2 text-white outline-none focus:border-blue-500"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({ ...formData, discountValue: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">
                Usage limit <span className="text-xs">(optional)</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Unlimited if empty"
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-800/50 px-4 py-2 text-white outline-none focus:border-blue-500"
                value={formData.usageLimit}
                onChange={(e) =>
                  setFormData({ ...formData, usageLimit: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">
                Expires <span className="text-xs">(optional)</span>
              </label>
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-800/50 px-4 py-2 text-white outline-none focus:border-blue-500"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-green-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-green-500 sm:w-auto"
              >
                Save coupon
              </button>
            </div>
          </form>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-sm font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-300">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Expires</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-slate-500"
                  >
                    Loading coupons…
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-slate-500"
                  >
                    No coupons yet. Use &quot;Create coupon&quot; to generate
                    one.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-bold text-white">
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-sm">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-400">
                      <span className="flex items-center gap-1">
                        {coupon.discountType === "percentage" ? (
                          <>
                            <Percent className="h-3 w-3" />{" "}
                            {coupon.discountValue}%
                          </>
                        ) : (
                          <>
                            <Tag className="h-3 w-3" /> ₹
                            {coupon.discountValue}
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.usedCount} /{" "}
                      {coupon.usageLimit ? coupon.usageLimit : "∞"}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatExpiry(coupon.expiresAt)}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.isActive ? (
                        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-1 text-xs text-green-400">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-400">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title={
                            coupon.isActive ? "Deactivate" : "Activate"
                          }
                          onClick={() => handleToggle(coupon)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {coupon.isActive ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => handleDelete(coupon._id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
