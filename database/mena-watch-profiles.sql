-- ============================================================
-- MENA Watch — جدول profiles
-- الخطوة: ١ — ربط الأدوار بالمستخدمين الحقيقيين
-- تشغيله في: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. إنشاء جدول profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'user'
                   CHECK (role IN ('admin', 'expert', 'user')),
  avatar_url  TEXT,
  bio         TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "admin_read_all_profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p2
      WHERE p2.id = auth.uid() AND p2.role = 'admin'
    )
  );

CREATE POLICY "admin_update_all_profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p2
      WHERE p2.id = auth.uid() AND p2.role = 'admin'
    )
  );

-- 3. Function: إنشاء profile تلقائي عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 4. Trigger عند كل تسجيل جديد
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6. ربط المستخدمين الحاليين الـ 3
-- يحدد الدور تلقائياً من الإيميل، عدّل يدوياً بعد التشغيل إذا احتجت
INSERT INTO public.profiles (id, email, role)
SELECT 
  id,
  email,
  CASE 
    WHEN email ILIKE '%admin%' THEN 'admin'
    WHEN email ILIKE '%expert%' THEN 'expert'
    ELSE 'user'
  END
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 7. تعيين الدور يدوياً (عدّل الإيميل حسب ما أنشأته)
-- UPDATE public.profiles SET role = 'admin'  WHERE email = 'admin@mena.watch';
-- UPDATE public.profiles SET role = 'expert' WHERE email = 'expert@mena.watch';
-- UPDATE public.profiles SET role = 'user'   WHERE email = 'user@mena.watch';

-- 8. تحقق من النتيجة
SELECT id, email, role, is_active, created_at 
FROM public.profiles 
ORDER BY created_at;
