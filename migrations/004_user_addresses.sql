-- =========================================================
-- Migration: 004_user_addresses.sql
-- Description: Create user_addresses table with RLS and migrate existing records
-- =========================================================

CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_addresses' AND policyname = 'Users can view their own user_addresses'
  ) THEN
    CREATE POLICY "Users can view their own user_addresses"
      ON public.user_addresses FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_addresses' AND policyname = 'Users can insert their own user_addresses'
  ) THEN
    CREATE POLICY "Users can insert their own user_addresses"
      ON public.user_addresses FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_addresses' AND policyname = 'Users can update their own user_addresses'
  ) THEN
    CREATE POLICY "Users can update their own user_addresses"
      ON public.user_addresses FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_addresses' AND policyname = 'Users can delete their own user_addresses'
  ) THEN
    CREATE POLICY "Users can delete their own user_addresses"
      ON public.user_addresses FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Migrate any existing records from addresses table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'addresses' AND table_schema = 'public') THEN
    INSERT INTO public.user_addresses (id, user_id, full_name, phone_number, address_line1, address_line2, city, state, pincode, is_default, created_at, updated_at)
    SELECT id, user_id, full_name, phone, address_line, apartment, city, state, pincode, is_default, created_at, updated_at
    FROM public.addresses
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
