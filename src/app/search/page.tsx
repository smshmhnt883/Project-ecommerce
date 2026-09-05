import { Suspense } from 'react';
import { ShopCatalog } from '@/components/shop/ShopCatalog';

export const metadata = {
  title: 'Search Results | Ayurveda & Botanicals',
  description: 'Search results for authentic Patanjali Ayurvedic products.',
};

function SearchContent({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  return (
    <ShopCatalog
      initialSearchQuery={query}
      pageTitle={query ? `Search Results for "${query}"` : 'Product Search'}
      pageDescription={
        query
          ? `Showing matching authentic Patanjali formulations for "${query}".`
          : 'Browse and search our entire Ayurvedic inventory.'
      }
    />
  );
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs">Loading search results...</div>}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}
