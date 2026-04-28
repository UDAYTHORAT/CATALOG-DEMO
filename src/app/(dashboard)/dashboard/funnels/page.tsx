import { getFunnels } from '@/app/actions/funnels';
import { getProducts } from '@/app/actions/products';
import { FunnelsClient } from './FunnelsClient';

export default async function FunnelsPage() {
  const [funnels, products] = await Promise.all([
    getFunnels(),
    getProducts()
  ]);

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12">
      <FunnelsClient initialFunnels={funnels} availableProducts={products} />
    </div>
  );
}
