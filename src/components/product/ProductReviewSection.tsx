'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, X, Send } from 'lucide-react';
import { Product, Review } from '@/types';
import { useToast } from '@/context/ToastContext';

interface RatingBreakdown {
  total: number;
  stars5: number;
  stars4: number;
  stars3: number;
  stars2: number;
  stars1: number;
}

interface ProductReviewSectionProps {
  product: Product;
  reviews: Review[];
  ratingBreakdown: RatingBreakdown;
  onReviewSubmit: (reviewData: {
    productId: string;
    userName: string;
    userLocation: string;
    rating: number;
    title: string;
    comment: string;
  }) => void;
}

export function ProductReviewSection({
  product,
  reviews,
  ratingBreakdown,
  onReviewSubmit,
}: ProductReviewSectionProps) {
  const { showToast } = useToast();
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewBody.trim() || !reviewAuthor.trim()) {
      showToast('Please fill in your name, title, and review description.', 'error');
      return;
    }

    onReviewSubmit({
      productId: product.id,
      userName: reviewAuthor,
      userLocation: reviewCity || 'India',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewBody,
    });

    setIsReviewModalOpen(false);
    setReviewTitle('');
    setReviewBody('');
  };

  return (
    <>
      <section id="reviews" className="mb-16 pt-8 border-t border-ayur-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-ayur-green-800 block mb-1">
              RATINGS & FEEDBACK
            </span>
            <h3 className="font-serif text-2xl text-ayur-green-950 font-normal">
              Customer Reviews
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="mt-4 sm:mt-0 px-6 py-2.5 bg-ayur-green-900 text-white rounded-lg text-xs font-semibold tracking-wider uppercase hover:bg-ayur-green-800 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Review Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl border border-ayur-border shadow-soft mb-8">
          {/* Left Big Score */}
          <div className="md:col-span-4 text-center md:border-r md:border-ayur-border/80 md:pr-8">
            <div className="text-5xl font-serif font-bold text-ayur-charcoal-900">
              {product.rating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center text-ayur-amber-500 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-ayur-charcoal-500">
              Based on {ratingBreakdown.total} customer evaluations
            </p>
          </div>

          {/* Right Distribution Bars */}
          <div className="md:col-span-8 space-y-2">
            {[
              { stars: 5, count: ratingBreakdown.stars5 },
              { stars: 4, count: ratingBreakdown.stars4 },
              { stars: 3, count: ratingBreakdown.stars3 },
              { stars: 2, count: ratingBreakdown.stars2 },
              { stars: 1, count: ratingBreakdown.stars1 },
            ].map((row) => {
              const pct = ratingBreakdown.total > 0 ? Math.round((row.count / ratingBreakdown.total) * 100) : 0;
              return (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-10 text-ayur-charcoal-700 font-medium">{row.stars} ★</span>
                  <div className="flex-1 bg-ayur-cream h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-ayur-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-ayur-charcoal-500">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-ayur-border">
              <p className="text-xs text-ayur-charcoal-600">Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 sm:p-6 rounded-xl border border-ayur-border space-y-2 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-ayur-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold text-xs text-ayur-charcoal-900">
                      {rev.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-ayur-charcoal-400">{rev.date}</span>
                </div>

                <p className="text-xs text-ayur-charcoal-700 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center gap-3 pt-2 text-[11px] text-ayur-charcoal-500">
                  <span className="font-medium text-ayur-charcoal-800">{rev.userName}</span>
                  {rev.userLocation && <span>({rev.userLocation})</span>}
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Purchase</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsReviewModalOpen(false)}
          />
          <div className="relative bg-white rounded-md max-w-lg w-full p-6 sm:p-8 shadow-xl border border-ayur-border z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-ayur-border pb-3">
              <h3 className="font-serif text-lg font-semibold text-ayur-charcoal-900">
                Write a Review for {product.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 text-ayur-charcoal-400 hover:text-ayur-charcoal-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ayur-charcoal-800 block mb-1">
                  Overall Rating
                </label>
                <div className="flex gap-1.5 text-ayur-amber-500 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setReviewRating(starVal)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          starVal <= reviewRating ? 'fill-current' : 'text-ayur-border'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-ayur-charcoal-800 block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3 py-2 text-xs bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ayur-charcoal-800 block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full px-3 py-2 text-xs bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ayur-charcoal-800 block mb-1">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Noticeable improvement in hair texture"
                  className="w-full px-3 py-2 text-xs bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ayur-charcoal-800 block mb-1">
                  Review Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Describe your authentic experience with this product, aroma, packaging, and results..."
                  className="w-full px-3 py-2 text-xs bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2.5 border border-ayur-border rounded-lg text-xs font-semibold text-ayur-charcoal-700 hover:bg-ayur-cream uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-ayur-green-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-green-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
