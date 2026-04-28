'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is FunnelLink?',
    a: 'FunnelLink is a smart link-in-bio tool designed for sellers. Instead of a static page, your visitors go through a quick visual decision flow — selecting what they want, their budget, and preferences — then land on your WhatsApp with a structured, ready-to-buy message.',
  },
  {
    q: 'How long does it take to set up?',
    a: 'Under 2 minutes. Just add your products, set categories and budget ranges, and share your link. No coding, no complex setup. It works on any platform — Instagram bio, WhatsApp status, Facebook, or anywhere you can paste a link.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes! The Free plan includes 1 funnel, 3 products, and 50 leads per month — forever. When you\'re ready to scale, upgrade to Pro for unlimited everything. No credit card required to start.',
  },
  {
    q: 'How does the WhatsApp handoff work?',
    a: 'After a visitor completes the funnel, we generate a pre-filled WhatsApp message that includes their product preference, budget range, and any other details. They tap one button and land in your WhatsApp — no typing needed.',
  },
  {
    q: 'What makes FunnelLink different from a regular link-in-bio?',
    a: 'Regular link-in-bio tools just list your links. FunnelLink actively guides visitors through a decision flow, qualifying them before they reach you. Instead of getting "price?" messages, you get leads like "Looking for a 3-seater sofa under ₹50k, liked the Milano."',
  },
  {
    q: 'Can I use FunnelLink for any type of business?',
    a: 'Absolutely. FunnelLink works for furniture stores, fashion boutiques, electronics shops, beauty salons, real estate, restaurants, and any business that sells products or services and uses WhatsApp for communication.',
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
