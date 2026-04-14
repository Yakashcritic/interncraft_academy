"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  TicketPercent, 
  Users, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  MessageCircle,
  ArrowLeft,
  Edit3
} from "lucide-react";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";

const COURSES = {
  "machine-learning": { name: "Machine Learning Basics", icon: "🤖", color: "bg-purple-100 text-purple-700" },
  dsa: { name: "Data Structures & Algorithms", icon: "💻", color: "bg-indigo-100 text-indigo-700" },
  python: { name: "Python Programming", icon: "🐍", color: "bg-emerald-100 text-emerald-700" },
  "backend-development": { name: "Backend Development", icon: "🌐", color: "bg-cyan-100 text-cyan-700" },
  accounting: { name: "Accounting", icon: "📊", color: "bg-orange-100 text-orange-700" },
  "digital-marketing": { name: "Digital Marketing", icon: "📱", color: "bg-blue-100 text-blue-700" },
  "video-editing": { name: "Video Editing", icon: "🎬", color: "bg-red-100 text-red-700" },
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${apiBase}/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-slate-400" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Payment Completed";
      case "pending":
        return "Payment Pending";
      case "failed":
        return "Payment Failed";
      default:
        return "Not Paid";
    }
  };

  const getCourseInfo = (courseId) => {
    return COURSES[courseId] || { name: "No Course Selected", icon: "📚", color: "bg-slate-100 text-slate-600" };
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Please login to view your profile</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const courseInfo = getCourseInfo(user.enrolledCourseId);
  const whatsappLink = `https://wa.me/919876543210?text=Hi%20Interncraft%20Team%2C%20I%20need%20help%20with%20my%20account%20(${user.email})`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          {user?.role === "admin" && (
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Link
                href="/admin/coupons"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
              >
                <TicketPercent className="h-4 w-4" />
                Coupons
              </Link>
              <Link
                href="/admin/user_manage"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Users className="h-4 w-4" />
                User Manage
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Home
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24"></div>
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                    {user.profilePicture ? (
                      <Image
                        src={user.profilePicture}
                        alt={user.fullName}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <User className="h-10 w-10 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
                <p className="text-slate-500 text-sm mt-1">{user.email}</p>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mt-3">
                  <CheckCircle className="h-3 w-3" />
                  {user.role === "admin" ? "Administrator" : "Student"}
                </span>
              </div>
            </div>

            {/* WhatsApp Support Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Need Help?
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Have questions about your course or payment? Chat with us on WhatsApp for instant support.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Details & Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </h3>
                <Link
                  href="/complete-profile"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Full Name</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900 font-medium">{user.fullName}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Address</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900 font-medium truncate">{user.email}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone Number</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900 font-medium">{user.phone || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">College/University</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900 font-medium">{user.collegeName || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Course/Degree</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900 font-medium">{user.courseDegree || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Year of Study</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900 font-medium">{user.year || "Not provided"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course & Payment Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Course & Payment Status
              </h3>
              
              <div className="space-y-4">
                {/* Selected Course */}
                <div className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 block">
                    Selected Course
                  </label>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${courseInfo.color} flex items-center justify-center text-2xl`}>
                      {courseInfo.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{courseInfo.name}</h4>
                      <p className="text-sm text-slate-500">
                        {user.enrolledCourseId ? "Your learning journey starts here!" : "No course selected yet"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 block">
                    Payment Status
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getPaymentStatusColor(user.paymentStatus)}`}>
                        {getPaymentStatusIcon(user.paymentStatus)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{getPaymentStatusText(user.paymentStatus)}</h4>
                        <p className="text-sm text-slate-500">
                          {user.paymentStatus === "paid" 
                            ? "You're all set! Access your course now."
                            : user.paymentStatus === "pending"
                            ? "Your payment is being processed."
                            : "Complete your payment to get started."
                          }
                        </p>
                      </div>
                    </div>
                    {user.paymentStatus !== "paid" && (
                      <Link
                        href="/checkout"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        {user.paymentStatus === "pending" ? "Resume Payment" : "Pay Now"}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Joined Date */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Member since</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}