// ─── FUNNELLINK — INTERACTIVE CONVERSION ENGINE TEMPLATES ───
// Each template: ONE guided journey · Smart defaults · Dynamic results
// Psychology: Scarcity · Authority · Social Proof · Reciprocity · Loss Aversion

export interface ResultRule {
  condition: { questionIndex: number; optionIndex: number };
  title: string;
  description: string;
  ctaLabel: string;
  ctaType: 'whatsapp' | 'link' | 'booking';
  badge?: string;
}

export interface FunnelTemplate {
  id: string;
  name: string;
  category: string;
  industry: string;
  theme: 'ethereal' | 'bubbly' | 'onyx' | 'kinetic' | 'minimal' | 'dark';
  icon: string;
  accentColor: string;
  bgGradient: string;

  // Step 1: Create Experience
  hero: {
    headline: string;
    subheadline: string;
    ctaLabel: string;
    ctaColor: string;
  };
  goal: 'leads' | 'sell' | 'booking';

  // Trust Bar
  trust: {
    title: string;
    items: string[];
    stats: string; // e.g. "1000+ users"
  };
  testimonial: { text: string; author: string; role: string };

  // Step 2: Ask Questions
  questions: {
    id: string;
    question: string;
    type: 'choice' | 'budget';
    options: string[];
    icon: string;
  }[];

