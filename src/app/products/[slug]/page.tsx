import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data/products';
import { getProductBySlug } from '@/lib/api/products';
import { ProductDetailView } from '@/components/product/ProductDetailView';

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Authentic Patanjali Store`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} - ₹${product.price}`,
      description: product.shortDescription,
      images: [
        {
          url: product.thumbnail || product.images[0],
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
