import Hero from "@/features/home/Hero";
import Features from "@/features/home/Features";
import Stats from "@/features/home/Stats";
import HowItWorks from "@/features/home/HowlWorks";
import CTA from "@/features/home/CTA";
import Footer from "@/features/home/Footer";

export default function Home() {
  return (
    <div className="gap-5">
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
