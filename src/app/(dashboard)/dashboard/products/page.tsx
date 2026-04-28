import { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/app/actions/products';
import { ProductsClient } from './ProductsClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Products | FunnelLink Studio',
  description: 'Manage your product catalog for high-conversion discovery engines.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
         <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
         <p className="text-xs text-slate-400">Loading products...</p>
      </div>
    }>
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
