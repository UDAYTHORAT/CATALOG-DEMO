'use client';

import Header from '@/components/Header';
import { PRODUCTS, Product } from '@/data/catalog';
import { ChevronLeft, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, Suspense } from 'react';

function CompareContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get('ids')?.split(',') || [];
  
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  const selectedProducts = useMemo(() => {
    return selectedIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[];
  }, [selectedIds]);

  const toggleProduct = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(pId => pId !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const comparisonRows = [
    { label: 'Category', key: 'category' },
    { label: 'Price', key: 'price', format: (val: number) => `$${val}` },
    { label: 'Dimensions', key: 'dimensions', format: (val: any) => `${val.length}x${val.width}x${val.height} ${val.unit}` },
    { label: 'Materials', key: 'materials', format: (val: string[]) => val.join(', ') },
    { label: 'Finish', key: 'finish' },
    { label: 'Construction', key: 'construction' },
    { label: 'Origin', key: 'origin' },
    { label: 'Weight', key: 'weight' },
    { label: 'Lead Time', key: 'leadTime' },
  ];

  return (
    <main className="bg-white min-h-screen">
      <Header />
      
      <div className="pt-32 pb-48 px-8 md:px-20 max-w-[1700px] mx-auto">
        <Link href="/catalog" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-16 hover:-translate-x-2 transition-all">
          <ChevronLeft size={16} /> Back to Collection
        </Link>

        <div className="mb-20">
          <h1 className="text-4xl md:text-8xl font-chubbo tracking-tighter mb-6">Compare Artifacts</h1>
          <p className="text-gray-400 font-light max-w-xl">Side-by-side evaluation of structural integrity, materiality, and scale.</p>
        </div>

        {/* Product Selector Bar */}
        <div className="mb-16 border-b border-gray-100 pb-12">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6 block">Select up to 3 products to compare</span>
           <div className="flex flex-wrap gap-4">
              {PRODUCTS.map(p => (
                <button 
                  key={p.id}
                  onClick={() => toggleProduct(p.id)}
                  className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm border ${selectedIds.includes(p.id) ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-400'}`}
                >
                  {p.name}
                </button>
              ))}
           </div>
        </div>

        {/* Comparison Table */}
        {selectedProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-8 text-left border-b border-gray-100 w-64 bg-white sticky left-0 z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Spec / Artifact</span>
                  </th>
                  {selectedProducts.map(p => (
                    <th key={p.id} className="p-8 text-left border-b border-gray-100 min-w-[320px]">
                      <div className="flex flex-col gap-4">
                         <div className="aspect-[4/3] bg-gray-50 rounded-sm overflow-hidden mb-4">
                            <img src={p.images.hero} alt={p.name} className="w-full h-full object-cover" />
                         </div>
                         <h3 className="text-3xl font-chubbo tracking-tighter">{p.name}</h3>
                         <Link href={`/catalog/${p.id}`} className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-black transition-colors">View Details</Link>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty slots */}
                  {Array.from({ length: Math.max(0, 3 - selectedProducts.length) }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-8 text-left border-b border-gray-100 min-w-[320px]">
                       <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 p-12 text-gray-200">
                          <Plus size={40} />
                       </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-8 border-b border-gray-100 bg-white sticky left-0 z-10 group-hover:bg-gray-50 transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">{row.label}</span>
                    </td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className="p-8 border-b border-gray-100">
                        <span className="text-sm font-medium">
                          {row.format ? row.format((p as any)[row.key]) : (p as any)[row.key]}
                        </span>
                      </td>
                    ))}
                    {/* Fill empty slots */}
                    {Array.from({ length: Math.max(0, 3 - selectedProducts.length) }).map((_, i) => (
                      <td key={`empty-cell-${i}`} className="p-8 border-b border-gray-100"></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-40 text-center bg-gray-50 rounded-lg">
             <p className="text-gray-400 font-light">No artifacts selected for comparison.</p>
          </div>
        )}
      </div>
      
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div>Loading Archive...</div>}>
      <CompareContent />
    </Suspense>
  );
}
