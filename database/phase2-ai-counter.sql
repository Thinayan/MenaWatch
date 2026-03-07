-- Phase 2: AI usage counter columns
-- Run in Supabase SQL Editor

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ai_uses_today INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_ai_reset DATE DEFAULT CURRENT_DATE;

-- Profile fields for notifications and regions
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS alert_regions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS daily_email BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS defcon_alerts BOOLEAN DEFAULT true;
