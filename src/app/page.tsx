import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import DemoPreview from '@/components/landing/DemoPreview';
import Features from '@/components/landing/Features';
import TrustBanner from '@/components/landing/TrustBanner';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      {/* 1. Hook: Before/After — show the problem and the solution */}
      <Hero />
      {/* 2. The complete funnel journey: link → category → product → WhatsApp */}
      <HowItWorks />
      {/* 3. Interactive demo: switch between industries and see the actual screens */}
      <DemoPreview />
      {/* 4. The 3 industry templates with mockups */}
      <Features />
      {/* 5. Concrete benefits: what the seller profits from using this */}
      <TrustBanner />
      {/* 6. Pricing */}
      <Pricing />
      {/* 7. FAQ */}
      <FAQ />
      {/* 8. Final CTA + Footer */}
      <Footer />
    </main>
  );
}
