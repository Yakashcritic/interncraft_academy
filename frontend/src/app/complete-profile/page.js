"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import InputField from "@/components/common/InputField";
import SelectField from "@/components/common/SelectField";
import Loader from "@/components/common/Loader";

export default function CompleteProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    courseDegree: "",
    year: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("https://learnmythos.app/api/users/profile", {
          credentials: "include",
        });

        const data = await res.json();

        if (!data.success) {
          router.push("/login");
          return;
        }

        if (data.user.profileCompleted) {
          router.push("/checkout");
          return;
        }

        setFormData({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          collegeName: data.user.collegeName || "",
          courseDegree: data.user.courseDegree || "",
          year: data.user.year || "",
        });
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("https://learnmythos.app/api/users/complete-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          phone: formData.phone,
          collegeName: formData.collegeName,
          courseDegree: formData.courseDegree,
          year: formData.year,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Profile completed successfully");
        router.push("/checkout");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
  return (
    <PageWrapper>
      <Loader text="Loading profile..." />
    </PageWrapper>
  );
}

  return (
    <PageWrapper>
      <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-slate-600">
            Please enter your academic and contact details to continue your enrollment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <InputField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            disabled
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="yourmail@example.com"
            disabled
          />

          <InputField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />

          <InputField
            label="College Name"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleChange}
            placeholder="Enter your college name"
          />

          <InputField
            label="Course / Degree"
            name="courseDegree"
            value={formData.courseDegree}
            onChange={handleChange}
            placeholder="Example: BCA / B.Tech / MBA"
          />

          <SelectField
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            options={[
              "1st Year",
              "2nd Year",
              "3rd Year",
              "4th Year",
              "Graduate",
              "Other",
            ]}
          />

          <div className="md:col-span-2">
            {message && (
              <p className="mb-4 text-sm text-slate-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}