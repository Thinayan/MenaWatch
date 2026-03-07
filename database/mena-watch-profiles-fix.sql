-- ============================================================
-- MENA Watch — profiles fix (حل تعارض الـ policies)
-- ============================================================

-- 1. حذف الـ policies القديمة أولاً
DROP POLICY IF EXISTS "users_read_own_profile"    ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile"  ON public.profiles;
DROP POLICY IF EXISTS "admin_read_all_profiles"   ON public.profiles;
DROP POLICY IF EXISTS "admin_update_all_profiles" ON public.profiles;

-- 2. إعادة إنشائها
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

-- 3. ربط المستخدمين الحاليين (إذا لم يُربطوا)
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

-- 4. تحقق من النتيجة
SELECT id, email, role, is_active, created_at 
FROM public.profiles 
ORDER BY created_at;
