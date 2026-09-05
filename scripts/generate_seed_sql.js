const fs = require('fs');
const path = require('path');

const prodFilePath = path.join(__dirname, '../lib/data/products.ts');
const prodTs = fs.readFileSync(prodFilePath, 'utf-8');

// Extract the PRODUCTS array
const startMarker = 'export const PRODUCTS: Product[] = [';
const startIndex = prodTs.indexOf(startMarker);
if (startIndex === -1) {
  console.error('Could not find PRODUCTS array');
  process.exit(1);
}

const arrayCode = prodTs.slice(startIndex + startMarker.length - 1, prodTs.lastIndexOf('];') + 1);
const products = eval(arrayCode);

let sql = '-- Seed 10 Authentic Patanjali Products\n\n';

for (const p of products) {
  const escapeStr = (s) => (s ? "'" + String(s).replace(/'/g, "''") + "'" : 'NULL');
  const info = JSON.stringify({
    benefits: p.benefits,
    storage: p.storage,
    manufacturer: p.manufacturer,
    hindiName: p.hindiName,
    concernSlugs: p.concernSlugs,
    availableSizes: p.availableSizes
  });

  sql += `INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  ${escapeStr(p.id)},
  ${escapeStr(p.name)},
  ${escapeStr(p.slug)},
  ${escapeStr(p.description)},
  ${escapeStr(p.shortDescription)},
  ${escapeStr(p.category)},
  ${escapeStr(p.subcategory || '')},
  ${p.price},
  ${p.mrp},
  ${p.discount},
  ${escapeStr(p.sku)},
  ${p.stock},
  ${escapeStr(p.size)},
  ${escapeStr(p.size.replace(/[0-9\s]/g, ''))},
  ${escapeStr(JSON.stringify(p.ingredients))},
  ${escapeStr(p.usage)},
  ${escapeStr(info)},
  ${p.featured},
  ${p.bestseller},
  ${p.rating},
  ${p.reviewCount}
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;\n\n`;

  for (let i = 0; i < p.images.length; i++) {
    sql += `INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES (${escapeStr(p.id)}, ${escapeStr(p.images[i])}, ${i}, ${escapeStr(p.name + ' Packaging View ' + (i+1))});\n`;
  }
  sql += '\n';
}

const outPath = path.join(__dirname, '../migrations/002_seed_products.sql');
fs.writeFileSync(outPath, sql);
console.log('Successfully generated', outPath, 'with', products.length, 'products');
