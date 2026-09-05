import fs from 'fs';
import path from 'path';
import { createClient } from '@insforge/sdk';
import { PRODUCTS } from '../src/lib/data/products';

// Load .env.local
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://rj3p7x87.ap-southeast.insforge.app';
const apiKey = process.env.INSFORGE_API_KEY || 'ik_1993b4d22bd36c3596cb52fca06b04e8';

const client = createClient({
  baseUrl,
  anonKey: apiKey,
});

async function seed() {
  console.log(`Starting Patanjali Catalog Seeding to InsForge: ${baseUrl}`);

  try {
    for (const prod of PRODUCTS) {
      const productRecord = {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        short_description: prod.shortDescription,
        category: prod.category,
        subcategory: prod.subcategory || null,
        price: prod.price,
        mrp: prod.mrp,
        discount_percentage: prod.discount,
        sku: prod.sku,
        stock_quantity: prod.stock,
        size: prod.size,
        unit: prod.size.replace(/[0-9\s]/g, '') || null,
        ingredients: JSON.stringify(prod.ingredients),
        usage: prod.usage,
        product_information: JSON.stringify({
          benefits: prod.benefits,
          storage: prod.storage,
          manufacturer: prod.manufacturer,
          hindiName: prod.hindiName,
          concernSlugs: prod.concernSlugs,
          availableSizes: prod.availableSizes,
        }),
        featured: prod.featured,
        bestseller: prod.bestseller,
        rating: prod.rating,
        review_count: prod.reviewCount,
      };

      const { error: prodErr } = await client.database
        .from('products')
        .upsert(productRecord);

      if (prodErr) {
        console.warn(`Warning upserting product ${prod.id}:`, prodErr.message);
      } else {
        console.log(`✓ Product upserted: ${prod.name}`);
      }

      if (prod.images && prod.images.length > 0) {
        for (let i = 0; i < prod.images.length; i++) {
          const imgUrl = prod.images[i];
          const { error: imgErr } = await client.database
            .from('product_images')
            .upsert({
              product_id: prod.id,
              image_url: imgUrl,
              sort_order: i,
              alt_text: `${prod.name} packaging view ${i + 1}`,
            });
          if (imgErr) {
            console.warn(`  Warning image for ${prod.id}:`, imgErr.message);
          }
        }
      }
    }

    console.log(`Successfully completed seeding ${PRODUCTS.length} authentic Patanjali products into InsForge!`);
  } catch (err) {
    console.error('Seeding process encountered an error:', err);
  }
}

seed();
