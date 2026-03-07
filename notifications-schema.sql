-- ============================================================
-- MENA Watch — جداول نظام الإشعارات
-- شغّل في: Supabase > SQL Editor
-- ============================================================

-- 1. جدول المشتركين
CREATE TABLE IF NOT EXISTS public.subscribers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email           TEXT UNIQUE NOT NULL,
  full_name       TEXT,
  source          TEXT DEFAULT 'website',
  alert_regions   TEXT[],          -- مناطق التنبيه المخصصة (فارغ = كل المناطق)
  alert_sectors   TEXT[],          -- قطاعات الاهتمام
  is_active       BOOLEAN DEFAULT TRUE,
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  resubscribed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ
);

-- 2. جدول التقارير اليومية
CREATE TABLE IF NOT EXISTS public.daily_reports (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date            DATE UNIQUE NOT NULL,
  content         TEXT NOT NULL,
  sent_to         INTEGER DEFAULT 0,
  success_count   INTEGER DEFAULT 0,
  market_snapshot JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول تنبيهات DEFCON
CREATE TABLE IF NOT EXISTS public.defcon_alerts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region          TEXT NOT NULL,
  previous_level  INTEGER NOT NULL,
  new_level       INTEGER NOT NULL,
  is_escalation   BOOLEAN NOT NULL,
  reason          TEXT,
  source          TEXT,
  sent_to         INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول سجل الإيميلات (للتتبع)
CREATE TABLE IF NOT EXISTS public.email_logs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type            TEXT NOT NULL, -- 'daily_report' | 'defcon_alert' | 'welcome'
  recipient       TEXT NOT NULL,
  subject         TEXT,
  status          TEXT DEFAULT 'sent', -- 'sent' | 'failed' | 'bounced'
  resend_id       TEXT,
  ref_id          UUID,           -- يشير لـ daily_reports أو defcon_alerts
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS
ALTER TABLE public.subscribers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defcon_alerts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs     ENABLE ROW LEVEL SECURITY;

-- الأدمن يقرأ كل شيء
CREATE POLICY "admin_all_subscribers" ON public.subscribers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_all_reports" ON public.daily_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_all_defcon" ON public.defcon_alerts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_subscribers_email    ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active   ON public.subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date   ON public.daily_reports(date DESC);
CREATE INDEX IF NOT EXISTS idx_defcon_alerts_region ON public.defcon_alerts(region);
CREATE INDEX IF NOT EXISTS idx_defcon_alerts_date   ON public.defcon_alerts(created_at DESC);

-- 7. تحقق
SELECT 
  (SELECT COUNT(*) FROM public.subscribers)   AS subscribers,
  (SELECT COUNT(*) FROM public.daily_reports) AS reports,
  (SELECT COUNT(*) FROM public.defcon_alerts) AS alerts;
