'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const benefits = [
  {
    icon: Target,
    title: 'Pre-qualified leads only',
    detail: 'Every visitor picks a product and budget before messaging you. No more guessing what they want.',
    color: '#3b82f6',
  },
  {
    icon: TrendingUp,
    title: '3x higher conversion',
    detail: 'Structured WhatsApp messages convert 3x better than random "price?" inquiries.',
    color: '#22c55e',
  },
  {
    icon: Clock,
    title: 'Close deals in minutes',
    detail: 'Buyers arrive with product name, specifications, and requirements. Just reply with the price.',
    color: '#6366f1',
  },
  {
    icon: Zap,
    title: 'Zero friction for buyers',
    detail: 'No forms, no signups, no apps to install. Visitors just tap and choose — done in 10 seconds.',
    color: '#f59e0b',
  },
  {
    icon: BarChart3,
    title: 'Track every lead',
    detail: 'See views, clicks, and lead counts on your dashboard. Know which products get the most interest.',
    color: '#8b5cf6',
  },
  {
    icon: ShieldCheck,
    title: 'Works for any business',
    detail: 'Furniture, real estate, cafés, salons, gyms, coaches — if you sell on WhatsApp, this works.',
    color: '#ec4899',
  },
];

export default function TrustBanner() {
  return (
    <section className="section-white py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a1a2e]">
            What you get
          </h2>
          <p className="text-gray-500 mt-3 text-base max-w-md mx-auto">
            Every feature is designed to turn social traffic into paying WhatsApp customers.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group"
            >
              <div className="rounded-2xl p-6 h-full bg-slate-50 border border-slate-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-slate-200">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${b.color}12` }}
                >
                  <b.icon size={20} style={{ color: b.color }} />
                </div>
                <h3 className="text-base font-bold text-[#1a1a2e] mb-1.5">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
