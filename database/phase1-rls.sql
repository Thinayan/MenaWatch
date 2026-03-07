-- Phase 1: RLS policies for reading
-- Run in Supabase SQL Editor

-- DEFCON alerts: authenticated users can read
CREATE POLICY "authenticated_read_defcon" ON public.defcon_alerts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Daily reports: authenticated users can read
CREATE POLICY "authenticated_read_reports" ON public.daily_reports
  FOR SELECT USING (auth.role() = 'authenticated');
