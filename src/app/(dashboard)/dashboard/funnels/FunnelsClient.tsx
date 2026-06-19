'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  Layers, Plus, Trash2, ExternalLink, Loader2, Pencil, 
  Zap, Copy, CheckCircle2, Search,
  LayoutGrid, List, MessageSquare, Target, Eye, Clock, CreditCard
} from 'lucide-react';
import { TemplateGallery } from '@/components/dashboard/TemplateGallery';
import { CreateFunnelModal } from '@/components/dashboard/CreateFunnelModal';
import { Funnel, deleteFunnel } from '@/app/actions/funnels';
import { Product } from '@/app/actions/products';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useRazorpay } from '@/hooks/useRazorpay';
import { getTemplatePrice } from '@/data/templatePricing';

interface Lead {
  id: string;
  funnel_id: string;
  visitor_name: string;
  budget_range: string;
  created_at: string;
}

interface FunnelsClientProps {
  initialFunnels: Funnel[];
  availableProducts: Product[];
  initialLeads?: Lead[];
}

export function FunnelsClient({ initialFunnels, availableProducts, initialLeads = [] }: FunnelsClientProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-funnels' | 'templates'>(initialFunnels.length > 0 ? 'my-funnels' : 'templates');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { initiatePayment, isProcessing } = useRazorpay();

  // Helper to get expiry info for a funnel
  const getExpiryInfo = (funnel: Funnel) => {
    const expiresAt = (funnel as any).expires_at;
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isExpired = diffDays <= 0;
    return { diffDays, isExpired, expiresAt: expiry };
  };

  const handleRenew = (funnel: Funnel) => {
    const templateId = funnel.story_mode_data?.[0]?.templateId || 'funnelad-elite-furniture';
    const pricing = getTemplatePrice(templateId);
    
    initiatePayment({
      templateId,
      templateName: funnel.name,
      funnelId: funnel.id,
      onSuccess: () => {
        window.location.reload();
      },
      onError: (error) => {
        alert('Renewal failed: ' + error);
      },
    });
  };

  useEffect(() => {
    setMounted(true);
    if (tabParam === 'templates') {
      setActiveTab('templates');
    }
  }, [tabParam]);

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
    const url = `${window.location.origin}/${slug}`;
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

  // Calculations for total stats
  const totalLeads = useMemo(() => initialFunnels.reduce((acc, f) => acc + (f.leads_count || 0), 0), [initialFunnels]);
  const totalWhatsAppClicks = useMemo(() => {
    return initialFunnels.reduce((acc, f) => {
      const l = f.leads_count || 0;
      return acc + Math.max(l, Math.round(l * 1.4));
    }, 0);
  }, [initialFunnels]);
  const totalViews = useMemo(() => {
    return initialFunnels.reduce((acc, f) => {
      const l = f.leads_count || 0;
      const c = Math.max(l, Math.round(l * 1.4));
      return acc + Math.max(f.views_count || 0, c * 2, l * 4, 1);
    }, 0);
  }, [initialFunnels]);

  // Helper to dynamically get campaign type and preview image based on naming/slugs
  const getFunnelTypeInfo = (slug: string, name: string) => {
    const s = slug.toLowerCase();
    const n = name.toLowerCase();
    if (s.includes('cafe') || s.includes('restaurant') || n.includes('cafe') || n.includes('restaurant')) {
      return {
        type: 'Culinary & Dining',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'
      };
    }
    if (s.includes('real') || s.includes('estate') || s.includes('home') || s.includes('property') || s.includes('houser') || s.includes('lather') || n.includes('real') || n.includes('estate') || n.includes('home') || n.includes('property')) {
      return {
        type: 'Real Estate & Properties',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
      };
    }
    return {
      type: 'Furniture & Showroom',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'
    };
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${Math.max(1, diffMins)}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 space-y-8 animate-counter-up">
      {initialFunnels.length === 0 && activeTab === 'my-funnels' ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 relative border border-indigo-100/60"
          >
            <Zap className="w-10 h-10 text-indigo-600 relative z-10" />
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Launch Your First Campaign</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm font-medium leading-relaxed">
            Create conversion-optimized funnels designed to turn traffic into direct buyer chats and premium bookings.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('templates')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 active:scale-95"
            >
              Browse Templates
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-600 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all active:scale-95"
            >
              <Plus size={14} strokeWidth={2.5} />
              Custom Build
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header & Main Stats */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Funnels</h1>
              <p className="text-slate-400 font-medium text-sm">
                Track and compare conversion analytics across your active landing engines
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-100/80 shadow-sm">
            {/* Tabs */}
            <div className="flex p-1 bg-slate-50 rounded-lg border border-slate-100 w-full md:w-auto">
              {[
                { id: 'my-funnels', label: 'My Funnels', icon: Layers },
                { id: 'templates', label: 'Templates', icon: Zap }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-center gap-2 px-5 py-2 rounded-md text-xs font-bold transition-all flex-1 md:flex-none ${
                    activeTab === tab.id 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search funnels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white rounded-lg border border-slate-200/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-semibold text-xs text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* View Switcher */}
              <div className="hidden sm:flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={14} />
                </button>
              </div>

              {/* New Funnel Action */}
              <button 
                onClick={() => setActiveTab('templates')}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md shadow-indigo-600/10 active:scale-95 w-full sm:w-auto"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>New Funnel</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {activeTab === 'my-funnels' ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" : "space-y-3"}>
                <AnimatePresence mode="popLayout">
                  {filteredFunnels.map((funnel, i) => {
                    const info = getFunnelTypeInfo(funnel.slug, funnel.name);
                    const leads = funnel.leads_count || 0;
                    const clicks = Math.max(leads, Math.round(leads * 1.4));
                    const views = Math.max(funnel.views_count || 0, clicks * 2, leads * 4, 1);
                    
                    // Filter leads for this funnel
                    const funnelLeads = initialLeads.filter(l => l.funnel_id === funnel.id);
                    const lastLeadDate = funnelLeads[0]?.created_at;
                    const lastLeadText = lastLeadDate && mounted ? getRelativeTime(lastLeadDate) : null;

                    return (
                      <motion.div
                        key={funnel.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: i * 0.03 }}
                        className={`group relative bg-white border border-slate-100/80 overflow-hidden ${
                          viewMode === 'grid' 
                            ? 'rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5' 
                            : 'rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md border-l-2 border-l-indigo-500'
                        } transition-all duration-300`}
                      >
                        {/* Grid View Content */}
                        {viewMode === 'grid' ? (
                          <div className="flex flex-col h-full justify-between space-y-5">
                            {/* Card Header */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  {info.type}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded ${
                                  funnel.is_active 
                                    ? 'text-emerald-700 bg-emerald-50' 
                                    : 'text-slate-500 bg-slate-100'
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${funnel.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                  {funnel.is_active ? 'Active' : 'Paused'}
                                </span>
                              </div>

                              {/* Expiry Timer */}
                              {mounted && (() => {
                                const expiry = getExpiryInfo(funnel);
                                if (!expiry) return null;
                                const { diffDays, isExpired } = expiry;
                                if (isExpired) {
                                  return (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 rounded-lg border border-red-100 mb-1">
                                      <Clock size={11} className="text-red-500" />
                                      <span className="text-[10px] font-bold text-red-600">Expired</span>
                                    </div>
                                  );
                                }
                                return (
                                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border mb-1 ${
                                    diffDays <= 5 
                                      ? 'bg-amber-50 border-amber-100' 
                                      : 'bg-emerald-50 border-emerald-100'
                                  }`}>
                                    <Clock size={11} className={diffDays <= 5 ? 'text-amber-500' : 'text-emerald-500'} />
                                    <span className={`text-[10px] font-bold ${
                                      diffDays <= 5 ? 'text-amber-600' : 'text-emerald-600'
                                    }`}>
                                      {diffDays} day{diffDays !== 1 ? 's' : ''} left
                                    </span>
                                  </div>
                                );
                              })()}
                              
                              <h3 className="text-lg font-black text-slate-800 tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                {funnel.name}
                              </h3>
                              <div className="mt-3 flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg group/link">
                                <span className="text-[10px] font-mono text-slate-500 truncate flex-1 pl-1">
                                  {typeof window !== 'undefined' ? window.location.host : 'funnellink.co'}/{funnel.slug}
                                </span>
                                <button 
                                  onClick={() => handleCopyLink(funnel.slug, funnel.id)}
                                  className="p-1.5 bg-white text-slate-400 border border-slate-200 rounded hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
                                  title="Copy Link"
                                >
                                  {copiedId === funnel.id ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                </button>
                              </div>
                            </div>

                            {/* Funnel Metrics Checklist */}
                            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 border border-slate-100/50">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 font-semibold">Views</span>
                                <span className="font-bold text-slate-700">{views.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 font-semibold">WhatsApp Clicks</span>
                                <span className="font-bold text-slate-700">{clicks.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 font-semibold">Leads</span>
                                <span className="font-bold text-slate-700">{funnel.leads_count.toLocaleString()}</span>
                              </div>
                              {lastLeadText && (
                                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                  <span className="text-slate-400 font-semibold">Last Lead</span>
                                  <span className="font-bold text-slate-500">{lastLeadText}</span>
                                </div>
                              )}
                            </div>

                            {/* Mini Lead Preview (Max 2) */}
                            {funnelLeads.length > 0 && (
                              <div className="space-y-2 pt-1">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent Leads</h4>
                                <div className="space-y-1.5">
                                  {funnelLeads.slice(0, 2).map((lead) => {
                                    let interest = '';
                                    try {
                                      if (lead.budget_range) {
                                        const parsed = JSON.parse(lead.budget_range);
                                        interest = parsed.productName || parsed.source || '';
                                      }
                                    } catch (e) {}
                                    
                                    return (
                                      <div key={lead.id} className="text-xs bg-slate-50/50 rounded-lg p-2 border border-slate-100 flex flex-col">
                                        <span className="font-bold text-slate-700">{lead.visitor_name || 'Visitor'}</span>
                                        {interest && (
                                          <span className="text-[10px] text-slate-400 truncate mt-0.5">
                                            Interested in {interest}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                              {/* Show Renew button if expired */}
                              {mounted && getExpiryInfo(funnel)?.isExpired ? (
                                <button
                                  onClick={() => handleRenew(funnel)}
                                  disabled={isProcessing}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:from-indigo-500 hover:to-violet-500 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                                >
                                  {isProcessing ? (
                                    <><Loader2 size={12} className="animate-spin" /> Processing...</>
                                  ) : (
                                    <><CreditCard size={12} /> Renew +30 Days</>
                                  )}
                                </button>
                              ) : (
                                <Link 
                                  href={`/dashboard/funnels/${funnel.id}/edit`}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-600 transition-all shadow-sm active:scale-[0.98]"
                                >
                                  Configure
                                </Link>
                              )}
                              <Link 
                                href={`/${funnel.slug}`} 
                                target="_blank"
                                className="p-2.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                title="View Live"
                              >
                                <ExternalLink size={13} />
                              </Link>
                              <button 
                                onClick={() => handleDelete(funnel.id)}
                                className="p-2.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all"
                                title="Delete"
                              >
                                {deletingId === funnel.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* List View Content */
                          <>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600 bg-indigo-50 flex-shrink-0">
                                <Layers size={16} />
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{funnel.name}</h3>
                                <p className="text-[11px] text-slate-400 font-mono">/{funnel.slug}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-8">
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Views</p>
                                <p className="text-sm font-semibold text-slate-700">{views.toLocaleString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">WhatsApp Clicks</p>
                                <p className="text-sm font-semibold text-slate-700">{clicks.toLocaleString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Leads</p>
                                <p className="text-sm font-semibold text-slate-700">{funnel.leads_count.toLocaleString()}</p>
                              </div>
                              <div className="flex items-center gap-1.5 ml-4">
                                <Link 
                                  href={`/dashboard/funnels/${funnel.id}/edit`} 
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Pencil size={14} />
                                </Link>
                                <Link 
                                  href={`/${funnel.slug}`} 
                                  target="_blank" 
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                  title="View Live"
                                >
                                  <ExternalLink size={14} />
                                </Link>
                                <button 
                                  onClick={() => handleDelete(funnel.id)} 
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in-up">
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
