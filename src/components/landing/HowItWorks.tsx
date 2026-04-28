'use client';

import { motion } from 'framer-motion';
import { Link2, MousePointerClick, MessageCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Create Your Funnel',
    description: 'Set up your products, categories, and budget ranges. Get a single smart link in under 2 minutes.',
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    number: '02',
    icon: MousePointerClick,
    title: 'Guide Your Visitors',
    description: 'Visitors answer 2–3 quick questions. No typing, no forms — just taps. We show them the perfect products.',
    color: '#a855f7',
    bg: '#faf5ff',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Convert on WhatsApp',
    description: 'The visitor lands in your WhatsApp with a structured message: product, budget, and preference included.',
    color: '#22c55e',
    bg: '#f0fdf4',
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
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 bg-[#6366f1]/10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6366f1]">Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a1a2e]">
            How it <span className="text-[#6366f1]">works</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            Three steps. Under two minutes. Start converting visitors into qualified WhatsApp leads.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group"
            >
              <div
                className="rounded-[1.5rem] p-8 lg:p-10 h-full transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl border border-transparent group-hover:border-gray-100"
                style={{ background: step.bg }}
              >
                {/* Number + Icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg"
                    style={{ background: step.color }}
                  >
                    <step.icon size={24} className="text-white" />
                  </div>
                  <span
                    className="text-5xl font-extrabold opacity-15 group-hover:opacity-25 transition-opacity"
                    style={{ color: step.color }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Result Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-[#25d366]/10 border border-[#25d366]/20 rounded-full px-6 py-3">
            <span className="text-2xl">💬</span>
            <p className="text-sm text-gray-600">
              Instead of <span className="text-gray-400 line-through">&quot;price?&quot;</span>{' '}
              your seller gets:{' '}
              <span className="text-[#1a1a2e] font-semibold italic">
                &quot;Looking for 3-seater sofa under ₹50k, liked option 2&quot;
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
