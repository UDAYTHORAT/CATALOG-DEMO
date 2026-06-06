'use client';

import { motion } from 'framer-motion';
import { Link2, MousePointerClick, ShoppingBag, MessageCircle, ArrowDown } from 'lucide-react';

const journey = [
  {
    step: '1',
    icon: Link2,
    title: 'Visitor clicks your link',
    detail: 'From your Instagram bio, WhatsApp status, Facebook ad, or QR code.',
    visual: (
      <div className="bg-slate-100 rounded-xl p-3 text-center">
        <div className="bg-white rounded-lg border border-slate-200 px-4 py-2.5 inline-flex items-center gap-2">
          <span className="text-indigo-600 text-xs font-mono">yoursite.com/my-store</span>
        </div>
      </div>
    ),
    color: '#3b82f6',
  },
  {
    step: '2',
    icon: MousePointerClick,
    title: 'Picks their category',
    detail: 'Sofas, Beds, 3 BHK, Coffee — they tap what they want. Zero typing.',
    visual: (
      <div className="space-y-1.5">
        {[{ e: '🛋️', l: 'Luxury Sofas', a: true }, { e: '🛏️', l: 'Beds', a: false }].map((o) => (
          <div key={o.l} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${o.a ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-white border border-slate-100 text-gray-500'}`}>
            <span>{o.e}</span>{o.l}
            {o.a && <span className="ml-auto text-blue-500">✓</span>}
          </div>
        ))}
      </div>
    ),
    color: '#6366f1',
  },
  {
    step: '3',
    icon: ShoppingBag,
    title: 'Sees your best products',
    detail: 'A curated showcase of 2-3 products with photos, prices, and urgency tags.',
    visual: (
      <div className="bg-white rounded-xl border border-slate-100 p-2.5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg shrink-0">🛋️</div>
          <div>
            <p className="text-[11px] font-bold text-gray-800">Milano 3-Seater</p>
            <p className="text-[10px] text-blue-600 font-semibold">₹42,000</p>
          </div>
        </div>
      </div>
    ),
    color: '#8b5cf6',
  },
  {
    step: '4',
    icon: MessageCircle,
    title: 'Taps "Get Price" → WhatsApp opens',
    detail: 'A pre-written message with product name, budget, and requirements lands in your WhatsApp.',
    visual: (
      <div className="bg-[#dcf8c6]/30 border border-[#25d366]/20 rounded-xl p-2.5 text-[10px] text-gray-700 leading-relaxed">
        <p className="font-semibold">Hi Urban Living,</p>
        <p className="mt-1">I want a quote for <span className="font-semibold">Milano 3-Seater Sofa</span></p>
        <p className="mt-1">1. Final factory price<br />2. Customization options<br />3. Delivery time</p>
      </div>
    ),
    color: '#25d366',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-white py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a1a2e]">
            The complete funnel journey
          </h2>
          <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto">
            This is exactly what happens when someone clicks your FunnelLink — start to finish in under 10 seconds.
          </p>
        </motion.div>

        {/* Journey steps */}
        <div className="max-w-2xl mx-auto">
          {journey.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="flex gap-5">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                    style={{ background: step.color }}
                  >
                    <step.icon size={18} className="text-white" />
                  </div>
                  {i < journey.length - 1 && (
                    <div className="w-0.5 flex-1 my-2 rounded-full" style={{ background: `linear-gradient(to bottom, ${step.color}40, ${journey[i + 1].color}40)` }} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8 flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-300">Step {step.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a2e] mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{step.detail}</p>
                  <div className="max-w-[280px]">
                    {step.visual}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Result callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl mx-auto mt-4"
        >
          <div className="bg-[#25d366]/[0.06] border border-[#25d366]/15 rounded-2xl p-6 text-center">
            <p className="text-sm font-bold text-[#1a1a2e] mb-1">The result?</p>
            <p className="text-sm text-gray-600">
              You get a <span className="font-semibold text-[#1a1a2e]">ready-to-close lead</span> on WhatsApp — 
              with the exact product, their budget, and what they need. Just reply and sell.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
