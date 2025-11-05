import Hero from "@/features/home/Hero";
import Stats from "@/features/home/Stats";
import HowItWorks from "@/features/home/HowlWorks";
import CTA from "@/features/home/CTA";
import Footer from "@/features/home/Footer";

export default function Home() {
  return (
    <div className="gap-5">
      <Hero />
      <HowItWorks />

      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}
