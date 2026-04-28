'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '500+', label: 'Active Sellers' },
  { value: '50K+', label: 'Leads Generated' },
  { value: '3x', label: 'More Conversions' },
  { value: '< 15s', label: 'Avg. Funnel Time' },
];

const marqueeItems = [
  'Furniture Stores', 'Fashion Boutiques', 'Electronics Shops', 'Home Decor', 'Beauty Salons',
  'Real Estate', 'Auto Dealers', 'Jewellery', 'Fitness Studios', 'Restaurants',
  'Wedding Planners', 'Travel Agencies', 'Pet Shops', 'Organic Foods', 'Gift Shops',
];

export default function TrustBanner() {
  return (
    <section className="section-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a1a2e]">
            The smart link trusted by{' '}
            <span className="text-[#6366f1]">500+</span> sellers
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            From furniture stores to fashion boutiques — sellers across India are converting more with FunnelLink.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center py-8 px-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-3xl lg:text-4xl font-extrabold text-[#1a1a2e] mb-2">{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div
                key={`${item}-${i}`}
                className="shrink-0 mx-3 px-6 py-3 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600 whitespace-nowrap hover:bg-[#6366f1]/5 hover:border-[#6366f1]/20 hover:text-[#6366f1] transition-colors cursor-default"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
