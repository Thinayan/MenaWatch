-- ══════════════════════════════════════════════════════
-- MENA.Watch — ملف SQL شامل لجميع التغييرات الجديدة
-- شغّل هذا الملف في Supabase SQL Editor مرة واحدة
-- ══════════════════════════════════════════════════════

-- ━━━ 1. أعمدة عداد AI في profiles ━━━
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ai_uses_today INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_ai_reset DATE DEFAULT CURRENT_DATE;

-- ━━━ 2. أعمدة الإشعارات والمناطق في profiles ━━━
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS alert_regions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS daily_email BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS defcon_alerts BOOLEAN DEFAULT true;

-- ━━━ 3. سياسات RLS للقراءة ━━━
-- تنبيهات DEFCON
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_read_defcon'
  ) THEN
    CREATE POLICY "authenticated_read_defcon" ON public.defcon_alerts
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- التقارير اليومية
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_read_reports'
  ) THEN
    CREATE POLICY "authenticated_read_reports" ON public.daily_reports
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- ━━━ 4. جدول إعدادات المنصة (التسعير وغيره) ━━━
CREATE TABLE IF NOT EXISTS public.platform_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;

-- سياسة قراءة للأدمن
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'admin_read_config'
  ) THEN
    CREATE POLICY "admin_read_config" ON public.platform_config
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- سياسة كتابة للأدمن
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'admin_write_config'
  ) THEN
    CREATE POLICY "admin_write_config" ON public.platform_config
      FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- بيانات افتراضية للتسعير
INSERT INTO platform_config (key, value) VALUES ('pricing', '{
  "free": {"price": 0, "ai_limit": 3, "features": ["الخريطة الأساسية", "3 تحليلات AI/يوم", "14 تبويب مجاني"]},
  "pro": {"price": 49, "ai_limit": -1, "features": ["تحليلات AI غير محدودة", "غرفة عمليات كاملة", "تنبيهات DEFCON فورية", "تقارير PDF"]},
  "enterprise": {"price": 299, "ai_limit": -1, "features": ["API بيانات كاملة", "5 مستخدمين", "دعم فني 24/7", "تقارير مخصصة"]}
}') ON CONFLICT (key) DO NOTHING;

-- ══════════════════════════════════════════════════════
-- ✅ انتهى — جميع الجداول والأعمدة والسياسات جاهزة
-- ══════════════════════════════════════════════════════
