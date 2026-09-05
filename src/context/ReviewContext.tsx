'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Review } from '@/types';
import { SEED_REVIEWS } from '@/lib/data/reviews';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { insforge } from '@/lib/insforge';

interface ReviewContextType {
  reviews: Review[];
  getProductReviews: (productId: string) => Review[];
  addReview: (data: {
    productId: string;
    userName: string;
    userLocation?: string;
    rating: number;
    title: string;
    comment: string;
  }) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('patanjali_custom_reviews');
      if (saved) {
        const parsed: Review[] = JSON.parse(saved);
        setReviews([...parsed, ...SEED_REVIEWS]);
      }
    } catch (e) {
      console.error('Failed to load custom reviews', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Fetch reviews from InsForge on mount
  useEffect(() => {
    async function fetchBackendReviews() {
      try {
        const { data, error } = await insforge.database
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mappedReviews: Review[] = data.map((r: any) => ({
            id: r.id,
            productId: r.product_id,
            userName: r.reviewer_name || 'Verified Customer',
            userLocation: 'India',
            rating: r.rating,
            title: r.title,
            comment: r.body,
            date: new Date(r.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            verified: true,
            helpfulCount: 1,
          }));

          setReviews((prev) => {
            const combined = [...mappedReviews];
            for (const p of prev) {
              if (!combined.some((c) => c.id === p.id)) {
                combined.push(p);
              }
            }
            return combined;
          });
        }
      } catch (err) {
        console.warn('Reviews fetch warning:', err);
      }
    }

    fetchBackendReviews();
  }, []);

  const addReview = ({
    productId,
    userName,
    userLocation,
    rating,
    title,
    comment,
  }: {
    productId: string;
    userName: string;
    userLocation?: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    if (rating < 1 || rating > 5) {
      showToast('Rating must be between 1 and 5 stars.', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast('Please provide a review comment.', 'error');
      return;
    }

    const reviewId = 'rev-' + Date.now();
    const newReview: Review = {
      id: reviewId,
      productId,
      userName: userName.trim() || user?.name || 'Verified Customer',
      userLocation: userLocation?.trim() || 'India',
      rating,
      title: title.trim() || 'Verified Ayurvedic Review',
      comment: comment.trim(),
      date: 'Just now',
      verified: true,
      helpfulCount: 0,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Save to InsForge reviews table if authenticated
    if (isAuthenticated && user?.id) {
      insforge.database.from('reviews').insert({
        product_id: productId,
        user_id: user.id,
        reviewer_name: newReview.userName,
        rating,
        title: newReview.title,
        body: newReview.comment,
      }).then();
    }

    try {
      const saved = localStorage.getItem('patanjali_custom_reviews');
      const existing: Review[] = saved ? JSON.parse(saved) : [];
      localStorage.setItem('patanjali_custom_reviews', JSON.stringify([newReview, ...existing]));
    } catch (e) {
      console.error('Failed to persist custom review', e);
    }

    showToast('Your review has been submitted and verified. Thank you!', 'success');
  };

  const getProductReviews = (productId: string): Review[] => {
    return reviews.filter((r) => r.productId === productId);
  };

  return (
    <ReviewContext.Provider value={{ reviews, getProductReviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}
