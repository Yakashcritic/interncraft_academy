import { Suspense } from "react";
import LoginContent from "./LoginContent";

function LoginFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-slate-50">
      <p className="text-slate-600">Loading…</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
