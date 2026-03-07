-- ============================================================
-- MENA Watch — إنشاء جميع الجداول المطلوبة
-- شغّل هذا الملف في: Supabase > SQL Editor > New Query
-- ============================================================

-- ══════════════════════════════════════════════════════════════
-- 1. تحديث جدول profiles (إضافة أعمدة ناقصة)
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alert_regions TEXT[];

-- ══════════════════════════════════════════════════════════════
-- 2. جدول المشتركين (subscribers)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.subscribers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email           TEXT UNIQUE NOT NULL,
  full_name       TEXT,
  source          TEXT DEFAULT 'website',
  alert_regions   TEXT[],
  alert_sectors   TEXT[],
  is_active       BOOLEAN DEFAULT TRUE,
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  resubscribed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ
);

-- ══════════════════════════════════════════════════════════════
-- 3. جدول التقارير اليومية (daily_reports)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.daily_reports (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date            DATE UNIQUE NOT NULL,
  content         TEXT NOT NULL,
  sent_to         INTEGER DEFAULT 0,
  success_count   INTEGER DEFAULT 0,
  market_snapshot JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- 4. جدول تنبيهات DEFCON (defcon_alerts)
-- ══════════════════════════════════════════════════════════════
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

-- ══════════════════════════════════════════════════════════════
-- 5. جدول سجل الإيميلات (email_logs)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.email_logs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type            TEXT NOT NULL,
  recipient       TEXT NOT NULL,
  subject         TEXT,
  status          TEXT DEFAULT 'sent',
  resend_id       TEXT,
  ref_id          UUID,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- 6. تفعيل Row Level Security
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.subscribers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defcon_alerts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs     ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════════════════════
-- 7. سياسات الأمان (RLS Policies)
-- ══════════════════════════════════════════════════════════════

-- الأدمن يقدر يقرأ ويعدل كل المشتركين
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_all_subscribers') THEN
    CREATE POLICY "admin_all_subscribers" ON public.subscribers
      FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- الأدمن يقدر يقرأ ويعدل كل التقارير
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_all_reports') THEN
    CREATE POLICY "admin_all_reports" ON public.daily_reports
      FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- الأدمن يقدر يقرأ ويعدل كل تنبيهات DEFCON
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_all_defcon') THEN
    CREATE POLICY "admin_all_defcon" ON public.defcon_alerts
      FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- السيرفر (service_role) يقدر يضيف بيانات — مهم للـ API routes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_insert_subscribers') THEN
    CREATE POLICY "service_insert_subscribers" ON public.subscribers
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_insert_reports') THEN
    CREATE POLICY "service_insert_reports" ON public.daily_reports
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_insert_defcon') THEN
    CREATE POLICY "service_insert_defcon" ON public.defcon_alerts
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_insert_email_logs') THEN
    CREATE POLICY "service_insert_email_logs" ON public.email_logs
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- ══════════════════════════════════════════════════════════════
-- 8. الفهارس (Indexes)
-- ══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_subscribers_email     ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active    ON public.subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date    ON public.daily_reports(date DESC);
CREATE INDEX IF NOT EXISTS idx_defcon_alerts_region  ON public.defcon_alerts(region);
CREATE INDEX IF NOT EXISTS idx_defcon_alerts_date    ON public.defcon_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_type       ON public.email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_date       ON public.email_logs(created_at DESC);

-- ══════════════════════════════════════════════════════════════
-- 9. ترقية المستخدم الحالي إلى أدمن
-- ══════════════════════════════════════════════════════════════
UPDATE public.profiles SET role = 'admin' WHERE email = 'user@mena.watch';

-- ══════════════════════════════════════════════════════════════
-- 10. تحقق من النتيجة
-- ══════════════════════════════════════════════════════════════
SELECT 'profiles' as table_name, COUNT(*) as rows FROM public.profiles
UNION ALL
SELECT 'subscribers', COUNT(*) FROM public.subscribers
UNION ALL
SELECT 'daily_reports', COUNT(*) FROM public.daily_reports
UNION ALL
SELECT 'defcon_alerts', COUNT(*) FROM public.defcon_alerts
UNION ALL
SELECT 'email_logs', COUNT(*) FROM public.email_logs;
