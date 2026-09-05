import { insforge } from '@/lib/insforge';
import { Product } from '@/types';
import { PRODUCTS } from '@/lib/data/products';

// Helper to map DB row + images to full Product domain model
function mapDbProductToProduct(row: any, images: string[] = []): Product {
  let ingredients = [];
  try {
    ingredients = typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : row.ingredients || [];
  } catch (e) {
    ingredients = [];
  }

  let info: any = {};
  try {
    info = typeof row.product_information === 'string' ? JSON.parse(row.product_information) : row.product_information || {};
  } catch (e) {
    info = {};
  }

  const localFallback = PRODUCTS.find((p) => p.id === row.id || p.slug === row.slug);
  const prodImages = images.length > 0 ? images : (localFallback?.images && localFallback.images.length > 0 ? localFallback.images : ['/products/patanjali-dant-kanti.jpg']);
  const categorySlug = localFallback?.categorySlug || row.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    id: row.id,
    name: row.name,
    hindiName: info.hindiName || localFallback?.hindiName,
    slug: row.slug,
    category: row.category,
    categorySlug,
    subcategory: row.subcategory || localFallback?.subcategory,
    concernSlugs: info.concernSlugs || localFallback?.concernSlugs || [],
    description: row.description,
    shortDescription: row.short_description || row.description.slice(0, 120),
    price: Number(row.price),
    mrp: Number(row.mrp),
    discount: Number(row.discount_percentage || 0),
    images: prodImages,
    thumbnail: prodImages[0],
    sku: row.sku || `PAT-${row.id}`,
    size: row.size || localFallback?.size || 'Standard',
    availableSizes: info.availableSizes || localFallback?.availableSizes || [row.size || 'Standard'],
    stock: Number(row.stock_quantity || 100),
    inStock: Number(row.stock_quantity || 100) > 0,
    rating: Number(row.rating || 4.5),
    reviewCount: Number(row.review_count || 0),
    featured: Boolean(row.featured),
    bestseller: Boolean(row.bestseller),
    badge: row.bestseller ? 'Bestseller' : row.featured ? 'Featured' : localFallback?.badge,
    ingredients,
    benefits: info.benefits || localFallback?.benefits || [],
    usage: row.usage || localFallback?.usage || '',
    storage: info.storage || localFallback?.storage,
    manufacturer: info.manufacturer || localFallback?.manufacturer || {
      name: 'Patanjali Ayurved Limited',
      address: 'Unit-III, Patanjali Food & Herbal Park, Haridwar - 249404, Uttarakhand, India',
      license: 'A-2878/99',
      shelfLife: '24 Months',
      countryOfOrigin: 'India',
    },
  };
}

export async function getProducts(options: {
  category?: string;
  concern?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  bestseller?: boolean;
  limit?: number;
} = {}): Promise<Product[]> {
  try {
    let query = insforge.database.from('products').select('*');

    if (options.featured) {
      query = query.eq('featured', true);
    }
    if (options.bestseller) {
      query = query.eq('bestseller', true);
    }
    if (options.category) {
      query = query.ilike('category', `%${options.category}%`);
    }
    if (options.search) {
      const s = options.search.trim();
      query = query.or(`name.ilike.%${s}%,category.ilike.%${s}%,description.ilike.%${s}%`);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const [prodRes, imgRes] = await Promise.all([
      query,
      insforge.database.from('product_images').select('*').order('sort_order', { ascending: true })
    ]);

    const data = prodRes.data;
    const imagesData = imgRes.data || [];

    if (!prodRes.error && data && data.length > 0) {
      return data.map((row: any) => {
        const rowImages = imagesData
          .filter((img: any) => img.product_id === row.id)
          .map((img: any) => img.image_url);
        return mapDbProductToProduct(row, rowImages);
      });
    }
  } catch (e) {
    console.warn('InsForge database query failed, falling back to local dataset:', e);
  }

  // Graceful fallback to verified catalog
  let filtered = [...PRODUCTS];
  if (options.featured) {
    filtered = filtered.filter((p) => p.featured);
  }
  if (options.bestseller) {
    filtered = filtered.filter((p) => p.bestseller);
  }
  if (options.category) {
    const cat = options.category.toLowerCase();
    filtered = filtered.filter(
      (p) => p.category.toLowerCase().includes(cat) || p.categorySlug.toLowerCase().includes(cat)
    );
  }
  if (options.concern) {
    const con = options.concern.toLowerCase();
    filtered = filtered.filter((p) => p.concernSlugs.some((c) => c.toLowerCase().includes(con)));
  }
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  if (options.sort) {
    switch (options.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
    }
  }

  if (options.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await insforge.database
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      const { data: imgData } = await insforge.database
        .from('product_images')
        .select('image_url')
        .eq('product_id', data.id)
        .order('sort_order', { ascending: true });
      const images = (imgData || []).map((img: any) => img.image_url);
      return mapDbProductToProduct(data, images);
    }
  } catch (e) {
    console.warn(`InsForge product query for slug "${slug}" failed, falling back:`, e);
  }

  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await insforge.database
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      const { data: imgData } = await insforge.database
        .from('product_images')
        .select('image_url')
        .eq('product_id', data.id)
        .order('sort_order', { ascending: true });
      const images = (imgData || []).map((img: any) => img.image_url);
      return mapDbProductToProduct(data, images);
    }
  } catch (e) {
    console.warn(`InsForge product query for ID "${id}" failed, falling back:`, e);
  }

  return PRODUCTS.find((p) => p.id === id) || null;
}
