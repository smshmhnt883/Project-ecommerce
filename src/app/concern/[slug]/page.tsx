import { notFound, redirect } from 'next/navigation';
import { CONCERNS } from '@/lib/data/concerns';

export function generateStaticParams() {
  return CONCERNS.map((c) => ({
    slug: c.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const concern = CONCERNS.find((c) => c.slug === params.slug);
  if (!concern) return { title: 'Concern Not Found' };

  return {
    title: `${concern.name} | Ayurvedic Care Rituals`,
    description: concern.description,
  };
}

export default function ConcernPage({ params }: { params: { slug: string } }) {
  const concern = CONCERNS.find((c) => c.slug === params.slug);

  if (!concern) {
    notFound();
  }

  redirect(`/shop?concern=${concern.slug}`);
}
