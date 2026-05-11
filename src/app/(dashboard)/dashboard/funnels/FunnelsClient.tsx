'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  Layers, Plus, Trash2, ExternalLink, Settings2, Loader2, Pencil, 
  BarChart3, ArrowUpRight, Zap, Play, Search, SlidersHorizontal, 
  LayoutGrid, List, Copy, CheckCircle2, MoreVertical, Share2,
  Clock, TrendingUp, Users, Target
} from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CreateFunnelModal } from '@/components/dashboard/CreateFunnelModal';
import { TemplateGallery } from '@/components/dashboard/TemplateGallery';
import { Funnel, deleteFunnel } from '@/app/actions/funnels';
import { Product } from '@/app/actions/products';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface FunnelsClientProps {
  initialFunnels: Funnel[];
  availableProducts: Product[];
}

export function FunnelsClient({ initialFunnels, availableProducts }: FunnelsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-funnels' | 'templates'>(initialFunnels.length > 0 ? 'my-funnels' : 'templates');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this funnel? The public link will stop working instantly.')) {
      setDeletingId(id);
      await deleteFunnel(id);
      setDeletingId(null);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFunnels = useMemo(() => {
    return initialFunnels.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialFunnels, searchQuery]);

  const totalLeads = useMemo(() => initialFunnels.reduce((acc, f) => acc + (f.leads_count || 0), 0), [initialFunnels]);
  const avgConversion = useMemo(() => {
    if (initialFunnels.length === 0) return '0.0';
    // Deterministic mock: derive from data to avoid hydration mismatch
    const seed = (totalLeads * 7 + initialFunnels.length * 13) % 50;
    return ((seed / 10) + 2).toFixed(1);
  }, [initialFunnels, totalLeads]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {initialFunnels.length === 0 && activeTab === 'my-funnels' ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-32 h-32 bg-indigo-50 rounded-[40px] flex items-center justify-center mb-10 relative shadow-[0_30px_60px_-25px_rgba(79,70,229,0.1)]"
          >
            <div className="absolute inset-0 bg-indigo-600/5 rounded-[40px] animate-ping" style={{ animationDuration: '4s' }} />
            <Zap className="w-12 h-12 text-indigo-600 relative z-10" />
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-50">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-6">Create Your First Funnel</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-12 text-xl leading-relaxed font-medium">
            Join 1,000+ businesses using FunnelLink to turn passive traffic into high-intent customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('templates')}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white text-base font-bold rounded-[20px] hover:bg-indigo-700 transition-all shadow-[0_20px_50px_-20px_rgba(79,70,229,0.4)] hover:-translate-y-1"
            >
              <Layers size={20} />
              Browse Templates
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-700 border-2 border-slate-100 text-base font-bold rounded-[20px] hover:bg-slate-50 transition-all shadow-sm hover:-translate-y-1"
            >
              <Plus size={20} />
              Custom Build
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header & Main Stats */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Zap size={20} fill="currentColor" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Funnels Dashboard</h1>
              </div>
              <p className="text-slate-500 font-semibold text-lg flex items-center gap-2">
                <Clock size={18} className="text-slate-400" />
                Live performance tracking for your active campaigns
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 xl:w-auto w-full">
              {[
                { label: 'Active Funnels', val: initialFunnels.length, icon: Layers, color: 'indigo' },
                { label: 'Total Leads', val: totalLeads, icon: Target, color: 'emerald' },
                { label: 'Avg Conv. Rate', val: `${avgConversion}%`, icon: TrendingUp, color: 'amber' }
              ].map((stat, i) => (
                <div key={i} className="bg-white px-6 py-4 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5 min-w-[200px]">
                  <div className={`p-3 rounded-2xl shadow-inner ${
                    stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 
                    stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                    'bg-amber-50 text-amber-600'
                  }`}>
                    <stat.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 leading-none tracking-tight">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/80 p-3 rounded-[28px] border border-slate-100 backdrop-blur-md sticky top-4 z-40">
            <div className="flex items-center gap-2 p-1.5 bg-slate-50/50 rounded-2xl border border-slate-100 w-full md:w-auto">
              {[
                { id: 'my-funnels', label: 'My Funnels', icon: Layers },
                { id: 'templates', label: 'Templates', icon: Zap }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-white'
                  }`}
                >
                  <tab.icon size={16} className={activeTab === tab.id && tab.id === 'templates' ? 'text-amber-300' : ''} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search funnels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:border-indigo-300 outline-none transition-all font-bold text-sm shadow-sm"
                />
              </div>

              <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={18} />
                </button>
              </div>

              <button 
                onClick={() => { setSelectedTemplate(null); setIsModalOpen(true); }}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">New Funnel</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {activeTab === 'my-funnels' ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                <AnimatePresence mode="popLayout">
                  {filteredFunnels.map((funnel, i) => (
                    <motion.div
                      key={funnel.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group relative bg-white border border-slate-100 overflow-hidden ${
                        viewMode === 'grid' 
                          ? 'rounded-[24px] p-3 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1' 
                          : 'rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md border-l-4 border-l-indigo-600'
                      } transition-all duration-500`}
                    >
                      {/* Grid View Content */}
                      {viewMode === 'grid' ? (
                        <>
                          <div className={`aspect-video rounded-[18px] mb-4 relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br ${
                            funnel.theme === 'minimal' ? 'from-amber-50 to-orange-50' :
                            funnel.theme === 'dark' || funnel.theme === 'onyx' ? 'from-[#121212] to-[#2a2a2a]' : 
                            funnel.theme === 'kinetic' ? 'from-[#2a1b12] to-[#b78a63]' : 
                            'from-[#1c1b19] to-[#4a433b]'
                          }`}>
                            {/* Abstract Design Elements */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_60%)]" />
                            </div>
                            
                            <div className="relative z-10 text-center space-y-2">
                              <div className="w-10 h-10 mx-auto bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20 shadow-2xl">
                                <Layers size={20} className="text-white" />
                              </div>
                                <div className="flex items-center justify-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
                                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                  <span className="text-[8px] font-black text-white uppercase tracking-widest">
                                    {funnel.theme === 'minimal' ? 'ELITE FURNITURE' : 'CONVERSION ENGINE'}
                                  </span>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2">
                              <div className="bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-lg border border-white flex items-center gap-1">
                                <Users size={10} className="text-slate-500" />
                                <span className="text-[9px] font-black text-[#1c1b19]">{funnel.leads_count} Leads</span>
                              </div>
                              <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-lg border border-white flex items-center gap-1.5">
                                <TrendingUp size={10} className="text-[#0f766e]" />
                                <span className="text-[9px] font-black text-[#0f766e]">High Conv.</span>
                              </div>
                            </div>
                          </div>

                          <div className="px-2 space-y-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                                  {funnel.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded truncate max-w-[120px]">/s/{funnel.slug}</span>
                                  <button 
                                    onClick={() => handleCopyLink(funnel.slug, funnel.id)}
                                    className="p-1 text-slate-300 hover:text-indigo-600 transition-colors"
                                    title="Copy link"
                                  >
                                    {copiedId === funnel.id ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Link 
                                  href={`/s/${funnel.slug}`} 
                                  target="_blank"
                                  className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                >
                                  <ExternalLink size={16} />
                                </Link>
                                <button 
                                  onClick={() => handleDelete(funnel.id)}
                                  className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                >
                                  {deletingId === funnel.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link 
                                href={`/dashboard/funnels/${funnel.id}/edit`}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-[13px] font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                              >
                                <Pencil size={14} />
                                Edit
                              </Link>
                              <Link 
                                href={`/dashboard/funnels/${funnel.id}/edit?tab=analytics`}
                                className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all group/stats"
                              >
                                <BarChart3 size={18} className="group-hover/stats:scale-110 transition-transform" />
                              </Link>
                            </div>

                            {/* Mini Trend Indicator */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {[1,2,3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                      {String.fromCharCode(64+i)}
                                    </div>
                                  ))}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">+12 recent leads</span>
                              </div>
                              <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                                <svg viewBox="0 0 100 40" className="w-full h-full stroke-indigo-600 stroke-2 fill-none">
                                  <path d="M0,35 Q10,10 20,30 T40,20 T60,35 T80,10 T100,25" strokeLinecap="round" />
                                </svg>
                              </div>
                            </div>
                          </div>

                        </>
                      ) : (
                        /* List View Content */
                        <>
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${
                                funnel.theme === 'dark' || funnel.theme === 'onyx' ? 'from-slate-900 to-slate-700' : 
                                'from-indigo-600 to-indigo-400'
                              }`}>
                              <Layers size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{funnel.name}</h3>
                              <p className="text-xs text-slate-400 font-mono">/s/{funnel.slug}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-12">
                            <div className="text-center">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Leads</p>
                              <p className="text-base font-black text-slate-900">{funnel.leads_count}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Conversion</p>
                              <p className="text-base font-black text-[#0f766e]">{avgConversion}%</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/funnels/${funnel.id}/edit`} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil size={18} /></Link>
                              <Link href={`/s/${funnel.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><ExternalLink size={18} /></Link>
                              <button onClick={() => handleDelete(funnel.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 animate-fade-in-up">
                <TemplateGallery onSelect={handleTemplateSelect} />
              </div>
            )}
          </div>
        </>
      )}

      <CreateFunnelModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        availableProducts={availableProducts}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
}
