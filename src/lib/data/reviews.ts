import { Review } from '@/types';

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    productId: 'pat-001',
    userName: 'Rajesh Sharma',
    userLocation: 'Jaipur, Rajasthan',
    rating: 5,
    title: 'Authentic taste and noticeable gum freshness',
    comment: 'Have been using Dant Kanti for years. The herbal astringency and clove aroma feel so much cleaner than regular commercial pastes. Highly recommend it for everyday family use.',
    date: '12 August 2025',
    verified: true,
    helpfulCount: 42,
  },
  {
    id: 'rev-002',
    productId: 'pat-001',
    userName: 'Sunita Varma',
    userLocation: 'Pune, Maharashtra',
    rating: 5,
    title: 'Helps with morning sensitivity',
    comment: 'The presence of babool and neem really makes a difference. My family shifted to this completely.',
    date: '28 July 2025',
    verified: true,
    helpfulCount: 19,
  },
  {
    id: 'rev-003',
    productId: 'pat-002',
    userName: 'Vikramaditya Rao',
    userLocation: 'Bengaluru, Karnataka',
    rating: 5,
    title: 'Gentle on scalp and doesn’t dry hair',
    comment: 'The aloe vera content keeps the scalp hydrated even in dry weather. Subtle natural aroma and rinses out cleanly without leaving any heavy residue.',
    date: '15 July 2025',
    verified: true,
    helpfulCount: 64,
  },
  {
    id: 'rev-004',
    productId: 'pat-003',
    userName: 'Dr. Ananya Sen',
    userLocation: 'Kolkata, West Bengal',
    rating: 5,
    title: 'Purest aloe gel for daily hydration',
    comment: 'I use it as an after-sun hydrator and morning pre-moisturizer. Non-sticky, absorbs in seconds, and does not cause breakouts on sensitive skin.',
    date: '19 August 2025',
    verified: true,
    helpfulCount: 88,
  },
  {
    id: 'rev-005',
    productId: 'pat-004',
    userName: 'Kavita Nair',
    userLocation: 'Kochi, Kerala',
    rating: 5,
    title: 'Pure multi-flora raw honey',
    comment: 'Real honey aroma and natural sweetness. We use it with warm lemon water in the morning and as an herbal vehicle for Ayurvedic churnas.',
    date: '02 September 2025',
    verified: true,
    helpfulCount: 35,
  },
  {
    id: 'rev-006',
    productId: 'pat-005',
    userName: 'Meenakshi Iyer',
    userLocation: 'Chennai, Tamil Nadu',
    rating: 5,
    title: 'Authentic Danedaar texture and heavenly aroma',
    comment: 'True golden cow ghee that smells just like homemade ghee. Perfect for our daily dosas and dal tadka.',
    date: '22 August 2025',
    verified: true,
    helpfulCount: 104,
  },
  {
    id: 'rev-007',
    productId: 'pat-006',
    userName: 'Ramesh Patel',
    userLocation: 'Ahmedabad, Gujarat',
    rating: 5,
    title: 'Soft rotis with wholesome wheat fiber',
    comment: 'Traditional stone-chakki grinding makes a clear difference. The rotis puff nicely and stay soft for hours. Unadulterated quality.',
    date: '05 September 2025',
    verified: true,
    helpfulCount: 52,
  },
  {
    id: 'rev-008',
    productId: 'pat-007',
    userName: 'Harish Kulkarni',
    userLocation: 'Nagpur, Maharashtra',
    rating: 5,
    title: 'Essential for seasonal transitions',
    comment: 'The whole family takes one spoonful with warm milk every morning. Rich amla base with gentle warming spices like saffron and pippali.',
    date: '10 January 2026',
    verified: true,
    helpfulCount: 73,
  },
  {
    id: 'rev-009',
    productId: 'pat-008',
    userName: 'Deepak Joshi',
    userLocation: 'Dehradun, Uttarakhand',
    rating: 5,
    title: 'High quality standardized Giloy Ghan',
    comment: 'Excellent natural immunity builder. Standardized extract tablets make it very easy to take daily without the bitter taste of raw decoction.',
    date: '18 December 2025',
    verified: true,
    helpfulCount: 41,
  },
  {
    id: 'rev-010',
    productId: 'pat-010',
    userName: 'Ritu Chawla',
    userLocation: 'Chandigarh',
    rating: 5,
    title: 'Pure steam-distilled rose water',
    comment: 'Extremely refreshing as a facial toner and eye mist. Smells like real fresh desi roses, without any harsh artificial perfume or alcohol.',
    date: '14 November 2025',
    verified: true,
    helpfulCount: 68,
  },
];

export interface RatingBreakdown {
  stars5: number;
  stars4: number;
  stars3: number;
  stars2: number;
  stars1: number;
  total: number;
  average: number;
}

export function getProductRatingBreakdown(reviews: Review[], baseRating: number, baseCount: number): RatingBreakdown {
  const total = baseCount;
  const stars5 = Math.round(total * 0.75);
  const stars4 = Math.round(total * 0.18);
  const stars3 = Math.round(total * 0.05);
  const stars2 = Math.round(total * 0.015);
  const stars1 = total - (stars5 + stars4 + stars3 + stars2);

  return {
    stars5,
    stars4,
    stars3,
    stars2,
    stars1,
    total,
    average: baseRating,
  };
}
