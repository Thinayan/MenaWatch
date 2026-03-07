-- Phase 4: Platform configuration table for pricing etc.
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.platform_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write config
CREATE POLICY "admin_read_config" ON public.platform_config
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_write_config" ON public.platform_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Default pricing data
INSERT INTO platform_config (key, value) VALUES ('pricing', '{
  "free": {"price": 0, "ai_limit": 3, "features": ["الخريطة الأساسية", "3 تحليلات AI/يوم", "14 تبويب مجاني"]},
  "pro": {"price": 49, "ai_limit": -1, "features": ["تحليلات AI غير محدودة", "غرفة عمليات كاملة", "تنبيهات DEFCON فورية", "تقارير PDF"]},
  "enterprise": {"price": 299, "ai_limit": -1, "features": ["API بيانات كاملة", "5 مستخدمين", "دعم فني 24/7", "تقارير مخصصة"]}
}') ON CONFLICT (key) DO NOTHING;
