'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for testing your first funnel',
    cta: 'Start Free',
    featured: false,
    color: '#6366f1',
    features: [
      { text: '1 funnel link', ok: true },
      { text: '50 leads / month', ok: true },
      { text: '3 products', ok: true },
      { text: 'Basic analytics', ok: true },
      { text: 'WhatsApp handoff', ok: true },
      { text: 'Custom branding', ok: false },
      { text: 'Unlimited leads', ok: false },
      { text: 'Priority support', ok: false },
    ],
  },
  {
    name: 'Pro',
    price: '₹999',
    period: '/ month',
    description: 'For serious sellers ready to scale',
    cta: 'Get Pro',
    featured: true,
    color: '#a855f7',
    features: [
      { text: 'Unlimited funnels', ok: true },
      { text: 'Unlimited leads', ok: true },
      { text: 'Unlimited products', ok: true },
      { text: 'Advanced analytics', ok: true },
      { text: 'WhatsApp handoff', ok: true },
      { text: 'Custom branding & domain', ok: true },
      { text: 'Multiple team members', ok: true },
      { text: 'Priority support', ok: true },
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-sky py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 bg-[#6366f1]/10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6366f1]">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a1a2e]">
            Start free. <span className="text-[#6366f1]">Scale when ready.</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">No hidden fees. No surprises. Cancel anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`relative group rounded-[1.5rem] p-8 lg:p-10 bg-white transition-all duration-500 hover:-translate-y-2 ${plan.featured ? 'shadow-xl shadow-purple-500/10 border-2 border-[#a855f7]/30 ring-1 ring-[#a855f7]/10' : 'shadow-lg shadow-gray-200/50 border border-gray-100'}`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#a855f7] to-[#6366f1] px-5 py-1.5 rounded-full">
                  <span className="text-[11px] text-white font-bold uppercase tracking-wider">Most Popular</span>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl lg:text-5xl font-extrabold text-[#1a1a2e]">{plan.price}</span>
                  <span className="text-sm text-gray-400 mb-2">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              <Link
                href="/signup"
                className={`block w-full py-3.5 rounded-full text-center text-sm font-bold transition-all duration-300 mb-8 ${plan.featured ? 'btn-lime' : 'bg-gray-100 text-[#1a1a2e] hover:bg-gray-200'}`}
              >
                {plan.cta}
              </Link>
              <div className="space-y-3.5">
                {plan.features.map((f) => (
                  <div key={f.text} className="flex items-center gap-3">
                    {f.ok ? (
                      <div className="w-5 h-5 rounded-full bg-[#22c55e]/10 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-[#22c55e]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <X size={12} className="text-gray-300" />
                      </div>
                    )}
                    <span className={`text-sm ${f.ok ? 'text-gray-600' : 'text-gray-400'}`}>{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-gray-400 mt-10"
        >
          All plans include SSL encryption, 99.9% uptime, and GDPR compliance.
        </motion.p>
      </div>
    </section>
  );
}
