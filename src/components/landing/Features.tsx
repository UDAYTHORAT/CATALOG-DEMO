'use client';

import { motion } from 'framer-motion';
import { Sofa, Building, Coffee, ArrowRight, MessageCircle } from 'lucide-react';

const templates = [
  {
    tag: 'Furniture & E-Commerce',
    title: 'Sell products directly on WhatsApp',
    points: [
      'Show up to 3 hero products per category',
      'Visitors pick a product and tap "Get Price"',
      'WhatsApp opens with product name, size, and budget',
    ],
    icon: Sofa,
    accentColor: '#3b82f6',
    bg: 'bg-slate-50',
    mockup: (
      <div className="relative w-[260px] h-[440px] mx-auto">
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#3b82f6] to-[#6366f1] shadow-xl shadow-blue-500/15 p-2.5">
          <div className="w-full h-full rounded-[2rem] bg-[#f7f3ec] flex flex-col overflow-hidden text-[#161616]">
            <div className="flex items-center justify-center pt-3 pb-1"><div className="w-16 h-3 rounded-full bg-black/10" /></div>
            <div className="flex-1 px-4 py-3">
              <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold mb-0.5">Urban Living</p>
              <p className="text-sm font-extrabold text-[#111] mb-3">Luxury Sofas</p>
              {/* Product card */}
              <div className="bg-white rounded-xl border border-gray-100 p-3 mb-2 relative">
                <div className="absolute -top-1.5 right-2 text-[8px] bg-[#111] text-white px-2 py-0.5 rounded-full font-bold">Best Value</div>
                <div className="flex gap-2.5">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl shrink-0">🛋️</div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate">Milano 3-Seater</p>
                    <p className="text-[9px] text-gray-400">Sheesham · Italian Foam</p>
                    <p className="text-[11px] font-bold text-blue-600 mt-0.5">₹42,000</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="flex gap-2.5">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl shrink-0">🛋️</div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate">Oslo L-Shape</p>
                    <p className="text-[9px] text-gray-400">Premium Fabric</p>
                    <p className="text-[11px] font-bold text-blue-600 mt-0.5">₹58,500</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 py-2.5 rounded-full bg-[#25d366] text-white text-center text-[10px] font-bold flex items-center justify-center gap-1">
                <MessageCircle size={12} /> Get Factory Price
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Real Estate',
    title: 'Generate qualified property leads',
    points: [
      'Show BHK floor plans with room-by-room walkthroughs',
      'Embed Google Maps for project location',
      'Buyer gets a WhatsApp message with unit type & budget',
    ],
    icon: Building,
    accentColor: '#9A7B44',
    bg: 'bg-white',
    mockup: (
      <div className="relative w-[260px] h-[440px] mx-auto">
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#9A7B44] to-[#7c5d2c] shadow-xl shadow-yellow-800/15 p-2.5">
          <div className="w-full h-full rounded-[2rem] bg-[#FAF9F5] flex flex-col overflow-hidden text-[#1C1917]">
            <div className="flex items-center justify-center pt-3 pb-1"><div className="w-16 h-3 rounded-full bg-black/10" /></div>
            <div className="flex-1 px-4 py-3">
              <p className="text-[9px] uppercase tracking-widest text-[#9A7B44] font-bold mb-0.5">Aurelia Residences</p>
              <p className="text-sm font-extrabold text-[#1C1917] mb-3">Select your home</p>
              {[{ e: '✨', l: 'Sky Villa — 4 BHK', p: '₹2.9 Cr', a: true }, { e: '🏡', l: 'Family Suite — 3 BHK', p: '₹1.8 Cr', a: false }].map((o) => (
                <div key={o.l} className={`flex items-center gap-2.5 p-3 rounded-xl border mb-2 ${o.a ? 'border-[#9A7B44] bg-[#9A7B44]/8' : 'border-black/5 bg-white'}`}>
                  <span className="text-lg">{o.e}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate">{o.l}</p>
                    <p className="text-[9px] text-gray-400">{o.p}</p>
                  </div>
                  {o.a && <div className="w-4 h-4 rounded-full bg-[#9A7B44] flex items-center justify-center"><svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
                </div>
              ))}
              <div className="mt-3 py-2.5 rounded-full bg-[#25d366] text-white text-center text-[10px] font-bold flex items-center justify-center gap-1">
                <MessageCircle size={12} /> Get Floor Plan
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Café & Restaurant',
    title: 'Table reservations + menu pre-orders',
    points: [
      'Showcase signature dishes with photos and prices',
      'Visitors pre-order items before reserving a table',
      'Reservation confirmation sent via WhatsApp',
    ],
    icon: Coffee,
    accentColor: '#C4713B',
    bg: 'bg-slate-50',
    mockup: (
      <div className="relative w-[260px] h-[440px] mx-auto">
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#C4713B] to-[#995328] shadow-xl shadow-orange-700/15 p-2.5">
          <div className="w-full h-full rounded-[2rem] bg-[#FBF9F6] flex flex-col overflow-hidden text-[#2C1810]">
            <div className="flex items-center justify-center pt-3 pb-1"><div className="w-16 h-3 rounded-full bg-black/10" /></div>
            <div className="flex-1 px-4 py-3 flex flex-col">
              <p className="text-[9px] uppercase tracking-widest text-[#C4713B] font-bold mb-0.5">Kaffestuggu</p>
              <p className="text-sm font-extrabold text-[#2C1810] mb-3">Your pre-order</p>
              <div className="space-y-2 flex-1">
                {[{ e: '🥐', n: 'Butter Croissant', p: '$2.50', added: true }, { e: '☕', n: 'Caramel Macchiato', p: '$4.20', added: true }, { e: '🥑', n: 'Avocado Toast', p: '$6.50', added: false }].map((item) => (
                  <div key={item.n} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100">
                    <span className="text-base">{item.e}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold truncate">{item.n}</p>
                      <p className="text-[8px] text-gray-400">{item.p}</p>
                    </div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${item.added ? 'text-[#C4713B] bg-[#C4713B]/10' : 'text-gray-400 bg-gray-50'}`}>
                      {item.added ? '✓ Added' : '+ Add'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="py-2.5 rounded-full bg-[#25d366] text-white text-center text-[10px] font-bold flex items-center justify-center gap-1 mt-3">
                <MessageCircle size={12} /> Reserve Table
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Features() {
  return (
    <section id="features">
      {templates.map((t, index) => (
        <div key={t.tag} className={`${t.bg} py-16 lg:py-24`}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className={index % 2 === 1 ? 'lg:col-start-2' : ''}
              >
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-5" style={{ background: `${t.accentColor}12` }}>
                  <t.icon size={13} style={{ color: t.accentColor }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: t.accentColor }}>{t.tag}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#1a1a2e] mb-6">{t.title}</h2>
                
                {/* Bullet points — simple and scannable */}
                <ul className="space-y-3 mb-8">
                  {t.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 shrink-0"><circle cx="9" cy="9" r="9" fill={`${t.accentColor}15`} /><path d="M6 9l2 2 4-4" stroke={t.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className="text-sm text-gray-600 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>

                <a href="/signup" className="btn-lime inline-flex items-center gap-2 px-6 py-3 text-sm group">
                  Try this template
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>

              {/* Phone mockup */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`flex justify-center ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}
              >
                {t.mockup}
              </motion.div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