  // Step 3: Show Result (Dynamic Logic)
  resultDefault: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaType: 'whatsapp' | 'link' | 'booking';
  };
  resultRules: ResultRule[];

  // Urgency Block
  urgency: {
    headline: string;
    subtext: string;
    type: 'slots' | 'timer' | 'offer';
  };

  // Enquiry Fields
  enquiryFields: { id: string; label: string; placeholder: string; type: string; required: boolean }[];
  enquiryHeadline: string;
  enquirySub: string;

  // Meta
  description: string;
  features: string[];
  stats: { convRate: string; avgLeads: string };
  badge?: string;

  // FAQ
  faq: { q: string; a: string }[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INDUSTRY AUTO-FILL PRESETS
// When user selects industry, these auto-fill everything
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface IndustryPreset {
  id: string;
  name: string;
  icon: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  goal: 'leads' | 'sell' | 'booking';
}

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  { id: 'doctor', name: 'Doctor / Clinic', icon: '🩺', headline: 'Find the right treatment in 60 seconds', subheadline: 'Answer 3 quick questions. We\'ll match you with the right doctor today.', ctaLabel: 'Start Assessment', goal: 'booking' },
  { id: 'ecommerce', name: 'E-Commerce', icon: '🛍️', headline: 'Find your perfect product — in 20 seconds', subheadline: 'Tell us what you like. We\'ll show the one thing you actually need.', ctaLabel: 'Start Shopping', goal: 'sell' },
  { id: 'fitness', name: 'Fitness / Gym', icon: '💪', headline: 'Get your personalized fitness plan', subheadline: 'Tell us your goals. We\'ll create a plan that actually works.', ctaLabel: 'Start Plan', goal: 'leads' },
  { id: 'coach', name: 'Coach / Consultant', icon: '🧠', headline: 'Find out if coaching is right for you', subheadline: 'Take a 30-second quiz and unlock your personalized growth path.', ctaLabel: 'Start Quiz', goal: 'booking' },
  { id: 'realestate', name: 'Real Estate', icon: '🏠', headline: 'Find your dream home in minutes', subheadline: 'Answer a few questions and get matched with properties you\'ll love.', ctaLabel: 'Start Search', goal: 'leads' },
  { id: 'restaurant', name: 'Restaurant / Cafe', icon: '🍽️', headline: 'Discover your perfect dining experience', subheadline: 'Tell us your vibe and we\'ll recommend the perfect meal.', ctaLabel: 'Explore Menu', goal: 'sell' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MASTER TEMPLATES — Doctor & E-Commerce
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MASTER_TEMPLATES: FunnelTemplate[] = [
  // ━━━ 1. DOCTOR & CLINIC ━━━
  {
    id: 'doctor-clinic',
    name: 'Doctor & Clinic',
    category: 'Healthcare',
    industry: 'doctor',
    theme: 'ethereal',
    icon: '🩺',
    accentColor: '#0891b2',
    bgGradient: 'from-cyan-50 to-teal-50',
    badge: '🔥 #1 Healthcare',

    hero: {
      headline: 'Get the right care — without the wait.',
      subheadline: 'Answer 3 quick questions. We\'ll match you with the right doctor today.',
      ctaLabel: 'Start Assessment',
      ctaColor: '#0891b2',
    },
    goal: 'booking',

    trust: {
      title: 'Why patients choose us',
      items: ['15+ Years Experience', 'Same-Day Appointments', 'Board Certified', '4.9★ Patient Rating'],
      stats: '2,500+ patients helped',
    },
    testimonial: {
      text: 'Got an appointment within hours. Thorough, kind, explained everything clearly.',
      author: 'Priya M.',
      role: 'Verified Patient',
    },

    questions: [
      {
        id: 'q1',
        question: 'What brings you in today?',
        type: 'choice',
        options: ['General Checkup', 'Dental', 'Skin / Derma', 'Eye Care', 'Other'],
        icon: '🔍',
      },
      {
        id: 'q2',
        question: 'How soon do you need to be seen?',
        type: 'choice',
        options: ['Today / Urgent', 'This Week', 'Routine — Anytime'],
        icon: '⏰',
      },
      {
        id: 'q3',
        question: 'How would you like to meet?',
        type: 'choice',
        options: ['Visit Clinic', 'Video / Telehealth', 'No Preference'],
        icon: '📍',
      },
    ],

    resultDefault: {
      title: '✅ Your Perfect Match Found',
      description: 'Based on your answers, we recommend a consultation with our specialist. Book now for priority scheduling.',
      ctaLabel: 'Book on WhatsApp',
      ctaType: 'whatsapp',
    },
    resultRules: [
      {
        condition: { questionIndex: 1, optionIndex: 0 }, // "Today / Urgent"
        title: '🚨 Priority Slot Available',
        description: 'We have an urgent care slot available today. Book immediately to secure your appointment.',
        ctaLabel: 'Book Urgent Slot',
        ctaType: 'whatsapp',
        badge: 'URGENT',
      },
      {
        condition: { questionIndex: 2, optionIndex: 1 }, // "Video / Telehealth"
        title: '💻 Virtual Consultation Ready',
        description: 'Our telemedicine service lets you consult from home. Average wait time: 15 minutes.',
        ctaLabel: 'Start Video Call',
        ctaType: 'whatsapp',
        badge: 'VIRTUAL',
      },
    ],

    urgency: {
      headline: 'Only 3 slots remaining today',
      subtext: 'Appointments fill up fast. Secure yours now.',
      type: 'slots',
    },

    enquiryFields: [
      { id: 'name', label: 'Your Name', placeholder: 'e.g. Rahul Sharma', type: 'text', required: true },
      { id: 'phone', label: 'WhatsApp Number', placeholder: '+91 98765 43210', type: 'tel', required: true },
      { id: 'note', label: 'Describe your symptoms (optional)', placeholder: 'Brief description...', type: 'text', required: false },
    ],
    enquiryHeadline: 'Quick details for faster booking',
    enquirySub: 'So the doctor can prepare for your visit.',

    description: 'Calm, credible, zero-friction booking funnel. Patients answer 3 questions and get matched with the right doctor instantly.',
    features: ['Symptom Qualifier Quiz', 'Dynamic Doctor Matching', 'WhatsApp Instant Booking', 'Trust & Social Proof', 'Urgency Slots'],
    stats: { convRate: '28%', avgLeads: '85/mo' },

    faq: [
      { q: 'Do you accept insurance?', a: 'Yes — all major plans accepted.' },
      { q: 'Can I book for someone else?', a: 'Absolutely. Mention their details in the chat.' },
      { q: 'What if I need to cancel?', a: 'Free cancellation up to 2 hours before your slot.' },
    ],
  },

  // ━━━ 2. E-COMMERCE STORE ━━━
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    category: 'E-Commerce',
    industry: 'ecommerce',
    theme: 'bubbly',
    icon: '🛍️',
    accentColor: '#e11d48',
    bgGradient: 'from-rose-50 to-pink-50',
    badge: '⚡ Best Seller',

    hero: {
      headline: 'Find your perfect product — in 20 seconds.',
      subheadline: 'Tell us what you like. We\'ll show the one thing you actually need.',
      ctaLabel: 'Start Shopping',
      ctaColor: '#e11d48',
    },
    goal: 'sell',

    trust: {
      title: 'Why 50K+ customers love us',
      items: ['Free Shipping ₹999+', '7-Day Easy Returns', '100% Authentic', 'Express Delivery'],
      stats: '50,000+ happy customers',
    },
    testimonial: {
      text: 'The style quiz nailed my preference first try. Best online shopping experience I\'ve had.',
      author: 'Ananya R.',
      role: 'Verified Buyer',
    },

    questions: [
      {
        id: 'q1',
        question: 'What are you shopping for?',
        type: 'choice',
        options: ['Clothing', 'Electronics', 'Home & Living', 'Accessories', 'Gifts'],
        icon: '🎁',
      },
      {
        id: 'q2',
        question: 'What\'s your budget?',
        type: 'budget',
        options: ['Under ₹1,000', '₹1K – ₹5K', '₹5K – ₹15K', '₹15K+'],
        icon: '💰',
      },
      {
        id: 'q3',
        question: 'What vibe are you going for?',
        type: 'choice',
        options: ['Minimal & Clean', 'Bold & Trendy', 'Classic & Elegant', 'Casual & Comfy'],
        icon: '✨',
      },
    ],

    resultDefault: {
      title: '🎯 Your Perfect Match',
      description: 'Based on your style, we\'ve found the ideal product for you. Check it out!',
      ctaLabel: 'View My Match',
      ctaType: 'whatsapp',
    },
    resultRules: [
      {
        condition: { questionIndex: 1, optionIndex: 0 }, // "Under ₹1,000" (budget low)
        title: '💡 Smart Pick Under ₹1,000',
        description: 'Great taste doesn\'t need a big budget! Here\'s our best-selling pick under ₹1,000 — loved by 3,000+ customers.',
        ctaLabel: 'Grab This Deal',
        ctaType: 'whatsapp',
        badge: 'BUDGET PICK',
      },
      {
        condition: { questionIndex: 1, optionIndex: 3 }, // "₹15K+" (premium)
        title: '👑 Premium Collection Match',
        description: 'You have premium taste. Here\'s our exclusive luxury pick, handcrafted and limited edition.',
        ctaLabel: 'View Premium Pick',
        ctaType: 'whatsapp',
        badge: 'PREMIUM',
      },
      {
        condition: { questionIndex: 2, optionIndex: 1 }, // "Bold & Trendy"
        title: '🔥 Trending Now',
        description: 'This is our hottest seller right now — 500+ units sold this week. Grab it before it\'s gone!',
        ctaLabel: 'Get Trending Pick',
        ctaType: 'whatsapp',
        badge: 'TRENDING',
      },
    ],

    urgency: {
      headline: 'Offer ends today — 20% OFF',
      subtext: 'Use code FIRST20 at checkout. Limited to first 50 customers.',
      type: 'offer',
    },

    enquiryFields: [
      { id: 'name', label: 'Your Name', placeholder: 'e.g. Sneha Patel', type: 'text', required: true },
      { id: 'phone', label: 'WhatsApp Number', placeholder: '+91 98765 43210', type: 'tel', required: true },
    ],
    enquiryHeadline: 'Where should we send your recommendation?',
    enquirySub: 'Get exclusive deals & faster support on WhatsApp.',

    description: 'Guided product finder funnel. Visitors choose in seconds, not minutes. Dynamic results based on budget and style preferences.',
    features: ['Style & Budget Quiz', 'AI Product Match', 'Dynamic Result Logic', 'WhatsApp Instant Order', 'Urgency Countdown'],
    stats: { convRate: '24%', avgLeads: '120/mo' },

    faq: [
      { q: 'What\'s your return policy?', a: '7-day no-questions-asked returns.' },
      { q: 'How fast is delivery?', a: '2-3 business days, express available.' },
      { q: 'Is COD available?', a: 'Yes, Cash on Delivery available for orders above ₹500.' },
    ],
  },
];

export const TEMPLATE_CATEGORIES = ['All', ...Array.from(new Set(MASTER_TEMPLATES.map(t => t.category)))];

// ━━━ GOAL OPTIONS ━━━
export const GOAL_OPTIONS = [
  { id: 'leads', label: 'Get Leads', icon: '📋', description: 'Capture contact info' },
  { id: 'sell', label: 'Sell Product', icon: '🛒', description: 'Drive purchases' },
  { id: 'booking', label: 'Book Appointment', icon: '📅', description: 'Schedule meetings' },
] as const;
