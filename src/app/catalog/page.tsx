import Catalog from '@/components/Catalog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Archive | AURELIAN STUDIO',
  description: 'Explore the 2024 Artifact Collection in immersive detail.',
};

export default function CatalogPage() {
  return (
    <main>
      <Catalog />
    </main>
  );
}
