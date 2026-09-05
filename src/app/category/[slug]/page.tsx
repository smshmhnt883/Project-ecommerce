import { notFound, redirect } from 'next/navigation';
import { CATEGORIES } from '@/lib/data/categories';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return { title: 'Category Not Found' };

  return {
    title: `${cat.name} Products | Authentic Patanjali Store`,
    description: cat.description,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);

  if (!cat) {
    notFound();
  }

  redirect(`/shop?category=${cat.slug}`);
}
