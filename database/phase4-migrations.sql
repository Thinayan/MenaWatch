-- ╔════════════════════════════════════════════════════════════════╗
-- ║         MENA Watch — المرحلة 4: الأرشيف التاريخي             ║
-- ╚════════════════════════════════════════════════════════════════╝

-- ══════════════════════════════════════════
-- 1. archive_events — أحداث تاريخية مع تحليل
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS archive_events (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar        TEXT NOT NULL,
  title_en        TEXT,
  description_ar  TEXT,
  description_en  TEXT,
  country_code    TEXT NOT NULL,
  event_type      TEXT NOT NULL CHECK (event_type IN ('political','economic','security','health','energy','tech','social','diplomatic')),
  occurred_at     DATE NOT NULL,
  impact_score    INT CHECK (impact_score BETWEEN 1 AND 10),
  why_it_happened TEXT,    -- لماذا حدث — التحليل السياقي
  what_it_means   TEXT,    -- ماذا يعني لك — الدلالة الاستراتيجية
  source_urls     TEXT[],
  tags            TEXT[],
  fts             tsvector GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(title_ar,'') || ' ' || coalesce(title_en,'') || ' ' || coalesce(description_ar,'') || ' ' || coalesce(description_en,''))
  ) STORED,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_archive_events_country ON archive_events(country_code);
CREATE INDEX IF NOT EXISTS idx_archive_events_type ON archive_events(event_type);
CREATE INDEX IF NOT EXISTS idx_archive_events_date ON archive_events(occurred_at);
CREATE INDEX IF NOT EXISTS idx_archive_events_impact ON archive_events(impact_score);
CREATE INDEX IF NOT EXISTS idx_archive_events_fts ON archive_events USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_archive_events_tags ON archive_events USING GIN(tags);

CREATE TRIGGER set_archive_events_updated_at
  BEFORE UPDATE ON archive_events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ══════════════════════════════════════════
-- 2. archive_indicators — مؤشرات زمنية
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS archive_indicators (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code    TEXT NOT NULL,
  indicator_key   TEXT NOT NULL CHECK (indicator_key IN ('gdp','inflation','oil_price','unemployment','fdi','population','debt_gdp','reserves','trade_balance','cpi')),
  indicator_name_ar TEXT,
  indicator_name_en TEXT,
  value           DECIMAL NOT NULL,
  unit            TEXT DEFAULT '%',
  period          DATE NOT NULL,
  source          TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (country_code, indicator_key, period)
);

CREATE INDEX IF NOT EXISTS idx_archive_indicators_country ON archive_indicators(country_code);
CREATE INDEX IF NOT EXISTS idx_archive_indicators_key ON archive_indicators(indicator_key);
CREATE INDEX IF NOT EXISTS idx_archive_indicators_period ON archive_indicators(period);

-- ══════════════════════════════════════════
-- 3. RLS Policies
-- ══════════════════════════════════════════
ALTER TABLE archive_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_indicators ENABLE ROW LEVEL SECURITY;

-- الكل يقرأ الأحداث
CREATE POLICY "archive_events_public_read"
  ON archive_events FOR SELECT
  USING (true);

-- الأدمن يتحكم
CREATE POLICY "archive_events_admin_all"
  ON archive_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- الكل يقرأ المؤشرات
CREATE POLICY "archive_indicators_public_read"
  ON archive_indicators FOR SELECT
  USING (true);

-- الأدمن يتحكم
CREATE POLICY "archive_indicators_admin_all"
  ON archive_indicators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ══════════════════════════════════════════
