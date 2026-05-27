'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { defaultRooms2BHK, defaultRooms3BHK, defaultRooms4BHK } from "./EliteRealEstateLayouts";
import { createLead } from "@/app/actions/leads";
import type {
  CategoriesData,
  Content,
  HeroData,
  LocationData,
  ProductItem,
  ProductsData,
  SectionId,
  TestimonialsData,
  WhatsAppData,
} from '@/components/dashboard/editor/types';
import { createDefaultSections, getSectionData, REAL_ESTATE_TEMPLATE_ID } from '@/components/dashboard/editor/utils';

// ───────────────────────────────────────────────────────────────────────────────
// COORDINATES LOOKUP UTILITIES FOR INTERACTIVE BLUEPRINT
// ───────────────────────────────────────────────────────────────────────────────
function getRoomBlueprintCoords(roomId: string, index: number, totalRooms: number) {
  const coordinatesMap: Record<string, { x: number; y: number; w: number; h: number }> = {
    living: { x: 6, y: 8, w: 56, h: 44 },
    kitchen: { x: 6, y: 56, w: 36, h: 36 },
    master: { x: 46, y: 56, w: 48, h: 36 },
    deck: { x: 66, y: 8, w: 28, h: 44 },
    guest: { x: 54, y: 48, w: 22, h: 44 }
  };

  const idClean = String(roomId).toLowerCase();
  for (const k of Object.keys(coordinatesMap)) {
    if (idClean.includes(k)) {
      return coordinatesMap[k];
    }
  }

  // Fallback grid-based layout calculation if room ID does not match standard zones
  const columns = Math.ceil(Math.sqrt(totalRooms));
  const rows = Math.ceil(totalRooms / columns);
  const colIndex = index % columns;
  const rowIndex = Math.floor(index / columns);

  const w = Math.max(20, Math.floor(88 / columns));
  const h = Math.max(20, Math.floor(88 / rows));
  const x = 6 + colIndex * (w + 4);
  const y = 6 + rowIndex * (h + 4);

  return { x, y, w, h };
}

// ───────────────────────────────────────────────────────────────────────────────
// TEMPLATE PROPS
// ───────────────────────────────────────────────────────────────────────────────
type TemplateProps = {
  funnel: {
    id?: string;
    welcome_title?: string | null;
    welcome_description?: string | null;
    story_mode_data?: Array<{ content?: Partial<Content>; templateId?: string }>;
    slug?: string | null;
  };
  store?: {
    id?: string;
    name?: string | null;
    logo_url?: string | null;
    whatsapp_number?: string | null;
  };
  products?: any[];
  isPreview?: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  onEditSection?: (sectionId: SectionId) => void;
};

