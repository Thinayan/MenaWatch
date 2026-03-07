-- ╔════════════════════════════════════════════════════════════════╗
-- ║         MENA Watch — المرحلة 2: صفحة "من نحن"               ║
-- ║         جدول أعضاء الفريق                                   ║
-- ╚════════════════════════════════════════════════════════════════╝

-- ══════════════════════════════════════════
-- 1. team_members — أعضاء الفريق
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS team_members (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar       TEXT NOT NULL,
  name_en       TEXT,
  title_ar      TEXT NOT NULL,
  title_en      TEXT,
  bio_ar        TEXT,
  bio_en        TEXT,
  photo_url     TEXT,
  linkedin      TEXT,
  twitter       TEXT,
  display_order INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER set_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ══════════════════════════════════════════
-- 2. RLS Policies
-- ══════════════════════════════════════════
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- الكل يقرأ الأعضاء النشطين
CREATE POLICY "team_members_public_read"
  ON team_members FOR SELECT
  USING (is_active = true);

-- الأدمن يتحكم بالكل
CREATE POLICY "team_members_admin_all"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ══════════════════════════════════════════
-- 3. بيانات أولية (اختيارية)
-- ══════════════════════════════════════════
-- INSERT INTO team_members (name_ar, name_en, title_ar, title_en, bio_ar, display_order) VALUES
-- ('فريق MENA Watch', 'MENA Watch Team', 'فريق التحليل', 'Analysis Team', 'فريق متخصص في تحليل شؤون الشرق الأوسط وشمال أفريقيا', 1);

-- ══════════════════════════════════════════
-- 4. platform_config entries (اختيارية)
-- ══════════════════════════════════════════
-- يمكن تخزين بيانات "من نحن" في platform_config إذا كان الجدول موجوداً:
-- INSERT INTO platform_config (key, value) VALUES
-- ('about_methodology', '{"ar": "منهجية تحليلية متعددة المصادر...", "en": "Multi-source analytical methodology..."}'),
-- ('about_vision', '{"ar": "رؤيتنا...", "en": "Our vision..."}'),
-- ('about_contact', '{"email": "info@mena.watch", "phone": "+966..."}')
-- ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
