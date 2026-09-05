-- Migration 005: Add Razorpay fields to orders table
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PAYMENT_PENDING';
