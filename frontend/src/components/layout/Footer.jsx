import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="col-span-2 lg:col-span-1">
          <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white mb-4">
            <Sparkles className="h-5 w-5 text-blue-400" />
            InternCraft Academy
          </h3>
          <p className="text-sm leading-6 text-slate-400">
            A premium internship platform engineered to help ambitious students build real-world skills through interactive live learning and verifiable projects.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Product</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link className="transition-colors hover:text-white" href="/">Program Overview</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/login">Student Portal / Login</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/checkout">Enrollment Checkout</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Legal</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link className="transition-colors hover:text-white" href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/terms">Terms of Service</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/refund-policy">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wider text-white uppercase">Support</h4>
          <p className="mt-4 text-sm text-slate-400">
            Get dedicated assistance for onboarding, curriculum queries, and technical support through our official student community.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} InternCraft Academy. All rights reserved.
      </div>
    </footer>
  );
}