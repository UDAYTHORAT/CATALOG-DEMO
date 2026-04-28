import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import TrustBanner from '@/components/landing/TrustBanner';
import HowItWorks from '@/components/landing/HowItWorks';
import DemoPreview from '@/components/landing/DemoPreview';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <TrustBanner />
      <HowItWorks />
      <DemoPreview />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
