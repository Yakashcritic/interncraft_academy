import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PricingSection from "@/components/home/PricingSection";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </main>
  );
}