-- 4. بيانات تجريبية (اختيارية)
-- ══════════════════════════════════════════
INSERT INTO archive_events (title_ar, title_en, country_code, event_type, occurred_at, impact_score, why_it_happened, what_it_means, description_ar, tags) VALUES
('إطلاق رؤية 2030', 'Vision 2030 Launch', 'SA', 'economic', '2016-04-25', 10, 'انخفاض أسعار النفط دفع المملكة لتنويع الاقتصاد وتقليل الاعتماد على النفط', 'تحول جذري في الاقتصاد السعودي يفتح فرص استثمارية ضخمة في قطاعات الترفيه والسياحة والتقنية', 'أعلن ولي العهد الأمير محمد بن سلمان عن رؤية المملكة 2030 لتنويع الاقتصاد', ARRAY['رؤية_2030','تنويع','اقتصاد']),
('اتفاقيات أبراهام', 'Abraham Accords', 'AE', 'diplomatic', '2020-09-15', 9, 'تقاطع المصالح الاستراتيجية بين الإمارات وإسرائيل في مواجهة إيران وتعزيز العلاقات الاقتصادية', 'تغيير جذري في خريطة التحالفات الإقليمية وفتح أسواق جديدة للتبادل التجاري', 'وقّعت الإمارات اتفاقية سلام تاريخية مع إسرائيل', ARRAY['سلام','تطبيع','دبلوماسية']),
('طرح أرامكو', 'Aramco IPO', 'SA', 'economic', '2019-12-11', 9, 'تمويل مشاريع رؤية 2030 وتحويل أرامكو إلى شركة عالمية شفافة', 'أكبر طرح في التاريخ يعكس ثقة المستثمرين ويوفر سيولة ضخمة للتحول الاقتصادي', 'أكبر طرح عام أولي في التاريخ بقيمة $25.6B', ARRAY['أرامكو','بورصة','طرح_عام']),
('أزمة النفط 2020', 'Oil Price War 2020', 'SA', 'energy', '2020-03-08', 8, 'خلاف بين السعودية وروسيا على مستويات الإنتاج مع انهيار الطلب بسبب كوفيد-19', 'هشاشة الاعتماد على النفط وأهمية صناديق الثروة السيادية كمخزن احتياطي', 'حرب أسعار نفط بين السعودية وروسيا أدت لانهيار الأسعار', ARRAY['نفط','أوبك','أسعار']),
('إكسبو 2020 دبي', 'Expo 2020 Dubai', 'AE', 'economic', '2021-10-01', 7, 'استراتيجية الإمارات في تعزيز السياحة والابتكار وجذب الاستثمارات العالمية', 'نموذج ناجح لاستضافة الأحداث الكبرى وتأثيرها على البنية التحتية والسياحة', 'أول إكسبو في منطقة الشرق الأوسط', ARRAY['إكسبو','دبي','سياحة']),
('كأس العالم 2022', 'FIFA World Cup 2022', 'QA', 'social', '2022-11-20', 8, 'استثمار قطر الاستراتيجي في الرياضة لتعزيز مكانتها على الخريطة العالمية', 'إثبات قدرة دول الخليج على استضافة أكبر الأحداث العالمية وتأثيرها الاقتصادي طويل المدى', 'أول كأس عالم في الشرق الأوسط', ARRAY['كأس_العالم','رياضة','قطر']),
('الحرب في اليمن', 'Yemen Conflict', 'YE', 'security', '2015-03-26', 10, 'توسع الحوثيين وسيطرتهم على صنعاء دفع التحالف بقيادة السعودية للتدخل', 'أزمة إنسانية كبرى وتأثير مباشر على أمن الملاحة في البحر الأحمر ومضيق باب المندب', 'بدء التدخل العسكري للتحالف بقيادة السعودية', ARRAY['يمن','حرب','أمن']),
('الربيع العربي في مصر', 'Egyptian Revolution', 'EG', 'political', '2011-01-25', 10, 'تراكم الاستبداد والفساد والبطالة أدى لانفجار شعبي واسع', 'تحول جذري في المشهد السياسي العربي وبداية حقبة جديدة من عدم الاستقرار', 'ثورة 25 يناير وسقوط نظام مبارك', ARRAY['ثورة','مصر','تحول'])
ON CONFLICT DO NOTHING;

-- مؤشرات تجريبية
INSERT INTO archive_indicators (country_code, indicator_key, indicator_name_ar, indicator_name_en, value, unit, period, source) VALUES
('SA', 'gdp', 'الناتج المحلي', 'GDP', 1069, 'B$', '2023-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي', 'GDP', 1108, 'B$', '2024-01-01', 'IMF'),
('SA', 'gdp', 'الناتج المحلي', 'GDP', 1150, 'B$', '2025-01-01', 'IMF Est.'),
('SA', 'inflation', 'التضخم', 'Inflation', 2.3, '%', '2023-01-01', 'SAMA'),
('SA', 'inflation', 'التضخم', 'Inflation', 1.6, '%', '2024-01-01', 'SAMA'),
('SA', 'inflation', 'التضخم', 'Inflation', 2.0, '%', '2025-01-01', 'SAMA'),
('SA', 'unemployment', 'البطالة', 'Unemployment', 11.1, '%', '2023-01-01', 'GASTAT'),
('SA', 'unemployment', 'البطالة', 'Unemployment', 7.7, '%', '2024-01-01', 'GASTAT'),
('SA', 'unemployment', 'البطالة', 'Unemployment', 7.0, '%', '2025-01-01', 'GASTAT'),
('AE', 'gdp', 'الناتج المحلي', 'GDP', 509, 'B$', '2023-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي', 'GDP', 530, 'B$', '2024-01-01', 'IMF'),
('AE', 'gdp', 'الناتج المحلي', 'GDP', 555, 'B$', '2025-01-01', 'IMF Est.'),
('AE', 'inflation', 'التضخم', 'Inflation', 1.6, '%', '2023-01-01', 'CBUAE'),
('AE', 'inflation', 'التضخم', 'Inflation', 2.1, '%', '2024-01-01', 'CBUAE'),
('QA', 'gdp', 'الناتج المحلي', 'GDP', 235, 'B$', '2023-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي', 'GDP', 245, 'B$', '2024-01-01', 'IMF'),
('EG', 'gdp', 'الناتج المحلي', 'GDP', 395, 'B$', '2023-01-01', 'World Bank'),
('EG', 'inflation', 'التضخم', 'Inflation', 33.7, '%', '2023-01-01', 'CBE'),
('EG', 'inflation', 'التضخم', 'Inflation', 26.5, '%', '2024-01-01', 'CBE')
ON CONFLICT (country_code, indicator_key, period) DO NOTHING;
