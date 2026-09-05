const fs = require('fs');
const path = require('path');

const reviewsFilePath = path.join(__dirname, '../lib/data/reviews.ts');
const reviewsTs = fs.readFileSync(reviewsFilePath, 'utf-8');

// Extract the SEED_REVIEWS array
const startMarker = 'export const SEED_REVIEWS: Review[] = [';
const startIndex = reviewsTs.indexOf(startMarker);
if (startIndex === -1) {
  console.error('Could not find SEED_REVIEWS array');
  process.exit(1);
}

const arrayCode = reviewsTs.slice(startIndex + startMarker.length - 1, reviewsTs.lastIndexOf('];') + 1);
const reviews = eval(arrayCode);

let sql = '-- Seed Reviews\n\n';

for (const r of reviews) {
  const escapeStr = (s) => (s ? "'" + String(s).replace(/'/g, "''") + "'" : 'NULL');
  sql += `INSERT INTO public.reviews (
  product_id, reviewer_name, rating, title, body
) VALUES (
  ${escapeStr(r.productId)},
  ${escapeStr(r.userName)},
  ${r.rating},
  ${escapeStr(r.title)},
  ${escapeStr(r.comment)}
);\n`;
}

const outPath = path.join(__dirname, '../migrations/003_seed_reviews.sql');
fs.writeFileSync(outPath, sql);
console.log('Successfully generated', outPath, 'with', reviews.length, 'reviews');
