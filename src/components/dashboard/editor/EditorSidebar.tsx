import React from 'react';
import { Building2, LayoutGrid, MapPin, MessageCircle, Package, Settings, Type, ChevronRight, Zap } from 'lucide-react';
import type { Section, SectionId, TabId } from './types';

const defaultSectionMeta: Record<SectionId, { label: string; icon: React.ElementType }> = {
  content: { label: 'Hero Landing', icon: Type },
  categories: { label: 'Collections', icon: LayoutGrid },
  products: { label: 'Product Showcase', icon: Package },
  testimonials: { label: 'Customer Reviews', icon: MessageCircle },
  location: { label: 'Studio Location', icon: MapPin },
  whatsapp: { label: 'WhatsApp Support', icon: MessageCircle },
};

export default React.memo(function EditorSidebar({
  activeTab,
  sections,
  onChangeTab,
  onStoreClick,
  sectionLabels,
  storeLabel,
}: {
  activeTab: TabId;
  sections: Section[];
  onChangeTab: (tab: TabId) => void;
  onReorderSections: (sections: Section[]) => void;
  onStoreClick: () => void;
  sectionLabels?: Partial<Record<SectionId, { label: string; icon?: React.ElementType }>>;
  storeLabel?: string;
}) {
  // Merge custom labels with defaults
  const sectionMeta = { ...defaultSectionMeta };
  if (sectionLabels) {
    for (const [key, val] of Object.entries(sectionLabels)) {
      if (sectionMeta[key as SectionId]) {
        sectionMeta[key as SectionId] = {
          ...sectionMeta[key as SectionId],
          ...val,
        };
      }
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 flex md:block flex-row md:flex-col gap-4 md:gap-0 md:space-y-8 overflow-x-auto md:overflow-y-auto p-4 scrollbar-none snap-x">
        {/* Core Settings Section */}
        <div className="shrink-0 md:shrink">
          <p className="hidden md:block mb-4 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Core Configuration</p>
          <button
            onClick={onStoreClick}
            className={`group shrink-0 flex md:w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all snap-start ${
              activeTab === 'store'
                ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                activeTab === 'store' ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-slate-200'
              }`}>
                <Settings size={16} />
              </div>
              <span className="text-sm font-bold whitespace-nowrap">{storeLabel || 'Store Identity'}</span>
            </div>
            <ChevronRight size={14} className={`ml-2 ${activeTab === 'store' ? 'text-white/40' : 'text-slate-300'}`} />
          </button>
        </div>

        {/* Sales Automation - NEW Dedicated Section */}
        <div className="shrink-0 md:shrink">
          <p className="hidden md:block mb-4 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sales Automation</p>
          <button
            onClick={() => onChangeTab('whatsapp')}
            className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all ${
              activeTab === 'whatsapp'
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-100 hover:bg-emerald-50/30 hover:text-emerald-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                activeTab === 'whatsapp' ? 'bg-white/10' : 'bg-emerald-50 group-hover:bg-emerald-100/50'
              }`}>
                <Zap size={16} className={activeTab === 'whatsapp' ? 'text-white' : 'text-emerald-600'} />
              </div>
              <span className="text-sm font-bold whitespace-nowrap">{sectionMeta.whatsapp.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border ${
                activeTab === 'whatsapp' ? 'border-white/20 bg-white/10' : 'border-emerald-100 bg-emerald-50 text-emerald-600'
              }`}>
                Hot
              </span>
              <ChevronRight size={14} className={`ml-2 ${activeTab === 'whatsapp' ? 'text-white/40' : 'text-slate-300'}`} />
            </div>
          </button>
        </div>

        {/* Page Structure Section */}
        <div className="shrink-0 md:shrink flex md:block gap-4 md:gap-0">
          <p className="hidden md:block mb-4 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Page Structure</p>
          <div className="flex md:block gap-4 md:gap-0 md:space-y-3 shrink-0 md:shrink">
            {sections
              .filter(s => s.id !== 'whatsapp') // Show others here
              .map((section) => {
                const meta = sectionMeta[section.id as SectionId];
                if (!meta) return null;
                const Icon = meta.icon;
                const isActive = activeTab === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => onChangeTab(section.id)}
                    className={`group shrink-0 flex md:w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all snap-start ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isActive ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-slate-200'
                      }`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-bold whitespace-nowrap">{meta.label}</span>
                    </div>
                    <ChevronRight size={14} className={`ml-2 ${isActive ? 'text-white/40' : 'text-slate-300'}`} />
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Simplified Status Footer */}
      <div className="hidden md:block border-t border-slate-50 bg-slate-50/30 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <LayoutGrid size={18} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-900">Conversion OS</p>
            <p className="text-[10px] font-bold text-slate-400">Section Editor Mode</p>
          </div>
        </div>
      </div>
    </div>
  );
});