// ───────────────────────────────────────────────────────────────────────────────
// MAIN TEMPLATE
// ───────────────────────────────────────────────────────────────────────────────
export default function EliteRealEstateTemplate({
  funnel,
  store,
  products: propProducts,
  isPreview = false,
  previewMode,
  onEditSection,
}: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultSections = useMemo(() => createDefaultSections(REAL_ESTATE_TEMPLATE_ID), []);
  const savedContent = funnel.story_mode_data?.[0]?.content as Content | undefined;

  const content = useMemo(() => {
    const baseContent: Content = {
      storeName: savedContent?.storeName || store?.name || 'SAUNTER',
      logoUrl: savedContent?.logoUrl || store?.logo_url || '',
      whatsappNumber: savedContent?.whatsappNumber || store?.whatsapp_number || '919999999999',
      sections: savedContent?.sections && savedContent.sections.length > 0 ? savedContent.sections : defaultSections,
    };

    const heroData = getSectionData<HeroData>(
      baseContent,
      'content',
      defaultSections.find((section) => section.id === 'content')?.data as HeroData
    );
    const categoriesData = getSectionData<CategoriesData>(
      baseContent,
      'categories',
      defaultSections.find((section) => section.id === 'categories')?.data as CategoriesData
    );
    const productsData = getSectionData<ProductsData>(
      baseContent,
      'products',
      defaultSections.find((section) => section.id === 'products')?.data as ProductsData
    );
    const testimonialsData = getSectionData<TestimonialsData>(
      baseContent,
      'testimonials',
      defaultSections.find((section) => section.id === 'testimonials')?.data as TestimonialsData
    );
    const locationData = getSectionData<LocationData>(
      baseContent,
      'location',
      defaultSections.find((section) => section.id === 'location')?.data as LocationData
    );
    const whatsappData = getSectionData<WhatsAppData>(
      baseContent,
      'whatsapp',
      defaultSections.find((section) => section.id === 'whatsapp')?.data as WhatsAppData
    );

    return {
      baseContent,
      heroData,
      categoriesData,
      productsData,
      testimonialsData,
      locationData,
      whatsappData,
    };
  }, [defaultSections, savedContent, store?.logo_url, store?.name, store?.whatsapp_number]);

  const rawProducts = (propProducts && propProducts.length > 0) ? propProducts : content.productsData.products;

  const normalizedProducts = useMemo(() => {
    return rawProducts.map((product: any, productIdx: number) => {
      const is2BHK = product.name?.includes('2') || product.name?.toLowerCase().includes('two');
      const isPenthouseIndex = product.name?.includes('4') || product.name?.toLowerCase().includes('four') || product.name?.toLowerCase().includes('penthouse') || (!is2BHK && productIdx % 2 !== 0);

      const defaultRooms = isPenthouseIndex ? defaultRooms4BHK : (is2BHK ? defaultRooms2BHK : defaultRooms3BHK);
      const rawRooms = product.rooms || defaultRooms;

      const mappedRooms = rawRooms.map((room: any, rIdx: number) => {
        const roomId = room.id || `room-${rIdx}`;
        const coords = getRoomBlueprintCoords(roomId, rIdx, rawRooms.length);
        
        return {
          id: roomId,
          name: room.name || room.label || 'Room',
          area: room.area || room.sqft || '200 sqft',
          atmosphere: room.atmosphere || 'Serene space',
          note: room.note || room.description || room.desc || 'Designed around uninterrupted sea views and natural light.',
          details: room.details || room.notes || ['Premium finish', 'High ceiling'],
          images: room.images || [room.img || room.image].filter(Boolean) || [product.image_url || product.image].filter(Boolean),
          x: room.x !== undefined ? room.x : coords.x,
          y: room.y !== undefined ? room.y : coords.y,
          w: room.w !== undefined ? room.w : coords.w,
          h: room.h !== undefined ? room.h : coords.h,
          label: room.label || room.name || 'Room',
          direction: room.direction || {
            x: rIdx % 2 === 0 ? -30 : 30,
            y: rIdx % 3 === 0 ? -20 : 20,
            scale: 1.02
          }
        };
      });

      return {
        id: product.id ?? `prop-${Date.now()}`,
        category_id: product.category_id || 'luxury',
        name: product.name ?? (isPenthouseIndex ? '4 BHK Penthouse' : '3 BHK Signature'),
        priceLabel: product.priceLabel || (product.price ? `₹ ${product.price.toLocaleString('en-IN')}` : (isPenthouseIndex ? '₹ 8.5 Cr' : '₹ 6.2 Cr')),
        image: product.image_url || product.image || (isPenthouseIndex ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80" : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80"),
        image2: product.image_url_2 || product.image2 || undefined,
        urgency: product.urgency || (isPenthouseIndex ? 'Last Unit Available' : '3 Units Remaining'),
        delivery: product.delivery || 'Possession: Q4 2025',
        description: product.description || (isPenthouseIndex ? 'Full-floor residence with private plunge pool and 360° skyline.' : 'Sea-facing living volume with private deck and architectural light wells.'),
        dimensions: product.dimensions || (isPenthouseIndex ? '2,140 sqft' : '1,850 sqft'),
        tier: product.tier || 'most_popular',
        rooms: mappedRooms,
        compassAngle: product.compassAngle,
        sunSide: product.sunSide,
        ownership: product.ownership,
        automotive: product.automotive,
        propertyDetailsTitle: product.propertyDetailsTitle,
        ownershipLabel: product.ownershipLabel,
        deliveryLabel: product.deliveryLabel,
        automotiveLabel: product.automotiveLabel,
        spaceCtaText: product.spaceCtaText
      };
    });
  }, [rawProducts]);

  const [screen, setScreen] = useState<'home' | 'residences' | 'tour'>('home');
  const [residenceId, setResidenceId] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<any>(null);
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);
  const [modalTop, setModalTop] = useState<number>(0);
  const [modalHeight, setModalHeight] = useState<number | string>('100vh');
  
  // Buyer Qualification Form State
  const [qBudget, setQBudget] = useState('');
  const [qPurpose, setQPurpose] = useState('');
  const [qTimeline, setQTimeline] = useState('');
  const [qPreference, setQPreference] = useState('');

  const openConcierge = useCallback(() => {
    let parent = containerRef.current?.parentElement;
    while (parent) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll' || parent.id === 'mobile-scroll-container') {
        break;
      }
      parent = parent.parentElement;
    }
    
    if (parent) {
      setModalTop(parent.scrollTop);
      setModalHeight(parent.clientHeight);
    } else {
      setModalTop(window.scrollY || document.documentElement.scrollTop);
      setModalHeight(window.innerHeight || '100vh');
    }
    setIsConciergeOpen(true);
  }, []);

  // Scroll to top when screen changes
  useEffect(() => {
    // Scroll window
    if (!isPreview) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    // Find closest scrollable parent in editor and scroll it
    let node = containerRef.current?.parentElement;
    while (node) {
      const overflowY = window.getComputedStyle(node).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        node.scrollTop = 0;
        break;
      }
      node = node.parentElement;
    }
  }, [screen, isPreview]);

  const activeResidence = useMemo(() => {
    const match = normalizedProducts.find((p) => p.id === residenceId);
    return match || normalizedProducts[0];
  }, [normalizedProducts, residenceId]);

  // Smart pre-load: only hero images per product (rooms load on-demand in Tour)
  useEffect(() => {
    normalizedProducts.forEach((p) => {
      if (p.image) {
        const img = new Image();
        img.src = p.image;
      }
    });
  }, [normalizedProducts]);

  const handleWhatsAppCTA = useCallback(
    async (intent: string, product?: any, messageOverride?: string) => {
      const number = content.baseContent.whatsappNumber?.replace(/\D/g, '') || '';
      if (!number) return;

      if (!isPreview) {
        await createLead(
          funnel?.id || 'preview',
          store?.id || 'preview',
          'Visitor',
          '',
          JSON.stringify({ type: 'cta_click', source: intent, productId: product?.id }),
          product?.id
        );
      }

      let message = messageOverride || `Hi ${content.baseContent.storeName || "SAUNTER"},\n\n`;
      if (!messageOverride) {
        if (product) {
          message = (content.whatsappData.productInquiryText || message)
            .replaceAll('{product_name}', product.name)
            .replaceAll('{category}', selectedPersona?.label || 'General Inquiry')
            .replaceAll('{store_name}', content.baseContent.storeName || "SAUNTER");
        } else {
          message = (content.whatsappData.welcomeMessage || message)
            .replaceAll('{category}', selectedPersona?.label || 'General Inquiry')
            .replaceAll('{store_name}', content.baseContent.storeName || "SAUNTER");
        }
      }

      if (selectedPersona) {
        message += `\n\nI am particularly interested as a: *${selectedPersona.label}* (${selectedPersona.tagline}).`;
      }

      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    },
    [content.baseContent.storeName, content.baseContent.whatsappNumber, content.whatsappData.productInquiryText, content.whatsappData.welcomeMessage, funnel?.id, isPreview, store?.id, selectedPersona]
  );

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#FAF9F5] text-[#1C1917] selection:bg-[#9A7B44]/20 font-sans">
      <style dangerouslySetInnerHTML={{
        __html: `
         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');
         .font-serif { font-family: 'Cormorant Garamond', serif; }
         .font-sans { font-family: 'Inter', system-ui, sans-serif; }
         .no-scrollbar::-webkit-scrollbar { display:none; }
         .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
         
         /* Premium Scrollbar */
         .premium-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
         .premium-scroll::-webkit-scrollbar-track { background: transparent; }
         .premium-scroll::-webkit-scrollbar-thumb { background: #1D1B18; border-radius: 3px; }
         .premium-scroll::-webkit-scrollbar-thumb:hover { background: #C5A26B; }
       `}} />

      <TopBar
        brandName={content.baseContent.storeName || "SAUNTER"}
        onHome={() => setScreen("home")}
        isPreview={isPreview}
        previewMode={previewMode}
      />

      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Home
               content={content}
               normalizedProducts={normalizedProducts}
               onExplore={() => setScreen("residences")}
               isPreview={isPreview}
               previewMode={previewMode}
               onEditSection={onEditSection}
               selectedPersona={selectedPersona}
               setSelectedPersona={setSelectedPersona}
               handleWhatsAppCTA={handleWhatsAppCTA}
               openConcierge={openConcierge}
             />
          </motion.div>
        )}
        {screen === "residences" && (
          <motion.div
            key="res"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Residences
              products={normalizedProducts}
              onBack={() => setScreen("home")}
              onPick={(id) => {
                setResidenceId(id);
                setScreen("tour");
              }}
              isPreview={isPreview}
              previewMode={previewMode}
              onEditSection={onEditSection}
            />
          </motion.div>
        )}
        {screen === "tour" && (
          <motion.div
            key="tour"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tour
              residence={activeResidence}
              onBack={() => setScreen("residences")}
              onWhatsApp={handleWhatsAppCTA}
              storeName={content.baseContent.storeName || "SAUNTER"}
              isPreview={isPreview}
              previewMode={previewMode}
              onEditSection={onEditSection}
              heroData={content.heroData}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {screen === "home" && (
        <ActionBar
          onExplore={(residenceId) => {
            if (residenceId) setResidenceId(residenceId);
            setScreen("residences");
          }}
          onWhatsApp={(msg) => handleWhatsAppCTA("action_bar_whatsapp", activeResidence, msg)}
          onVisit={(msg) => handleWhatsAppCTA("action_bar_visit", activeResidence, msg)}
          products={normalizedProducts}
          isPreview={isPreview}
          previewMode={previewMode}
          storeName={content.baseContent.storeName || "SAUNTER"}
          activeResidence={activeResidence}
          whatsappNumber={content.baseContent.whatsappNumber || ''}
        />
      )}

      {/* ── Bespoke Concierge Modal (Ultra Premium) ── */}
      <AnimatePresence>
        {isConciergeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 w-full z-[999999] bg-[#0A0A0A]/80 backdrop-blur-md p-4 md:p-6 flex items-center justify-center"
            onClick={() => setIsConciergeOpen(false)}
            style={{ 
              top: modalTop, 
              height: modalHeight, 
              zIndex: 999999 
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white rounded-2xl p-8 md:p-10 shadow-2xl border border-[#E7E5E4] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsConciergeOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#E7E5E4] flex items-center justify-center text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F5F5F4] transition-all duration-300"
              >
                ✕
              </button>

              <div className="mb-8 relative z-10 text-center">
                <span className="inline-block px-3 py-1 bg-[#FAF9F5] border border-[#E7E5E4] rounded-full text-[9px] tracking-[0.25em] uppercase font-bold text-[#78716C] mb-4">
                  Personalized Match
                </span>
                <h3 className="font-serif text-3xl text-[#1C1917] leading-tight">What are your priorities?</h3>
                <p className="text-sm text-[#78716C] mt-3 leading-relaxed max-w-sm mx-auto">
                  Select your preferences so we can connect you with the right advisor.
                </p>
              </div>

              <div className="flex flex-col gap-5 mb-8 relative z-10 overflow-y-auto max-h-[50vh] pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#E7E5E4 transparent' }}>
                {[
                  { id: 'budget', label: 'Budget', options: ['₹1–2 Cr', '₹2–5 Cr', '₹5 Cr+'], state: qBudget, setter: setQBudget },
                  { id: 'purpose', label: 'Purpose', options: ['Family Home', 'Investment', 'Upgrade'], state: qPurpose, setter: setQPurpose },
                  { id: 'timeline', label: 'Timeline', options: ['Immediate', '3 Months', 'Exploring'], state: qTimeline, setter: setQTimeline },
                  { id: 'preference', label: 'Preference', options: ['View', 'Privacy', 'Sunlight', 'Balcony', 'Vastu'], state: qPreference, setter: setQPreference }
                ].map((q) => (
                  <div key={q.id} className="w-full text-left bg-[#FAF9F5] border border-[#E7E5E4] p-5 rounded-xl">
                    <h4 className="font-serif text-lg text-[#1C1917] mb-4">{q.label}</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {q.options.map(opt => (
                        <button 
                          key={opt}
                          onClick={() => q.setter(opt)}
                          className={`px-4 py-2.5 rounded-full border text-[11px] uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${q.state === opt ? 'border-[#1C1917] bg-[#1C1917] text-white' : 'border-[#E7E5E4] bg-white text-[#78716C] hover:border-[#1C1917]/30 hover:text-[#1C1917]'}`}
                        >
                          {q.state === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4 pt-4 relative z-10 border-t border-[#E7E5E4] mt-2">
                <button
                  onClick={() => {
                     setIsConciergeOpen(false);
                     let msg = `Hi ${content.baseContent.storeName || 'Advisor'},\n\nI would like to schedule a private consultation for the residences.\n\nHere are my preferences:\n` + 
                     (qBudget ? `• Budget: ${qBudget}\n` : '') +
                     (qPurpose ? `• Purpose: ${qPurpose}\n` : '') +
                     (qTimeline ? `• Timeline: ${qTimeline}\n` : '') +
                     (qPreference ? `• Priority: ${qPreference}\n` : '') +
                     `\nPlease let me know the next steps.`;
                     handleWhatsAppCTA("concierge_qualification", null, msg);
                  }}
                  className="w-full py-4 bg-[#1C1917] text-white text-[11px] uppercase tracking-widest font-bold rounded-xl hover:bg-black transition-colors duration-400"
                >
                  Connect With Advisor →
                </button>
                <button
                  onClick={() => {
                    setIsConciergeOpen(false);
                    let message = `Hi ${content.baseContent.storeName || "Advisor"},\n\nI am inquiring about the residences. Please connect me to an advisor.`;
                    handleWhatsAppCTA("concierge_skip", null, message);
                  }}
                  className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#A8A29E] hover:text-[#1C1917] transition-colors underline underline-offset-4 decoration-[#E7E5E4] hover:decoration-[#1C1917]"
                >
                  Skip & Ask General Inquiry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// REUSABLE SUB-COMPONENTS
// ───────────────────────────────────────────────────────────────────────────────

function TopBar({
  brandName,
  onHome,
  isPreview,
  previewMode
}: {
  brandName: string;
  onHome: () => void;
  isPreview?: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
}) {
  const isMobilePreview = isPreview && previewMode === 'mobile';

  return (
    <header
      className={`${
        isPreview
          ? `absolute inset-x-0 ${isMobilePreview ? 'top-6' : 'top-0'}`
          : 'fixed top-0 inset-x-0'
      } z-40 bg-white/80 backdrop-blur-md border-b border-[#E7E5E4]/50 shadow-sm`}
    >
      <div
        className={`max-w-[1400px] mx-auto ${isMobilePreview ? 'px-5' : 'px-5 md:px-10'} flex items-center justify-center ${
          isMobilePreview ? 'h-16 pt-2' : 'h-14'
        }`}
      >
        <button
          onClick={onHome}
          className={`font-serif group flex items-center justify-center gap-1.5 ${
            isMobilePreview ? 'text-sm' : 'text-sm md:text-lg'
          } tracking-[0.08em] text-[#1C1917] hover:text-[#9A7B44] transition-colors cursor-pointer uppercase whitespace-nowrap truncate max-w-[90%]`}
        >
          <span>{brandName}</span>
        </button>
      </div>
    </header>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-3 border-b border-[#E7E5E4]">
      <span className="text-[10px] tracking-[0.28em] uppercase text-[#A8A29E]">{label}</span>
      <span className="font-serif text-lg text-[#1C1917]">{value}</span>
    </div>
  );
}

function Home({
  content,
  normalizedProducts,
  onExplore,
  isPreview,
  previewMode,
  onEditSection,
  selectedPersona,
  setSelectedPersona,
  handleWhatsAppCTA,
  openConcierge
}: {
  content: any;
  normalizedProducts: any[];
  onExplore: () => void;
  isPreview: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  onEditSection?: (sectionId: SectionId) => void;
  selectedPersona: any;
  setSelectedPersona: (persona: any) => void;
  handleWhatsAppCTA: (intent: string, product?: any, messageOverride?: string) => void;
  openConcierge: () => void;
}) {
  const isMobilePreview = isPreview && previewMode === 'mobile';
  const isTabletPreview = isPreview && previewMode === 'tablet';
  const isCompact = isMobilePreview || isTabletPreview;
  const { heroData, locationData, categoriesData, testimonialsData } = content;
  // Intercept the long default text
  const taglineText = heroData?.tagline === 'Sea-facing 3 & 4 BHK residences in Worli starting ₹6.2 Cr' ? 'Own The Skyline' : (heroData?.tagline || 'Own The Skyline');
  const subTaglineText = heroData?.subTagline === 'Private decks, natural ventilation, and skyline views.' ? 'Private sea-facing residences with panoramic views.' : (heroData?.subTagline || 'Private sea-facing residences with panoramic skyline views.');
  const experienceCenterAddress = locationData?.experienceCenterAddress === 'Tower 3, Baner Hills, Pune' ? 'Worli Sea Face · Mumbai' : (locationData?.experienceCenterAddress || 'Worli Sea Face · Mumbai');
  const ctaText = (heroData?.heroCtaText === 'Book Private Visit' || heroData?.heroCtaText === 'Explore Layouts') ? 'Explore Residences' : (heroData?.heroCtaText || 'Explore Residences');

  const startingPrice = heroData?.startingPrice || normalizedProducts[0]?.priceLabel || "₹ 6.2 Cr";
  const status = heroData?.status || normalizedProducts[0]?.delivery || "Ready for Possession";
  const heroImage = heroData?.heroImage || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80";

  return (
    <main className={`${isCompact ? 'pt-24' : 'pt-14'}`}>
      {/* ── FULLSCREEN HERO ── */}
      <section
        className={`relative w-full ${isCompact ? 'h-[88vh]' : 'h-[92vh]'} overflow-hidden cursor-pointer`}
        onClick={() => isPreview && onEditSection?.('content')}
      >
        <img
          src={heroImage}
          alt={heroData?.tagline || "Residences"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Adjusted gradients for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

        {/* Center — title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className={`text-[10px] tracking-widest uppercase text-white/70 mb-4 font-semibold drop-shadow-md`}>
            {experienceCenterAddress}
          </p>
          <h1 className={`font-serif ${isCompact ? 'text-4xl' : 'text-5xl md:text-6xl lg:text-[4.5rem]'} leading-[1.05] text-white tracking-tight drop-shadow-lg max-w-4xl`}>
            {taglineText}
          </h1>
          <p className={`mt-6 ${isCompact ? 'text-sm' : 'text-base'} text-white/80 max-w-lg leading-relaxed drop-shadow-md`}>
            {subTaglineText}
          </p>
        </div>

        {/* Bottom row — CTA + price (App-like side-by-side layout) */}
        <div className={`absolute bottom-0 left-0 right-0 ${isCompact ? 'px-5 pb-5' : 'px-8 md:px-14 pb-10'}`}>
          <div className={`border-t border-white/15 pt-4 md:pt-5 flex flex-row items-center justify-between ${isCompact ? 'gap-2' : 'gap-4'}`}>
            <div className="flex flex-col min-w-0 pr-2">
              <span className={`text-white/60 ${isCompact ? 'text-[7px]' : 'text-[8px] md:text-[9px]'} uppercase tracking-wider font-semibold mb-1 truncate`}>
                Starting Price {status ? `· ${status}` : ''}
              </span>
              <span className={`text-white font-serif ${isCompact ? 'text-lg' : 'text-xl md:text-3xl'} drop-shadow-md leading-none truncate`}>{startingPrice}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onExplore(); }}
              className={`group inline-flex items-center justify-center gap-1.5 bg-white text-[#1C1917] ${
                isCompact ? 'px-3.5 py-3 text-[8px]' : 'px-8 py-4 text-[11px]'
              } tracking-[0.15em] md:tracking-[0.2em] uppercase font-bold hover:bg-[#9A7B44] hover:text-white transition-all duration-400 cursor-pointer rounded-sm shrink-0 whitespace-nowrap`}
            >
              {ctaText} <span className="transition-transform duration-400 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── EMOTIONAL STORYTELLING (CINEMATIC) ── */}
      <section
        className={`max-w-[1400px] mx-auto px-5 ${isCompact ? 'py-16' : 'md:px-10 py-28'} flex flex-col items-center justify-center text-center cursor-pointer relative`}
        onClick={() => isPreview && onEditSection?.('content')}
      >
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
           className="relative z-10"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#9A7B44] font-bold mb-6 block">The Experience</span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#1C1917] leading-tight max-w-4xl mx-auto mb-8 tracking-tight">
            {heroData?.emotionalTitle || "Wake up above the skyline."}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-[#78716C] leading-relaxed max-w-2xl mx-auto font-serif italic">
            {heroData?.emotionalBody || "Private decks. Morning light. Quiet elevation above the city. A sanctuary designed for those who value space as the ultimate luxury."}
          </p>
        </motion.div>
        
        {/* Subtle decorative atmospheric element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-gradient-to-b from-transparent via-[#FAF9F5] to-transparent opacity-80 pointer-events-none" />
      </section>

      {/* ── AVAILABLE RESIDENCES ── */}
      <section
        className={`max-w-[1400px] mx-auto px-5 ${isCompact ? '' : 'md:px-10'} pb-20 pt-10 cursor-pointer`}
        onClick={() => isPreview && onEditSection?.('products')}
      >
        <div className="flex items-end justify-between mb-10 border-b border-[#E7E5E4] pb-6">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-[#9A7B44] font-medium">
              Available
            </span>
            <h2 className="font-serif text-3xl text-[#1C1917] mt-1">
              Residences
            </h2>
          </div>
          <span className="text-[10px] text-[#78716C] tracking-wider uppercase">
            {normalizedProducts.length} configurations
          </span>
        </div>

        <div className={`grid ${isCompact ? 'grid-cols-1 gap-10' : 'grid-cols-1 md:grid-cols-3 gap-8'}`}>
          {normalizedProducts.map((p: any, idx: number) => {
            const rooms = p.rooms || [];
            return (
              <div
                key={p.id}
                onClick={(e) => { e.stopPropagation(); onExplore(); }}
                className="group relative cursor-pointer"
              >
                {/* Image panel */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F0EDE5]">
                  <img
                    src={p.image || heroImage}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Scarcity badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[9px] font-semibold tracking-wider bg-white/95 text-[#1C1917] uppercase rounded-sm shadow-sm">
                      {p.urgency || 'Available'}
                    </span>
                  </div>

                  {/* Overlay text */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] text-white/60 uppercase tracking-wider">{p.dimensions || '—'}</p>
                    <h3 className="text-white font-serif text-2xl mt-0.5 leading-tight">{p.name}</h3>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between px-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-xl text-[#1C1917]">{p.priceLabel}</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#9A7B44] group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
                    View Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>






      {/* ── LOCATION ── */}
      <section
        className={`max-w-[1400px] mx-auto px-5 ${isCompact ? '' : 'md:px-10'} py-16 cursor-pointer`}
        onClick={() => isPreview && onEditSection?.('location')}
      >
        {/* Header - Left Aligned Editorial Style */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-[#9A7B44]" />
            <span className="text-[10px] tracking-widest uppercase text-[#9A7B44] font-bold">
              Location
            </span>
          </div>
          <h2 className={`font-serif ${isCompact ? 'text-4xl' : 'text-5xl'} text-[#1C1917] leading-tight`}>
            {locationData?.experienceCenterName || "Project Site"}
          </h2>
          <p className="text-sm text-[#78716C] mt-3 max-w-md">
            {locationData?.experienceCenterAddress || "Tower 3, Baner Hills, Pune"}
          </p>
        </div>

        {/* Map Container - Clean and Unobstructed */}
        <div className={`relative w-full ${isCompact ? 'h-[320px]' : 'h-[460px]'} bg-[#E7E5E4] rounded-sm overflow-hidden border border-[#E7E5E4]/60`}>
          {locationData?.mapLink?.includes('http') && locationData.mapLink.includes('embed') ? (
            <iframe
              src={locationData.mapLink}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <img
              src={locationData?.mapImage || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"}
              alt="Location"
              className="w-full h-full object-cover opacity-95"
            />
          )}
        </div>

        {/* Connectivity Grid - Pulled OUT of the map for an elite architectural layout */}
        <div className="mt-6 border border-[#E7E5E4] rounded-sm bg-white shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E7E5E4]">
            {(locationData?.connectivity || [
              { label: "Highway", time: "3 min" },
              { label: "Hospital", time: "5 min" },
              { label: "Airport", time: "25 min" },
              { label: "Metro", time: "8 min" },
            ]).map((c: any, index: number) => (
              <div key={c.label} className={`p-5 flex flex-col gap-1.5 ${isCompact && index < 2 ? 'border-b border-[#E7E5E4]' : ''}`}>
                <span className="text-[9px] text-[#A8A29E] uppercase tracking-widest font-bold">{c.label}</span>
                <span className="text-xl font-serif text-[#1C1917]">{c.time}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E7E5E4] p-4 flex justify-between items-center bg-[#FAF9F5]/40 hover:bg-[#FAF9F5] transition-colors">
            <span className="text-[10px] text-[#78716C] uppercase tracking-wider hidden md:block">
              Strategic Connectivity
            </span>
            <a
              href={locationData?.mapLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-[10px] text-[#1C1917] hover:text-[#9A7B44] uppercase tracking-widest font-bold transition-colors ${isCompact ? 'w-full justify-center' : ''}`}
            >
              Get Directions <span className="text-[14px] leading-none mb-0.5">↗</span>
            </a>
          </div>
        </div>
      </section>

      <div className="h-20" />
    </main>
  );
}

function Residences({
  products,
  onBack,
  onPick,
  isPreview,
  previewMode,
  onEditSection
}: {
  products: any[];
  onBack: () => void;
  onPick: (id: string) => void;
  isPreview: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  onEditSection?: (sectionId: SectionId) => void;
}) {
  const isMobilePreview = isPreview && previewMode === 'mobile';
  const isCompact = isMobilePreview || false;
  return (
    <main className={`${isMobilePreview ? 'pt-24' : 'pt-14'} min-h-screen`}>
      <div className={`max-w-[1400px] mx-auto px-5 ${isCompact ? '' : 'md:px-10'} py-8 flex items-center justify-between`}>
        <button onClick={onBack} className="text-[11px] tracking-wider uppercase text-[#78716C] hover:text-[#9A7B44] cursor-pointer transition-colors">← Back</button>
        <span className="text-[10px] tracking-wider uppercase text-[#9A7B44] font-medium">{products.length} Residences</span>
      </div>
      <div
        className={`max-w-[1400px] mx-auto px-5 ${isCompact ? '' : 'md:px-10'} pb-32 grid ${isCompact ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'} ${isPreview ? 'cursor-pointer' : ''}`}
        onClick={() => isPreview && onEditSection?.('products')}
      >
        {products.map((r, i) => (
          <ResidenceCard key={r.id} r={r} index={i} onPick={() => onPick(r.id)} />
        ))}
      </div>
    </main>
  );
}

function ResidenceCard({ r, index, onPick }: { r: any; index: number; onPick: () => void }) {
  return (
    <motion.div
      onClick={onPick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group text-left bg-white hover:shadow-lg transition-shadow duration-500 cursor-pointer w-full p-5 sm:p-7"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-serif text-2xl text-[#1C1917]">{r.name}</h3>
          <p className="text-[10px] text-[#A8A29E] uppercase tracking-wider mt-1">{r.dimensions}</p>
        </div>
        <span className="px-2.5 py-1 text-[9px] font-semibold tracking-wider bg-[#9A7B44]/10 text-[#9A7B44] uppercase rounded-sm">
          {r.urgency}
        </span>
      </div>
      <MiniBlueprint 
        plan={r.rooms || []} 
        sunSideProp={r.sunSide}
        compassAngleProp={r.compassAngle}
      />
      <p className="mt-5 text-sm text-[#57534E] leading-relaxed max-w-md">{r.description}</p>
      <div className="mt-6 flex items-end justify-between">
        <span className="font-serif text-3xl text-[#1C1917]">{r.priceLabel}</span>
        <span className="text-[10px] tracking-wider uppercase text-[#9A7B44] font-medium group-hover:translate-x-1 transition-transform duration-400">
          Explore Space →
        </span>
      </div>
    </motion.div>
  );
}

function getMiniRoomType(room: any): string {
  if (room.type) return room.type;
  const id = String(room.id).toLowerCase();
  if (id.includes('living')) return 'living';
  if (id.includes('kitchen')) return 'kitchen';
  if (id.includes('master') || id.includes('bed') || id.includes('guest')) return 'bedroom';
  if (id.includes('bath') || id.includes('toilet') || id.includes('wc')) return 'bathroom';
  if (id.includes('balcony') || id.includes('deck') || id.includes('terrace')) return 'balcony';
  if (id.includes('entrance') || id.includes('foyer') || id.includes('lobby')) return 'entrance';
  if (id.includes('corridor') || id.includes('passage') || id.includes('hall')) return 'corridor';
  if (id.includes('utility') || id.includes('wash')) return 'utility';
  if (id.includes('dining')) return 'dining';
  if (id.includes('pooja') || id.includes('prayer')) return 'pooja';
  if (id.includes('study') || id.includes('office')) return 'study';
  return 'living';
}

const MINI_TYPE_STYLES: Record<string, { border: string; activeBorder: string; bg: string; activeBg: string; text: string; icon: string }> = {
  living:   { border: 'rgba(154,123,68,0.15)', activeBorder: '#9A7B44', bg: 'rgba(255,255,255,0.4)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  bedroom:  { border: 'rgba(139,92,246,0.15)', activeBorder: '#9A7B44', bg: 'rgba(139,92,246,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  kitchen:  { border: 'rgba(245,158,11,0.15)', activeBorder: '#9A7B44', bg: 'rgba(245,158,11,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  bathroom: { border: 'rgba(6,182,212,0.25)', activeBorder: '#06b6d4', bg: 'rgba(6,182,212,0.05)', activeBg: 'rgba(6,182,212,0.12)', text: '#0891b2', icon: '🚿' },
  balcony:  { border: 'rgba(16,185,129,0.25)', activeBorder: '#10b981', bg: 'rgba(16,185,129,0.04)', activeBg: 'rgba(16,185,129,0.10)', text: '#059669', icon: '🌿' },
  entrance: { border: 'rgba(244,63,94,0.25)', activeBorder: '#f43f5e', bg: 'rgba(244,63,94,0.04)', activeBg: 'rgba(244,63,94,0.10)', text: '#e11d48', icon: '🚪' },
  corridor: { border: 'rgba(148,163,184,0.20)', activeBorder: '#94a3b8', bg: 'rgba(148,163,184,0.04)', activeBg: 'rgba(148,163,184,0.10)', text: '#64748b', icon: '' },
  utility:  { border: 'rgba(249,115,22,0.20)', activeBorder: '#f97316', bg: 'rgba(249,115,22,0.04)', activeBg: 'rgba(249,115,22,0.10)', text: '#ea580c', icon: '⚡' },
  dining:   { border: 'rgba(20,184,166,0.15)', activeBorder: '#9A7B44', bg: 'rgba(20,184,166,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  pooja:    { border: 'rgba(234,179,8,0.20)', activeBorder: '#eab308', bg: 'rgba(234,179,8,0.04)', activeBg: 'rgba(234,179,8,0.10)', text: '#ca8a04', icon: '🪔' },
  study:    { border: 'rgba(59,130,246,0.15)', activeBorder: '#9A7B44', bg: 'rgba(59,130,246,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
  store:    { border: 'rgba(168,162,158,0.15)', activeBorder: '#9A7B44', bg: 'rgba(168,162,158,0.04)', activeBg: 'rgba(154,123,68,0.08)', text: '#A8A29E', icon: '' },
};

const DEFAULT_MINI_STYLE = MINI_TYPE_STYLES.living;

function MiniBlueprint({
  plan,
  activeId,
  onSelectRoom,
  sunSideProp,
  compassAngleProp
}: {
  plan: any[];
  activeId?: string;
  onSelectRoom?: (id: string) => void;
  sunSideProp?: 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';
  compassAngleProp?: number;
}) {
  const totalRooms = plan.length;
  const mappedRooms = plan.map((room: any, index: number) => {
    const coords = getRoomBlueprintCoords(room.id, index, totalRooms);
    return {
      id: room.id,
      type: room.type,
      x: room.x !== undefined ? room.x : coords.x,
      y: room.y !== undefined ? room.y : coords.y,
      w: room.w !== undefined ? room.w : coords.w,
      h: room.h !== undefined ? room.h : coords.h,
      label: room.label || room.name || 'Room'
    };
  });

  return (
    <div className="relative aspect-[4/3] w-full bg-[#FAF9F5] border border-[#E7E5E4]/60 overflow-hidden select-none rounded-lg">
      <div className="absolute top-[-5.55%] left-[-5.55%] w-[111.1%] h-[111.1%]">
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" preserveAspectRatio="none">
          <defs>
            <pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" stroke="#9A7B44" strokeWidth="0.3" />
            </pattern>
            {/* Bathroom hatching */}
            <pattern id="mini-bath-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" stroke="#06b6d4" strokeWidth="0.6" opacity="0.25" />
            </pattern>
            {/* Balcony hatching */}
            <pattern id="mini-balcony-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#10b981" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>

      {/* Room cells */}
      {mappedRooms.map((room) => {
        const active = room.id === activeId;
        const Tag = onSelectRoom ? 'button' : 'div';
        const roomType = getMiniRoomType(room);
        const style = MINI_TYPE_STYLES[roomType] || DEFAULT_MINI_STYLE;
        const isEntrance = roomType === 'entrance';
        const isBathroom = roomType === 'bathroom';
        const isBalcony = roomType === 'balcony';

        // Smart rotation & character-fit font size calculation
        const isVertical = room.h > room.w * 1.25;
        const needsRotation = isVertical && room.w < 22;
        const availableSpace = needsRotation ? room.h : room.w;
        const availableHeight = needsRotation ? room.w : room.h;
        const labelLength = room.label.length;
        const charWidthFactor = 0.46; // Sattoshi font letter spacing factor

        // Dynamically scale font size according to the block size
        let fontSize = (availableSpace / (labelLength * charWidthFactor)) * 0.75; // Fill ~75% of width
        fontSize = Math.min(fontSize, availableHeight * 0.45); // Max 45% of height
        
        // Final boundaries (minimum readable, maximum tasteful size)
        fontSize = Math.max(6.5, Math.min(18, fontSize));

        // If bounds are tight, use the minimum readable size
        if (room.w < 5 && !needsRotation) fontSize = 6.5;
        if (room.h < 5 && needsRotation) fontSize = 6.5;

        const rotateStyle = needsRotation ? { writingMode: 'vertical-rl' as const, transform: 'rotate(180deg)' } : {};

        // Dynamically assign base z-index strictly by inverse area. 
        // A smaller room will ALWAYS have a higher z-index than a larger room, even if the larger room is selected.
        const area = (room.w || 10) * (room.h || 10);
        const baseZ = 100000 - Math.floor(area) * 10;
        const dynamicZIndex = baseZ + (active ? 3 : 0);

        return (
          <Tag
            key={room.id}
            {...(onSelectRoom ? { onClick: () => onSelectRoom(room.id) } : {})}
            className={`absolute transition-all duration-400 ease-out overflow-hidden ${
              onSelectRoom ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'
            }`}
            style={{
              zIndex: dynamicZIndex,
              left: `${room.x}%`,
              top: `${room.y}%`,
              width: `${room.w}%`,
              height: `${room.h}%`,
              border: `1px ${isBalcony ? 'dashed' : 'solid'} ${active ? style.activeBorder : style.border}`,
              background: active ? style.activeBg : style.bg,
              boxShadow: active
                ? `0 2px 8px rgba(154,123,68,0.1), inset 0 0 12px rgba(154,123,68,0.03)`
                : "0 1px 2px rgba(0,0,0,0.01)",
            }}
          >
            {/* Bathroom hatching overlay */}
            {isBathroom && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect width="100%" height="100%" fill="url(#mini-bath-hatch)" />
              </svg>
            )}
            {/* Balcony hatching overlay */}
            {isBalcony && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect width="100%" height="100%" fill="url(#mini-balcony-hatch)" />
              </svg>
            )}
            {/* Center-aligned smart auto-scaling & rotating room label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-1 pointer-events-none z-10">
              <span
                className="font-bold uppercase tracking-[0.15em] text-center leading-none block whitespace-nowrap"
                style={{
                  fontSize: `${fontSize}px`,
                  color: active ? '#1C1917' : style.text,
                  ...rotateStyle
                }}
              >
                {room.label}
              </span>
            </div>
          </Tag>
        );
      })}
      </div>
    </div>
  );
}

function Tour({
  residence,
  onBack,
  onWhatsApp,
  storeName,
  isPreview,
  previewMode,
  onEditSection,
  heroData
}: {
  residence: any;
  onBack: () => void;
  onWhatsApp: (intent: string, product?: any, messageOverride?: string) => void;
  storeName: string;
  isPreview: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  onEditSection?: (sectionId: SectionId) => void;
  heroData?: any;
}) {
  const GOLD = '#9A7B44';
  const isMobilePreview = isPreview && previewMode === 'mobile';
  const isTabletPreview = isPreview && previewMode === 'tablet';
  const isCompact = isMobilePreview || isTabletPreview;
  const rooms = residence?.rooms || [];
  const [activeId, setActiveId] = useState<string>(rooms[0]?.id || "");
  const [imgIdx, setImgIdx] = useState(0);
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const mobileTopRef = useRef<HTMLDivElement>(null);

  const room = useMemo(() => {
    return rooms.find((r: any) => r.id === activeId) || rooms[0];
  }, [rooms, activeId]);

  useEffect(() => {
    if (rooms.length > 0 && !rooms.some((r: any) => r.id === activeId)) {
      setActiveId(rooms[0].id);
    }
  }, [rooms, activeId]);

  useEffect(() => { setImgIdx(0); }, [activeId]);

  if (!room) return null;

  const allImages: string[] = room.images?.length ? room.images : (room.img ? [room.img] : []);
  const img = allImages[imgIdx] || allImages[0] || '';
  const hasImage = Boolean(img);

  const roomIndex = rooms.findIndex((r: any) => r.id === activeId);
  const goNext = () => { if (roomIndex < rooms.length - 1) setActiveId(rooms[roomIndex + 1].id); };
  const goPrev = () => { if (roomIndex > 0) setActiveId(rooms[roomIndex - 1].id); };
  const counter = `${String(roomIndex + 1).padStart(2, '0')} / ${String(rooms.length).padStart(2, '0')}`;

  const onInquire = () => onWhatsApp(
    'tour_room_cta',
    residence,
    `Hi ${storeName}, I am exploring the ${room.name} of ${residence.name}. I'd love to discuss this space.`
  );

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      if (allImages.length > 1 && imgIdx < allImages.length - 1) {
        setImgIdx(prev => prev + 1);
      } else {
        goNext();
      }
    } else {
      if (allImages.length > 1 && imgIdx > 0) {
        setImgIdx(prev => prev - 1);
      } else {
        goPrev();
      }
    }
  };

  const onDragEnd = (e: any, { offset }: any) => {
    const swipe = offset.x;
    if (swipe < -50) handleSwipe('left');
    else if (swipe > 50) handleSwipe('right');
  };

  return (
    <main className={`${isCompact ? 'pt-24' : 'pt-14'} min-h-screen bg-[#FAF9F5] text-[#1C1917] overflow-hidden`}>

      {/* ── DESKTOP: Split-panel — Image left + Sidebar right ── */}
      <section className={`relative w-full h-[calc(100vh-3.5rem)] ${isCompact ? 'hidden' : (isPreview ? 'flex' : 'hidden lg:flex')}`}>

          {/* LEFT — Image area */}
          <div className="relative flex-1 h-full overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div 
                key={`${activeId}-${imgIdx}`} 
                initial={{ opacity: 0, scale: 1.08 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.04 }} 
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} 
                className="absolute inset-0 will-change-transform cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
              >
                {hasImage ? (
                  <img src={img} alt={room.name} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <div className="w-full h-full bg-[#EFEFEF] flex flex-col items-center justify-center pointer-events-none border-r border-[#E0DCD0]">
                    <div className="w-16 h-16 border border-dashed border-[#C4C0B6] rounded-xl flex items-center justify-center mb-4 bg-white/50">
                      <span className="text-[#A39F93] text-2xl font-light">+</span>
                    </div>
                    <p className="text-[#878378] font-serif tracking-widest text-xs uppercase">Add image for {room.name}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.7) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 80%, rgba(0,0,0,0.4) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }} />

            {/* Top nav */}
            <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 pt-5">
              <button onClick={onBack} className="group flex items-center gap-3 text-white/80 hover:text-white transition-colors cursor-pointer">
                <span className="w-9 h-9 rounded-full bg-white/8 backdrop-blur-xl border border-white/15 flex items-center justify-center group-hover:bg-white/15 transition-colors text-sm">←</span>
                <span className="text-xs tracking-[0.3em] uppercase font-medium">Back</span>
              </button>
            </div>

            {/* Bottom title overlay */}
            <div className="absolute bottom-0 inset-x-0 z-20 px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <h2 className="font-serif text-[44px] leading-[0.92] text-white tracking-tight mb-2" style={{ textShadow: '0 3px 30px rgba(0,0,0,0.5)' }}>{room.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-white/70 text-sm font-serif">{room.area}</span>
                    {room.atmosphere && (<><span className="text-white/20">·</span><span className="text-white/50 text-sm italic font-serif">{room.atmosphere}</span></>)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Gallery lines */}
            {allImages.length > 1 && (
              <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
                {allImages.map((_: string, i: number) => (
                  <button key={i} onClick={() => setImgIdx(i)} className="group flex items-center gap-3 cursor-pointer">
                    <span className={`block w-px transition-all duration-500 ${i === imgIdx ? 'h-8' : 'h-3 group-hover:bg-white/70'}`} style={{ background: i === imgIdx ? GOLD : 'rgba(255,255,255,0.3)' }} />
                    <span className={`font-mono text-xs tracking-widest transition-opacity ${i === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-60 text-white/60'}`} style={{ color: i === imgIdx ? GOLD : undefined }}>{String(i + 1).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Sidebar panel */}
          <div className="w-[40%] md:w-[35%] shrink-0 h-full bg-[#FAF9F5] border-l border-[#E7E5E4] flex flex-col z-10">

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#E9C89233 transparent' }}>
              {/* Property Overview Header */}
              <div className="px-5 pt-6 pb-5 border-b border-[#E7E5E4] shrink-0 bg-white flex flex-row items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h1 className="font-serif text-[26px] text-[#1C1917] leading-none tracking-tight">
                    {residence.name}
                  </h1>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 pb-0.5">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#9A7B44]/80 font-bold">Total Area</span>
                  <span className="text-xl font-serif text-[#9A7B44] leading-none tracking-wide">
                    {residence.dimensions || '1,850 sqft'}
                  </span>
                </div>
              </div>

              {/* Floor Plan — always visible */}
              <div className="px-5 py-5 border-b border-[#E7E5E4] shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] tracking-[0.15em] uppercase font-bold" style={{ color: GOLD }}>Residence Layout</p>
                  <div className="flex items-center gap-1.5 text-[#A8A29E]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                    <span className="text-[9px] font-sans tracking-[0.15em] uppercase font-bold">
                      {residence.facing || (residence.sunSide ? `${residence.sunSide} Facing` : (residence.name?.includes('2') ? 'West Facing' : residence.name?.includes('4') ? 'North-East Facing' : 'East Facing'))}
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-[#E7E5E4] shadow-sm rounded-xl p-1.5">
                  <MiniBlueprint 
                    plan={rooms} 
                    activeId={activeId} 
                    onSelectRoom={(id) => setActiveId(id)} 
                    sunSideProp={residence?.sunSide}
                    compassAngleProp={residence?.compassAngle}
                  />
                </div>
              </div>


              {/* Features & Note (Animated on Room Change) */}
              <div className="px-5 border-b border-[#E7E5E4]/60 shrink-0 min-h-[200px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="py-6"
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#9A7B44]">Room Features</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#9A7B44]/30 to-transparent" />
                      </div>
                      <h3 className="text-2xl font-serif text-[#1C1917] tracking-tight flex flex-col gap-1">
                        <span>{room.name}</span>
                        {(room.atmosphere || room.area) && (
                          <span className="text-sm font-sans text-[#78716C] tracking-wide">
                            {[room.atmosphere, room.area].filter(Boolean).join(' · ')}
                          </span>
                        )}
                      </h3>
                    </div>
                    
                    {(room.details || []).length > 0 ? (
                      <div className="flex flex-col gap-2.5 mb-8">
                        {(room.details || []).map((f: string, i: number) => (
                          <div key={f} className="group relative bg-white border border-[#E7E5E4]/80 rounded-2xl p-4 flex items-center gap-4 overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#9A7B44]/30 cursor-default">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9A7B44] scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                            <div className="w-8 h-8 rounded-full bg-[#FAF9F5] flex items-center justify-center shrink-0 border border-[#E7E5E4]/50 group-hover:rotate-90 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                              <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-60"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill={GOLD}/></svg>
                            </div>
                            <span className="text-[13px] text-[#1C1917] font-medium tracking-wide leading-relaxed group-hover:translate-x-1 transition-transform duration-500">{f}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#A8A29E] italic font-serif mb-6">No specific details available for this space.</p>
                    )}

                    {room.note && (
                      <div className="pt-2 pb-4">
                        <p className="text-base text-[#1C1917] font-serif leading-relaxed pl-4 border-l-2 border-[#9A7B44]/30 italic">
                          {room.note}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Ownership (High-end Spec Sheet style) */}
              <div className="px-5 py-6 shrink-0">
                <div className="relative overflow-hidden bg-[#1C1917] rounded-2xl p-6 text-white shadow-md">
                  
                  <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-6 text-white/60 relative z-10">{residence.propertyDetailsTitle || 'Property Details'}</p>
                  
                  <div className="flex flex-col gap-5 relative z-10">
                    {(residence.specifications || [
                      { label: residence.ownershipLabel || 'Tenure', value: residence.ownership || heroData?.ownership || 'Freehold Estate' }, 
                      { label: residence.deliveryLabel || 'Possession', value: residence.delivery || heroData?.possession || 'Ready to Move' }, 
                      { label: residence.automotiveLabel || 'Parking', value: residence.automotive || heroData?.automotive || '3 Dedicated Spaces' }
                    ]).map((s: any) => (
                      <div key={s.label} className="flex items-end justify-between border-b border-white/10 pb-3">
                        <span className="text-[11px] tracking-wider uppercase text-white/50 font-medium">{s.label}</span>
                        <span className="text-sm font-serif tracking-wide text-white/90">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="px-5 py-6 bg-[#FAF9F5] shrink-0 border-t border-[#E7E5E4]">
              <button onClick={onInquire} className="relative w-full overflow-hidden group py-5 text-xs tracking-[0.2em] uppercase font-bold rounded-xl cursor-pointer text-white bg-[#1C1917] hover:bg-black transition-colors duration-400">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {residence.spaceCtaText || heroData?.spaceCtaText || 'Discuss This Space'} <span className="text-[#9A7B44] group-hover:translate-x-1 transition-transform duration-400">→</span>
                </span>
              </button>
            </div>
          </div>
        </section>

      {/* ── MOBILE/TABLET: Image hero + scrollable content ── */}
      <div ref={mobileTopRef} className={`flex-col ${isCompact ? 'flex' : (isPreview ? 'hidden' : 'flex lg:hidden')}`}>

          {/* IMAGE HERO — 55vh with title overlay */}
          <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden shrink-0">
            <AnimatePresence mode="sync">
              <motion.div 
                key={`${activeId}-${imgIdx}`} 
                initial={{ opacity: 0, scale: 1.08 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.03 }} 
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} 
                className="absolute inset-0 will-change-transform cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
              >
                {hasImage ? (
                  <img src={img} alt={room.name} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <div className="w-full h-full bg-[#EFEFEF] flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 border border-dashed border-[#C4C0B6] rounded-xl flex items-center justify-center mb-4 bg-white/50">
                      <span className="text-[#A39F93] text-2xl font-light">+</span>
                    </div>
                    <p className="text-[#878378] font-serif tracking-widest text-xs uppercase">Add image for {room.name}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.8) 100%)' }} />

            {/* Top bar */}
            <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 pt-4">
              <button onClick={onBack} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-sm cursor-pointer shadow-md shrink-0">←</button>
            </div>

            {/* Room title + dots on image */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <AnimatePresence mode="wait">
                <motion.h2 key={activeId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="font-serif text-[28px] leading-none text-white mb-2" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
                  {room.name}
                </motion.h2>
              </AnimatePresence>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80 font-serif">{room.area}</span>
                <div className="flex-1" />
                <div className="flex gap-1.5">
                  {rooms.map((r: any) => (
                    <button key={r.id} onClick={() => setActiveId(r.id)} className={`transition-all duration-400 cursor-pointer rounded-full ${r.id === activeId ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SCROLLABLE CONTENT PANEL */}
          <div className="bg-[#FAF9F5] relative z-10 px-5 pt-7 pb-28">

            {/* Property Overview Header */}
            <div className="mb-6 pb-6 border-b border-[#E7E5E4] flex flex-row items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="font-serif text-2xl text-[#1C1917] leading-none tracking-tight">
                  {residence.name}
                </h1>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#9A7B44]/80 font-bold">Total Area</span>
                <span className="text-lg font-serif text-[#9A7B44] leading-none tracking-wide">
                  {residence.dimensions || '1,850 sqft'}
                </span>
              </div>
            </div>

            {/* Floor Plan */}
            <div className="mb-6 md:max-w-[440px] md:mx-auto">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] tracking-[0.15em] uppercase font-bold" style={{ color: GOLD }}>Residence Layout</p>
                <div className="flex items-center gap-1.5 text-[#A8A29E]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                  <span className="text-[9px] font-sans tracking-[0.15em] uppercase font-bold">
                    {residence.facing || (residence.sunSide ? `${residence.sunSide} Facing` : (residence.name?.includes('2') ? 'West Facing' : residence.name?.includes('4') ? 'North-East Facing' : 'East Facing'))}
                  </span>
                </div>
              </div>
              <div className="bg-white border border-[#E7E5E4] shadow-sm rounded-xl p-1.5">
                <MiniBlueprint 
                  plan={rooms} 
                  activeId={activeId} 
                  onSelectRoom={(id) => {
                    setActiveId(id);
                    if (mobileTopRef.current) {
                      mobileTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }} 
                  sunSideProp={residence?.sunSide}
                  compassAngleProp={residence?.compassAngle}
                />
              </div>
            </div>


            {/* Features & Note (Animated on Room Change) */}
            <div className="mb-8 mt-2 min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#9A7B44]">Room Features</span>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-[#9A7B44]/30 to-transparent" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#1C1917] tracking-tight flex flex-col gap-1">
                      <span>{room.name}</span>
                      {(room.atmosphere || room.area) && (
                        <span className="text-sm font-sans text-[#78716C] tracking-wide">
                          {[room.atmosphere, room.area].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  {(room.details || []).length > 0 ? (
                    <div className="flex flex-col gap-2.5 mb-8">
                      {(room.details || []).map((f: string, i: number) => (
                        <div key={f} className="group relative bg-white border border-[#E7E5E4]/80 rounded-2xl p-4 flex items-center gap-4 overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#9A7B44]/30 cursor-default">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9A7B44] scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                          <div className="w-8 h-8 rounded-full bg-[#FAF9F5] flex items-center justify-center shrink-0 border border-[#E7E5E4]/50 group-hover:rotate-90 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                            <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-60"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill={GOLD}/></svg>
                          </div>
                          <span className="text-[13px] text-[#1C1917] font-medium tracking-wide leading-relaxed group-hover:translate-x-1 transition-transform duration-500">{f}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#A8A29E] italic font-serif mb-6">No specific details available for this space.</p>
                  )}

                  {room.note && (
                    <div className="pt-2 pb-4">
                      <p className="text-base text-[#1C1917] font-serif leading-relaxed pl-4 border-l-2 border-[#9A7B44]/30 italic">
                        {room.note}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Ownership (High-end Spec Sheet style) */}
            <div className="mb-8 relative overflow-hidden bg-[#1C1917] rounded-2xl p-6 text-white shadow-xl">
              
              <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-6 text-white/60 relative z-10">{residence.propertyDetailsTitle || 'Property Details'}</p>
              
              <div className="flex flex-col gap-5 relative z-10">
                {(residence.specifications || [
                  { label: residence.ownershipLabel || 'Tenure', value: residence.ownership || heroData?.ownership || 'Freehold Estate' }, 
                  { label: residence.deliveryLabel || 'Possession', value: residence.delivery || heroData?.possession || 'Ready to Move' }, 
                  { label: residence.automotiveLabel || 'Parking', value: residence.automotive || heroData?.automotive || '3 Dedicated Spaces' }
                ]).map((s: any) => (
                  <div key={s.label} className="flex items-end justify-between border-b border-white/10 pb-3">
                    <span className="text-[11px] tracking-wider uppercase text-white/50 font-medium">{s.label}</span>
                    <span className="text-sm font-serif tracking-wide text-white/90">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button onClick={onInquire} className="relative w-full overflow-hidden group py-5 text-xs tracking-[0.2em] uppercase font-bold rounded-xl cursor-pointer text-white bg-[#1C1917] hover:bg-black transition-colors duration-400 mt-2">
              <span className="relative z-10 flex items-center justify-center gap-3">
                {residence.spaceCtaText || heroData?.spaceCtaText || 'Inquire About This Space'} <span className="text-[#9A7B44] group-hover:translate-x-1 transition-transform duration-400">→</span>
              </span>
            </button>
          </div>
        </div>
    </main>
  );
}


function ActionBar({
  onExplore,
  onWhatsApp,
  onVisit,
  products,
  isPreview,
  previewMode,
  storeName,
  activeResidence,
  whatsappNumber,
}: {
  onExplore: (residenceId?: string) => void;
  onWhatsApp: (msg?: string) => void;
  onVisit: (msg?: string) => void;
  products?: any[];
  isPreview?: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  storeName: string;
  activeResidence?: any;
  whatsappNumber: string;
}) {
  const isMobilePreview = isPreview && previewMode === 'mobile';
  const [activeMenu, setActiveMenu] = useState<'explore' | 'concierge' | 'viewing' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(activeResidence || products?.[0]);
  const [chatStep, setChatStep] = useState<'intent' | 'config' | 'preview'>('intent');
  const [viewStep, setViewStep] = useState<'config' | 'preference'>('config');
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    if (activeResidence) setSelectedProduct(activeResidence);
  }, [activeResidence]);

  useEffect(() => {
    if (activeMenu !== 'concierge') {
      setChatStep('intent');
      setSelectedIntent(null);
    }
    if (activeMenu !== 'viewing') {
      setViewStep('config');
    }
  }, [activeMenu]);

  return (
    <>
      <div
        className={`${
          isPreview ? `absolute ${isMobilePreview ? 'bottom-6' : 'bottom-8'}` : 'fixed bottom-8'
        } left-1/2 -translate-x-1/2 z-40`}
      >
        <div className="bg-[#1C1917]/85 backdrop-blur-xl border border-white/10 p-1.5 rounded-[2rem] flex items-center shadow-2xl">
          
          {/* 1. EXPLORE */}
          <button
            onClick={() => { setActiveMenu(null); onExplore(selectedProduct?.id); }}
            className="px-4 md:px-5 py-3 text-[9px] md:text-[10px] tracking-[0.2em] font-bold uppercase text-white/70 hover:text-[#9A7B44] transition-all cursor-pointer rounded-full hover:bg-white/5"
          >
            Explore
          </button>
          

          {/* 3. CONCIERGE */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'concierge' ? null : 'concierge')}
              className="px-4 md:px-5 py-3 bg-[#FAF9F5] text-[#1C1917] text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(154,123,68,0.1)] cursor-pointer rounded-full flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#1C1917]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.062-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Chat
            </button>
            
            <AnimatePresence>
              {activeMenu === 'concierge' && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 w-[260px] mb-4 bg-[#1C1917]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden z-50 flex flex-col p-2"
                >
                  <div className="px-3 pt-3 pb-3 text-center border-b border-white/10 mb-1 relative flex items-center justify-center">
                    {chatStep !== 'intent' && (
                      <button onClick={() => setChatStep(chatStep === 'preview' ? 'config' : 'intent')} className="absolute left-3 text-white/50 hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                    )}
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#9A7B44]">
                      {chatStep === 'intent' ? 'How may we assist you?' : chatStep === 'config' ? 'Select Configuration' : 'Message Preview'}
                    </span>
                  </div>

                  {chatStep === 'intent' ? (
                    <div className="flex flex-col gap-1 mt-1">
                      {[
                        { label: 'Explore Availability', action: 'explore current availability' },
                        { label: 'Request Floorplans', action: 'request detailed floorplans' },
                        { label: 'Arrange Viewing', action: 'arrange a private viewing' },
                        { label: 'Investment Details', action: 'discuss investment details' },
                      ].map((intent, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedIntent(intent.action);
                            setChatStep('config');
                          }}
                          className="text-center px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold tracking-wide text-white/90 hover:text-[#9A7B44] transition-colors">{intent.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : chatStep === 'config' ? (
                    <div className="flex flex-col gap-1 mt-1">
                      {products?.map((p: any) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedProduct(p);
                            setCustomMessage(`Hello ${storeName},\n\nI would like to ${selectedIntent} for the ${p.name}.\n\nPlease share the next steps.`);
                            setChatStep('preview');
                          }}
                          className="flex flex-col items-center text-center px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                          <span className="text-[11px] font-bold text-white group-hover:text-[#9A7B44] transition-colors">{p.name}</span>
                          <span className="text-[9px] uppercase tracking-wider text-white/50 mt-1">{p.atmosphere || 'Skyline Living'}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 mt-1 p-2">
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-2 text-[10px] text-white/90 leading-relaxed font-sans text-left outline-none focus:border-[#9A7B44]/50 transition-colors resize-none h-[110px]"
                      />
                      <button
                        onClick={() => {
                          setActiveMenu(null);
                          onWhatsApp(customMessage);
                        }}
                        className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#25D366]">Continue to WhatsApp →</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. VIEWING */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'viewing' ? null : 'viewing')}
              className="px-4 md:px-5 py-3 text-[9px] md:text-[10px] tracking-[0.2em] font-bold uppercase text-white/70 hover:text-[#9A7B44] transition-all cursor-pointer rounded-full hover:bg-white/5"
            >
              Visit
            </button>
            
            <AnimatePresence>
              {activeMenu === 'viewing' && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-full right-0 w-[240px] mb-4 bg-[#1C1917]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden z-50 flex flex-col p-2"
                >
                  <div className="px-3 pt-3 pb-3 text-center border-b border-white/10 mb-1 relative flex items-center justify-center">
                    {viewStep === 'preference' && (
                      <button onClick={() => setViewStep('config')} className="absolute left-3 text-white/50 hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                    )}
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#9A7B44]">
                      {viewStep === 'config' ? 'Arrange a Private Viewing' : 'Preferred Experience'}
                    </span>
                  </div>
                  
                  {viewStep === 'config' ? (
                    <div className="flex flex-col gap-1 mt-1">
                      {products?.map((p: any) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedProduct(p);
                            setViewStep('preference');
                          }}
                          className="flex flex-col items-center text-center px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                          <span className="text-[11px] font-bold text-white group-hover:text-[#9A7B44] transition-colors">{p.name}</span>
                          <span className="text-[9px] uppercase tracking-wider text-white/50 mt-1">{p.atmosphere || 'Skyline Living'}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 mt-1">
                      {['Morning Tour', 'Sunset Viewing', 'Weekend Visit'].map((tour, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveMenu(null);
                            onVisit(`Hello ${storeName},\n\nI would like to arrange a ${tour} for the ${selectedProduct?.name || 'residence'}.\n\nPlease let me know your availability.`);
                          }}
                          className="flex flex-col items-center text-center px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                          <span className="text-[11px] font-bold text-white group-hover:text-[#9A7B44] transition-colors">{tour}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Click outside overlay */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-[#1C1917]/10 backdrop-blur-[2px]" 
            onClick={() => setActiveMenu(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
