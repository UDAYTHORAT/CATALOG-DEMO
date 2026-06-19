'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useTransform, useMotionValueEvent, useMotionValue } from 'framer-motion';

// Custom hook to calculate element scroll progress dynamically, immune to layout shifts / scroll triggers
function useElementScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const elementTop = rect.top + currentScrollY;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      const scrollRange = elementHeight - viewportHeight;
      if (scrollRange <= 0) return;
      
      const progress = Math.max(0, Math.min(1, (currentScrollY - elementTop) / scrollRange));
      scrollYProgress.set(progress);
    };

    // Setup event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    // Setup MutationObserver to watch for layout shifts / dynamic heights
    const observer = new MutationObserver(handleScroll);
    if (document.body) {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true 
      });
    }

    // A fallback check after a short delay to ensure everything settled
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [ref, scrollYProgress]);

  return scrollYProgress;
}
import PhoneMockup from './PhoneMockup';
import { ArrowDown, ArrowRight, X } from 'lucide-react';

// Scattered questions — positioned absolutely across the viewport with dominant indicators
const REDESIGNED_QUESTIONS = [
  { text: "Can I trust this business?", x: "12%", y: "22%", rot: "-rotate-2", dominant: true, finalScale: 2.2 },
  { text: "What exactly are they selling?", x: "62%", y: "18%", rot: "rotate-2", dominant: true, finalScale: 2.2 },
  { text: "How much does it cost?", x: "55%", y: "72%", rot: "-rotate-3", dominant: true, finalScale: 2.2 },
  { text: "What do other customers say?", x: "8%", y: "76%", rot: "rotate-3", dominant: true, finalScale: 2.2 },
  { text: "What happens next?", x: "38%", y: "12%", rot: "-rotate-2", dominant: true, finalScale: 2.0 },
  { text: "Can I see real reviews?", x: "74%", y: "35%", rot: "-rotate-1", dominant: false, finalScale: 1.5 },
  { text: "Can I see previous work?", x: "5%", y: "45%", rot: "rotate-4", dominant: false, finalScale: 1.5 },
  { text: "Where are they located?", x: "78%", y: "82%", rot: "rotate-3", dominant: false, finalScale: 1.4 },
  { text: "Is this right for me?", x: "32%", y: "88%", rot: "rotate-2", dominant: false, finalScale: 1.8 },
  { text: "Why should I choose them?", x: "82%", y: "70%", rot: "rotate-2", dominant: false, finalScale: 1.6 },
  { text: "What is included?", x: "22%", y: "5%", rot: "-rotate-1", dominant: false, finalScale: 1.5 },
  { text: "Are there hidden charges?", x: "45%", y: "58%", rot: "rotate-3", dominant: false, finalScale: 1.6 },
  { text: "How does it work?", x: "48%", y: "40%", rot: "rotate-2", dominant: false, finalScale: 1.5 },
  { text: "How long does it take?", x: "42%", y: "30%", rot: "-rotate-2", dominant: false, finalScale: 1.5 },
  { text: "Can I see more photos?", x: "85%", y: "55%", rot: "-rotate-4", dominant: false, finalScale: 1.4 },
  { text: "Can I see videos?", x: "88%", y: "22%", rot: "-rotate-3", dominant: false, finalScale: 1.5 },
  { text: "What makes them different?", x: "15%", y: "38%", rot: "rotate-2", dominant: false, finalScale: 1.5 },
  { text: "Do they have real customers?", x: "25%", y: "62%", rot: "rotate-1", dominant: false, finalScale: 1.7 },
  { text: "Is this business legitimate?", x: "4%", y: "15%", rot: "rotate-1", dominant: false, finalScale: 1.4 },
  { text: "What are my options?", x: "70%", y: "8%", rot: "rotate-1", dominant: false, finalScale: 1.4 },
  { text: "Which option is right for me?", x: "30%", y: "20%", rot: "-rotate-2", dominant: false, finalScale: 1.6 },
  { text: "Can I visit first?", x: "66%", y: "26%", rot: "rotate-3", dominant: false, finalScale: 1.6 },
  { text: "What happens after I contact them?", x: "50%", y: "82%", rot: "-rotate-2", dominant: false, finalScale: 1.5 },
  { text: "Can I speak with someone?", x: "58%", y: "48%", rot: "-rotate-3", dominant: false, finalScale: 1.7 },
  { text: "Is it worth it?", x: "18%", y: "85%", rot: "-rotate-1", dominant: false, finalScale: 1.5 },
  { text: "Have others used this before?", x: "88%", y: "44%", rot: "-rotate-2", dominant: false, finalScale: 1.5 },
  { text: "Can I see customer results?", x: "64%", y: "62%", rot: "rotate-1", dominant: false, finalScale: 1.6 },
  { text: "Will this solve my problem?", x: "44%", y: "92%", rot: "-rotate-3", dominant: false, finalScale: 1.4 },
  { text: "Why should I trust them?", x: "2%", y: "55%", rot: "rotate-2", dominant: false, finalScale: 1.5 },
  { text: "What am I missing?", x: "72%", y: "92%", rot: "-rotate-1", dominant: false, finalScale: 1.5 }
];

