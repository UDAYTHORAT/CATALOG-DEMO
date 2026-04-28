'use client';

import { useState, useMemo } from 'react';
import { Layers, Plus, Trash2, ExternalLink, Settings2, Loader2, Pencil, BarChart3, ArrowUpRight, Zap, Play } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CreateFunnelModal } from '@/components/dashboard/CreateFunnelModal';
import { TemplateGallery } from '@/components/dashboard/TemplateGallery';
import { Funnel, deleteFunnel } from '@/app/actions/funnels';
import { Product } from '@/app/actions/products';
import Link from 'next/link';

interface FunnelsClientProps {
  initialFunnels: Funnel[];
  availableProducts: Product[];
}

export function FunnelsClient({ initialFunnels, availableProducts }: FunnelsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-funnels' | 'templates'>(initialFunnels.length > 0 ? 'my-funnels' : 'templates');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

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

  const totalLeads = useMemo(() => initialFunnels.reduce((acc, f) => acc + (f.leads_count || 0), 0), [initialFunnels]);

  return (
    <>
      {initialFunnels.length === 0 && activeTab === 'my-funnels' ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 relative shadow-inner">
            <div className="absolute inset-0 bg-indigo-100/50 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <Zap className="w-10 h-10 text-indigo-600 relative z-10" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Launch Your First Funnel</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
            Create high-converting, smart product links in seconds. Choose a proven template and start capturing leads instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('templates')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              <Layers size={18} />
              Browse Templates
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 border border-slate-200 text-sm font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm hover:-translate-y-0.5"
            >
              <Plus size={18} />
              Start from Scratch
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in-up">
          {/* Dashboard Stats & Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Funnels</h1>
              <p className="text-slate-500 font-medium">Manage your smart links and track conversions in real-time.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Quick Stats */}
              <div className="flex bg-slate-50/50 rounded-2xl p-1.5 border border-slate-100">
                <div className="px-5 py-2.5 flex items-center gap-4 border-r border-slate-200/60">
                  <div className="p-2.5 bg-indigo-100/50 text-indigo-600 rounded-xl shadow-sm">
                    <Layers size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Active Funnels</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">{initialFunnels.length}</p>
                  </div>
                </div>
                <div className="px-5 py-2.5 flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-100/50 text-emerald-600 rounded-xl shadow-sm">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Total Leads</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">{totalLeads}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedTemplate(null);
                  setIsModalOpen(true);
                }}
                className="group relative inline-flex items-center gap-2 px-6 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl w-full sm:w-auto justify-center overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <Plus size={18} />
                <span>New Funnel</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm inline-flex">
            <button 
              onClick={() => setActiveTab('my-funnels')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'my-funnels' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              My Funnels
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'templates' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Zap size={16} className={activeTab === 'templates' ? 'text-amber-400' : 'text-slate-400'} />
              Templates Gallery
            </button>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {activeTab === 'my-funnels' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {initialFunnels.map((funnel) => (
                  <div key={funnel.id} className="group bg-white rounded-[24px] p-2 transition-all duration-400 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-slate-100 hover:border-indigo-100 hover:-translate-y-1.5 cursor-default">
                    <div className="bg-slate-50/50 rounded-[18px] p-6 h-full flex flex-col relative overflow-hidden">
                      {/* Top Action Bar */}
                      <div className="flex items-start justify-between mb-8 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ring-4 ring-white ${
                          funnel.theme === 'dark' || funnel.theme === 'onyx' ? 'bg-gradient-to-br from-slate-700 to-slate-900' : 
                          funnel.theme === 'kinetic' ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600' : 
                          funnel.theme === 'minimal' ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800' :
                          'bg-gradient-to-br from-indigo-500 to-blue-600'
                        }`}>
                          <Layers size={24} className={funnel.theme === 'minimal' ? 'text-slate-800' : 'text-white'} />
                        </div>
                        
                        <div className="flex gap-2">
                          <Link 
                            href={`/s/${funnel.slug}`} 
                            target="_blank"
                            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all z-20 relative"
                            title="View Public Funnel"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(funnel.id)}
                            disabled={deletingId === funnel.id}
                            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-red-600 hover:border-red-200 hover:bg-red-50 hover:shadow-md transition-all disabled:opacity-50 z-20 relative"
                            title="Delete Funnel"
                          >
                            {deletingId === funnel.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Main Content */}
                      <Link href={`/dashboard/funnels/${funnel.id}/edit`} className="flex-1 block group/link relative z-10">
                        <div className="flex items-center gap-2.5 mb-2">
                          <h3 className="font-extrabold text-slate-900 text-xl group-hover/link:text-indigo-600 transition-colors line-clamp-1">
                            {funnel.name}
                          </h3>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Active" />
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium mb-8">
                          <span className="truncate bg-white px-3 py-1 rounded-md border border-slate-200/60 shadow-sm text-xs font-mono">
                            /s/{funnel.slug}
                          </span>
                        </div>
                        
                        {/* Stats Card inside Funnel */}
                        <div className="bg-white rounded-[16px] p-5 border border-slate-100 shadow-sm group-hover/link:border-indigo-200 transition-all flex items-center justify-between group-hover/link:shadow-md">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover/link:scale-110 transition-transform duration-300">
                              <BarChart3 size={20} />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Leads</p>
                              <p className="text-2xl font-black text-slate-900 leading-tight">{funnel.leads_count}</p>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover/link:bg-indigo-600 group-hover/link:text-white transition-all duration-300 shadow-sm group-hover/link:shadow-lg group-hover/link:-rotate-12">
                            <ArrowUpRight size={20} />
                          </div>
                        </div>
                      </Link>

                      {/* Hover effect background decoration */}
                      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 animate-fade-in-up">
                <TemplateGallery onSelect={handleTemplateSelect} />
              </div>
            )}
          </div>
        </div>
      )}

      <CreateFunnelModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        availableProducts={availableProducts}
        selectedTemplate={selectedTemplate}
      />
    </>
  );
}
