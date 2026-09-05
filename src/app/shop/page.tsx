import { Suspense } from 'react';
import { ShopCatalog } from '@/components/shop/ShopCatalog';

export const metadata = {
  title: 'Shop All Authentic Patanjali Products | Ayurveda & Botanicals',
  description: 'Browse complete catalog of genuine Patanjali formulations across Personal Care, Hair Care, Oral Care, Health and Vedic Foods.',
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ayur-ivory" />}>
      <ShopCatalog />
    </Suspense>
  );
}