// ─── Slide number label ───
const SlideLabel = ({ number, label }: { number: string; label: string }) => (
  <div className="flex items-center gap-3 mb-8">
    <span className="text-[10px] font-bold tracking-[0.25em] text-slate-300 uppercase">{number}</span>
    <div className="w-8 h-px bg-slate-200" />
    <span className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">{label}</span>
  </div>
);

// ─── Bullet point ───
const BulletPoint = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-center gap-4 text-slate-600 text-lg md:text-xl font-semibold tracking-tight"
  >
    <div className="w-2 h-2 rounded-full bg-red-500/70 shrink-0" />
    {children}
  </motion.div>
);

// ─── Question Node for Slide 6 (Scroll Story Driven) ───
const QuestionNode = ({ 
  q, 
  index, 
  scrollYProgress 
}: { 
  q: typeof REDESIGNED_QUESTIONS[0]; 
  index: number; 
  scrollYProgress: any 
}) => {
  // Stagger entry based on index in the window [0.56, 0.68]
  const entryStart = 0.56 + index * 0.0030;
  const entryEnd = entryStart + 0.010;
  const zoomEnd = 0.68;

  // 1. Opacity: Invisible on arrival -> entry fade-in -> fully bold
  const opacity = useTransform(
    scrollYProgress,
    [0.56, entryStart, entryEnd, zoomEnd],
    [0, 0, 0.6, 1.0]
  );

  // 2. Translate Y: Falls down from above the viewport
  const translateY = useTransform(
    scrollYProgress,
    [entryStart, entryEnd],
    [-120, 0]
  );

  // 3. Blur: Clears up on entry
  const blurVal = useTransform(
    scrollYProgress,
    [entryStart, entryEnd],
    [16, 0]
  );
  const filter = useTransform(blurVal, (b) => `blur(${b}px)`);

  // 4. Scale: Enters at 0.4 -> settles at 0.85 -> zooms to finalScale aggressively
  const scale = useTransform(
    scrollYProgress,
    [entryStart, entryEnd, zoomEnd],
    [0.4, 0.85, q.finalScale * 1.1]
  );

  // 5. Color & Contrast: Rose-red for dominant questions, dark grey/black for secondary
  const color = useTransform(
    scrollYProgress,
    [entryStart, entryEnd, zoomEnd],
    q.dominant
      ? ['rgba(225, 29, 72, 0.15)', 'rgba(225, 29, 72, 0.7)', 'rgba(225, 29, 72, 1.0)']
      : ['rgba(120, 140, 160, 0.15)', 'rgba(80, 100, 130, 0.7)', 'rgba(0, 0, 0, 1.0)']
  );

  // 6. Font weight: Bold/Black for dominant questions, Medium/Bold for secondary
  const fontWeight = useTransform(
    scrollYProgress,
    [entryStart, entryEnd, zoomEnd],
    q.dominant ? [400, 800, 950] : [400, 600, 700]
  );

  return (
    <motion.div
      style={{ 
        left: q.x, 
        top: q.y, 
        opacity, 
        y: translateY, 
        filter, 
        scale,
        color,
        fontWeight
      }}
      className={`absolute text-sm md:text-base tracking-tight whitespace-nowrap ${q.rot} pointer-events-none select-none z-10`}
    >
      {q.text}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useElementScrollProgress(containerRef);

  // 7 slides → 6 transitions → pause on Slide 6 (index 5, at -71.428%) & Slide 7 (index 6, at -85.714%)
  const x = useTransform(
    scrollYProgress,
    [0, 0.11, 0.22, 0.33, 0.44, 0.56, 0.68, 0.76, 0.98, 1.0],
    ['0%', '-14.286%', '-28.571%', '-42.857%', '-57.143%', '-71.428%', '-71.428%', '-85.714%', '-85.714%', '-85.714%']
  );

  const [activeScene, setActiveScene] = useState(1);

  // Map scroll progress to phone scenes
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.44) setActiveScene(4);      // deep into website slide → chaos
    else if (v > 0.34) setActiveScene(3); // entering website slide → clean site
    else if (v > 0.20) setActiveScene(2); // WhatsApp slide
    else setActiveScene(1);               // Ad / Hook
  });

  // ─── Slide 6 sequenced animations (Pause Window: 0.56 to 0.68) ───
  // 1. Text vanishes quickly as questions begin entering (0.56 to 0.60), and is invisible before/after
  const slide6TextOpacity = useTransform(scrollYProgress, [0, 0.54, 0.56, 0.57, 0.58, 1.0], [0, 0, 1, 1, 0, 0]);
  const slide6TextScale = useTransform(scrollYProgress, [0, 0.56, 0.58, 1.0], [0.8, 1, 0.8, 0.8]);

  // ─── Slide 7 exit transitions (0.68 to 1.0) ───
  const slide7Opacity = useTransform(scrollYProgress, [0, 0.68, 0.76, 0.98, 1.0], [0, 0, 1, 1, 0]);
  const slide7Y = useTransform(scrollYProgress, [0, 0.68, 0.76, 0.98, 1.0], [120, 120, 0, 0, -120]);

  // ─── Slide 7 Level Reveal Animations ───
  // Title fades in early
  const level7TitleOpacity = useTransform(scrollYProgress, [0.76, 0.78], [0, 1]);
  const level7TitleY = useTransform(scrollYProgress, [0.76, 0.78], [30, 0]);

  // Step 1: Questions Unanswered (appears immediately at 0.78 and stays)
  const step1Opacity = useTransform(scrollYProgress, [0.78, 0.80, 0.98], [0, 1, 1]);
  const step1X = useTransform(scrollYProgress, [0.78, 0.80], [-50, 0]);
  const step1Scale = useTransform(scrollYProgress, [0.78, 0.80], [0.8, 1]);

  // Step 2: No Trust Built (appears at 0.80 and stays)
  const step2Opacity = useTransform(scrollYProgress, [0.80, 0.82, 0.98], [0, 1, 1]);
  const step2X = useTransform(scrollYProgress, [0.80, 0.82], [50, 0]);
  const step2Scale = useTransform(scrollYProgress, [0.80, 0.82], [0.8, 1]);

  // Step 3: No Conversation (appears at 0.82 and stays)
  const step3Opacity = useTransform(scrollYProgress, [0.82, 0.84, 0.98], [0, 1, 1]);
  const step3X = useTransform(scrollYProgress, [0.82, 0.84], [-50, 0]);
  const step3Scale = useTransform(scrollYProgress, [0.82, 0.84], [0.8, 1]);

  // Step 4: Revenue Lost (appears at 0.84 and stays)
  const step4Opacity = useTransform(scrollYProgress, [0.84, 0.86, 0.98], [0, 1, 1]);
  const step4X = useTransform(scrollYProgress, [0.84, 0.86], [50, 0]);
  const step4Scale = useTransform(scrollYProgress, [0.84, 0.86], [0.7, 1]);

  // Timeline Container wrapper (fades out and goes display: none)
  const timelineContainerOpacity = useTransform(scrollYProgress, [0.76, 0.87, 0.90], [1, 1, 0]);
  const timelineContainerY = useTransform(scrollYProgress, [0.76, 0.87, 0.90], [0, 0, -30]);
  const timelineDisplay = useTransform(scrollYProgress, [0, 0.899, 0.90, 1], ['block', 'block', 'none', 'none']);

  // Quote reveals last (appears at 0.90 and stays)
  const quoteOpacity = useTransform(scrollYProgress, [0.90, 0.93, 0.98], [0, 1, 1]);
  const quoteY = useTransform(scrollYProgress, [0.90, 0.93], [30, 0]);
  const quoteDisplay = useTransform(scrollYProgress, [0, 0.899, 0.90, 1], ['none', 'none', 'block', 'block']);

  return (
    <div ref={containerRef} id="trap" className="h-[1250vh] bg-slate-50 relative border-t border-slate-100 satoshi-story">
      <style>{`
        @font-face {
          font-family: 'Satoshi';
          src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
               url('/fonts/Satoshi-Variable.ttf') format('truetype');
          font-weight: 300 900;
          font-display: swap;
          font-style: normal;
        }
        .satoshi-story, .satoshi-story * {
          font-family: 'Satoshi', system-ui, sans-serif !important;
        }
      `}</style>
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        <motion.div style={{ x }} className="flex w-[700vw] h-full items-stretch">

          {/* ═══════════════════════════════════════════
              SLIDE 1 — Intro Statement
          ═══════════════════════════════════════════ */}
          <div className="w-[100vw] h-full flex flex-col items-center justify-center px-6 text-center shrink-0 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative z-10 max-w-4xl">
              <span className="text-[11px] md:text-xs font-bold tracking-[0.3em] text-slate-400 uppercase mb-6 block">
                The Traditional Trap
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold tracking-[-0.03em] text-[#0A0A0A] leading-[1.05]">
                Why sending traffic straight to WhatsApp or a generic website{' '}
                <span className="text-red-600">fails.</span>
              </h2>
            </div>
            <motion.div
              style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
            >
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase">Scroll sideways to explore</span>
              <motion.div
                animate={{ x: [-4, 4, -4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight size={14} />
              </motion.div>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════
              SLIDE 2 — The Hook
          ═══════════════════════════════════════════ */}
          <div className="w-[100vw] h-full flex items-center justify-center px-6 md:px-16 lg:px-24 shrink-0">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl w-full">
              <div className="lg:w-1/2 flex flex-col justify-center">
                <SlideLabel number="01" label="The Hook" />
                <h3 className="text-3xl md:text-5xl lg:text-[56px] font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.1] mb-6">
                  The Ad Works.
                </h3>
                <p className="text-slate-500 font-medium text-lg md:text-xl leading-relaxed max-w-lg">
                  You run a perfect ad. The customer loves the product. They click your Call to Action — ready to buy.
                </p>
              </div>
              <div className="lg:w-1/2 h-[380px] sm:h-[480px] lg:h-auto flex items-center justify-center overflow-visible">
                <PhoneMockup activeScene={activeScene} overrideScene={1} />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              SLIDE 3 — The WhatsApp Trap
          ═══════════════════════════════════════════ */}
          <div className="w-[100vw] h-full flex items-center justify-center px-6 md:px-16 lg:px-24 shrink-0">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl w-full">
              <div className="lg:w-1/2 flex flex-col justify-center">
                <SlideLabel number="02" label="The WhatsApp Trap" />
                <h3 className="text-3xl md:text-5xl lg:text-[56px] font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.1] mb-6">
                  Zero Context.
                </h3>
                <p className="text-slate-500 font-medium text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                  They came from an image. They have no information. Messages flood in — you spend hours typing the same answers.
                </p>
                <div className="space-y-4">
                  <BulletPoint delay={0}>Multiple chat windows open</BulletPoint>
                  <BulletPoint delay={0.1}>Customers stop replying mid-conversation</BulletPoint>
                  <BulletPoint delay={0.2}>Stressful, chaotic & unscalable</BulletPoint>
                </div>
              </div>
              <div className="lg:w-1/2 h-[380px] sm:h-[480px] lg:h-auto flex items-center justify-center overflow-visible">
                <PhoneMockup activeScene={activeScene} overrideScene={2} />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              SLIDE 4 — The Website Trap
          ═══════════════════════════════════════════ */}
          <div className="w-[100vw] h-full flex items-center justify-center px-6 md:px-16 lg:px-24 shrink-0">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl w-full">
              <div className="lg:w-1/2 flex flex-col justify-center">
                <SlideLabel number="03" label="The Website Trap" />
                <h3 className="text-3xl md:text-5xl lg:text-[56px] font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.1] mb-6">
                  Interest Doesn&apos;t Mean Understanding.
                </h3>
                <p className="text-slate-500 font-medium text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                  A standard website overwhelms impulsive social media traffic. Blogs, newsletters, 15-page menus — they browse, get confused, and leave.
                </p>
                <div className="space-y-4">
                  <BulletPoint delay={0}>Too many pages</BulletPoint>
                  <BulletPoint delay={0.1}>Too many distractions</BulletPoint>
                  <BulletPoint delay={0.2}>Too many decisions</BulletPoint>
                </div>
              </div>
              <div className="lg:w-1/2 h-[380px] sm:h-[480px] lg:h-auto flex items-center justify-center overflow-visible">
                <PhoneMockup activeScene={activeScene} overrideScene={activeScene >= 4 ? 4 : 3} />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              SLIDE 5 — The Hidden Dropoff (Realization)
          ═══════════════════════════════════════════ */}
          <div className="w-[100vw] h-full flex flex-col items-center justify-center px-6 text-center relative shrink-0">
            {/* Subtle background grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative z-20 flex flex-col items-center max-w-4xl">
              <SlideLabel number="04" label="The Hidden Dropoff" />

              <motion.h3
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-6xl lg:text-[72px] font-black tracking-[-0.03em] leading-[1.05] text-[#0A0A0A]"
              >
                The customer wasn&apos;t looking for WhatsApp.
                <br />
                <span className="text-slate-400 font-bold">
                  They were looking for{' '}
                  <span className="brand-gradient-text">
                    answers.
                  </span>
                </span>
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 text-slate-500 font-semibold text-lg md:text-2xl max-w-3xl leading-relaxed"
              >
                Most customers don&apos;t leave because they aren&apos;t interested.
                <br />
                <span className="text-[#0A0A0A] font-black">
                  They leave because they still have unanswered questions.
                </span>
              </motion.p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              SLIDE 6 — The Objection Flood
          ═══════════════════════════════════════════ */}
          <div className="w-[100vw] h-full flex items-center justify-center px-6 relative overflow-hidden shrink-0">
            {/* Ambient warning glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-red-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

            {/* Scattered questions — dynamically entering and scaling */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
              {REDESIGNED_QUESTIONS.map((q, i) => (
                <QuestionNode 
                  key={i} 
                  q={q} 
                  index={i} 
                  scrollYProgress={scrollYProgress} 
                />
              ))}
            </div>

            {/* Radial fade over the edges */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(248_250_252)_80%)]" />

            {/* Central Text (No Card) — fades out as questions enter and grow */}
            <motion.div 
              style={{ opacity: slide6TextOpacity, scale: slide6TextScale }}
              className="flex flex-col items-center text-center max-w-4xl z-20 relative"
            >
              <SlideLabel number="05" label="The Objection Flood" />
              
              <motion.h2
                className="text-4xl md:text-6xl lg:text-[72px] font-extrabold tracking-[-0.03em] text-slate-900 mb-8 leading-[1.1]"
              >
                The Questions Holding Them Back.
              </motion.h2>

              <motion.p
                className="text-slate-500 font-medium text-xl md:text-2xl leading-relaxed max-w-2xl"
              >
                Every interested customer has unanswered questions before they trust a business enough to take the next step.
              </motion.p>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════
              SLIDE 7 — The Financial Pain
          ═══════════════════════════════════════════ */}
          <motion.div 
            style={{ opacity: slide7Opacity, y: slide7Y }}
            className="w-[100vw] h-full flex flex-col items-center justify-center px-6 text-center relative shrink-0"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />
            
            {/* Ambient danger gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] bg-gradient-to-r from-red-500/[0.03] via-orange-500/[0.02] to-transparent blur-[140px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-5xl w-full">
              <SlideLabel number="06" label="Cost of Unanswered Questions" />
              
              <motion.div
                style={{ opacity: timelineContainerOpacity, y: timelineContainerY, display: timelineDisplay }}
                className="w-full flex flex-col items-center"
              >
                <motion.h2 
                  style={{ opacity: level7TitleOpacity, y: level7TitleY }}
                  className="text-3xl md:text-5xl lg:text-[54px] font-black tracking-[-0.03em] text-[#0A0A0A] mt-6 mb-8 leading-[1.1]"
                >
                  The Cost of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Unanswered Questions.</span>
                </motion.h2>

                {/* Zig-Zag Timeline */}
                <div className="relative w-full max-w-4xl mx-auto mb-6">
                  {/* Vertical Center Line (Desktop Only) */}
                  <div className="absolute left-1/2 top-[26px] bottom-[26px] w-[2px] bg-gradient-to-b from-slate-200 via-orange-300 to-red-400 -translate-x-1/2 hidden md:block z-0" />

                  <div className="flex flex-col gap-4 md:gap-6 relative">
                    {/* Step 1 - Left */}
                    <motion.div 
                      style={{ opacity: step1Opacity, x: step1X, scale: step1Scale }}
                      className="flex flex-col md:flex-row items-center justify-start w-full relative"
                    >
                      {/* Badge */}
                      <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 z-20 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md mb-2 md:mb-0">
                        01
                      </div>
                      {/* Content Card */}
                      <div className="w-full md:w-[45%] pr-0 md:pr-6 text-center md:text-right">
                        <div
                          className="bg-white/95 backdrop-blur-sm border border-slate-200/60 px-5 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                        >
                          <h3 className="text-base md:text-lg font-black text-slate-900 mb-0.5">Questions Unanswered</h3>
                          <p className="text-[11px] md:text-xs text-slate-500 font-semibold">Your customer has doubts about price, quality, legitimacy, or&nbsp;fit</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Step 2 - Right */}
                    <motion.div 
                      style={{ opacity: step2Opacity, x: step2X, scale: step2Scale }}
                      className="flex flex-col md:flex-row items-center justify-end w-full relative"
                    >
                      {/* Badge */}
                      <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 z-20 w-9 h-9 rounded-full bg-[#FFF0E6] text-orange-700 border border-orange-200 flex items-center justify-center font-black text-sm shadow-sm mb-2 md:mb-0">
                        02
                      </div>
                      {/* Content Card */}
                      <div className="w-full md:w-[45%] pl-0 md:pl-6 text-center md:text-left">
                        <div
                          className="bg-white/95 backdrop-blur-sm border border-slate-200/60 px-5 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                        >
                          <h3 className="text-base md:text-lg font-black text-slate-900 mb-0.5">No Trust Built</h3>
                          <p className="text-[11px] md:text-xs text-slate-500 font-semibold">They hesitate because they don&apos;t have enough information to feel&nbsp;confident</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Step 3 - Left */}
                    <motion.div 
                      style={{ opacity: step3Opacity, x: step3X, scale: step3Scale }}
                      className="flex flex-col md:flex-row items-center justify-start w-full relative"
                    >
                      {/* Badge */}
                      <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 z-20 w-9 h-9 rounded-full bg-[#FEECE0] text-orange-800 border border-orange-300 flex items-center justify-center font-black text-sm shadow-sm mb-2 md:mb-0">
                        03
                      </div>
                      {/* Content Card */}
                      <div className="w-full md:w-[45%] pr-0 md:pr-6 text-center md:text-right">
                        <div
                          className="bg-white/95 backdrop-blur-sm border border-slate-200/60 px-5 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                        >
                          <h3 className="text-base md:text-lg font-black text-slate-900 mb-0.5">No Conversation Starts</h3>
                          <p className="text-[11px] md:text-xs text-slate-500 font-semibold">They ghost you, message competitors, or keep browsing&nbsp;elsewhere</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Step 4 - Right */}
                    <motion.div 
                      style={{ opacity: step4Opacity, x: step4X, scale: step4Scale }}
                      className="flex flex-col md:flex-row items-center justify-end w-full relative"
                    >
                      {/* Badge */}
                      <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 z-20 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md mb-2 md:mb-0">
                        <X size={14} className="stroke-[3]" />
                      </div>
                      {/* Content Card */}
                      <div className="w-full md:w-[45%] pl-0 md:pl-6 text-center md:text-left">
                        <div
                          className="bg-gradient-to-br from-red-50 to-orange-50/50 border border-red-200 px-5 py-3.5 rounded-xl shadow-[0_12px_24px_rgba(239,68,68,0.04)]"
                        >
                          <h3 className="text-base md:text-lg font-black text-red-700 mb-0.5">Revenue Lost</h3>
                          <p className="text-[11px] md:text-xs text-red-600 font-black">A qualified lead walks away&nbsp;forever</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* The essence quote block with stronger design */}
              <motion.div 
                style={{ opacity: quoteOpacity, y: quoteY, display: quoteDisplay }}
                className="max-w-3xl w-full text-center bg-gradient-to-br from-slate-900 to-slate-800 px-8 md:px-12 py-10 md:py-14 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] border border-slate-700/30"
              >
                <p className="text-xl md:text-2xl font-bold text-slate-200 leading-relaxed mb-3">
                  The customer already wanted to buy.
                </p>
                <p className="text-3xl md:text-4xl font-black text-white leading-relaxed mb-6">
                  They just weren&apos;t ready to trust.
                </p>
                <div className="h-1 w-16 mx-auto bg-gradient-to-r from-[#2A5BEA] via-[#4E3BDA] to-[#7A44E8] rounded-full mb-6" />
                <p className="text-sm font-bold tracking-[0.3em] text-slate-300 uppercase">
                  This is exactly what <span className="text-white">Funnel</span><span className="brand-gradient-text">Link</span> solves
                </p>
              </motion.div>
            </div>
          </motion.div>


        </motion.div>
      </div>
    </div>
  );
}
