import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeShapeBlurAmbient from "@/components/effects/HomeShapeBlurAmbient";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import ProgramDetails from "@/components/home/ProgramDetails";
import ProgramOverview from "@/components/home/ProgramOverview";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import MagicBentoSection from "@/components/home/MagicBentoSection";
import PricingSection from "@/components/home/PricingSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import ConversionSections from "@/components/home/ConversionSections";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      <div
        className="pointer-events-none fixed inset-0 -z-20 noise-soft opacity-90"
        aria-hidden
      />
      <HomeShapeBlurAmbient />
      <div
        className="pointer-events-none fixed inset-0 -z-10 grid-scan opacity-[0.35]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -left-1/4 top-1/3 -z-10 h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-blue-500/15 blur-[100px] scan-beam"
        aria-hidden
      />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ProgramDetails />
      <ProgramOverview />
      <CategoriesSection />
      <FeaturesSection />
      <ConversionSections />
      <MagicBentoSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}