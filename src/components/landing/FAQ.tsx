'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is FunnelLink?',
    a: 'FunnelLink is a WhatsApp-first conversion engine. You create a single smart link with a visual product catalog, and visitors tap through category preferences to land on your WhatsApp with a structured, ready-to-buy message — including their exact product choice, budget, and requirements.',
  },
  {
    q: 'What industries does FunnelLink support?',
    a: 'FunnelLink ships with three conversion-optimized templates: Furniture & E-Commerce (product catalogs with custom sizing and pricing), Luxury Real Estate (floor plans, BHK configurations, RERA info, and location maps), and Café & Restaurant (menu showcases, table reservations, and pre-ordering). Each template is fully customizable in the visual editor.',
  },
  {
    q: 'How long does it take to set up?',
    a: 'Under 2 minutes. Pick a template, customize your listings and prices in the visual editor, set your WhatsApp number, and publish. You get a shareable link immediately — no coding, no app installation required.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes! The Free plan includes 1 funnel, 3 products, and 50 leads per month — forever. When you\'re ready to scale, upgrade to Pro for unlimited everything. No credit card required to start.',
  },
  {
    q: 'How does the WhatsApp conversion work?',
    a: 'When a visitor completes the funnel flow (choosing a category, browsing your catalog, and selecting a product), FunnelLink generates a pre-filled WhatsApp message containing their exact choice. For example: "Hi, I want the floor plan and pricing for Sky Villa (4 BHK). Please share availability." They tap one button and land directly in your WhatsApp chat.',
  },
  {
    q: 'Can I customize the funnel editor?',
    a: 'Absolutely. The visual campaign editor lets you customize every element: hero images, product listings, pricing labels, category names, customer testimonials, Google Maps integration, and even the WhatsApp message templates. Changes preview in real-time on mobile, tablet, and desktop viewports.',
  },
  {
    q: 'Where do I share my FunnelLink?',
    a: 'Anywhere! Instagram bio, WhatsApp status, Facebook ads, Google Ads, QR codes, email signatures, or any platform where you can paste a link. Each funnel gets a unique URL like yoursite.com/your-slug that works on all devices.',
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-6 text-left group"
      >
        <h3 className="text-base lg:text-lg font-semibold text-[#1a1a2e] group-hover:text-[#6366f1] transition-colors pr-4">
          {faq.q}
        </h3>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${open ? 'bg-[#6366f1] rotate-180' : 'bg-gray-100 group-hover:bg-[#6366f1]/10'}`}>
          <ChevronDown size={16} className={`transition-colors ${open ? 'text-white' : 'text-gray-500 group-hover:text-[#6366f1]'}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-gray-500 text-sm lg:text-base leading-relaxed pb-6 pr-12">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="section-white py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a1a2e]">
            Questions? <span className="text-[#6366f1]">Answered</span>
          </h2>
        </motion.div>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
