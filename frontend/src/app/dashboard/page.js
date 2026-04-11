import { Suspense } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import Loader from "@/components/common/Loader";
import DashboardContent from "./DashboardContent";

function DashboardFallback() {
  return (
    <PageWrapper>
      <Loader text="Loading dashboard…" />
    </PageWrapper>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
