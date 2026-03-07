-- ============================================================
-- Phase 5: Intensive Archive Data (2015–2026)
-- ~100 historical events + economic indicators for 7 countries
-- Run via Supabase SQL Editor
-- ============================================================

-- ─── HISTORICAL EVENTS ───────────────────────────────────────

INSERT INTO archive_events (title_ar, title_en, description_ar, description_en, country_code, event_type, occurred_at, impact_score, why_it_happened, what_it_means, source_urls, tags)
VALUES

-- ══════════════════════════════════════════════
-- 2015
-- ══════════════════════════════════════════════
('إطلاق رؤية السعودية 2030 — الإعلان التمهيدي', 'Saudi Vision 2030 Preliminary Announcement', 'بدء التخطيط لتحول اقتصادي شامل بعيداً عن الاعتماد على النفط', 'Planning begins for comprehensive economic transformation away from oil dependency', 'SA', 'economic', '2015-04-25', 9, 'انخفاض أسعار النفط كشف هشاشة الاعتماد الأحادي على البترول، مما دفع ولي العهد لإطلاق رؤية تنويع اقتصادي شاملة', 'بداية أكبر تحول اقتصادي في تاريخ المنطقة — يؤثر على كل قطاع من التوظيف للاستثمار للتعليم', ARRAY['https://vision2030.gov.sa'], ARRAY['رؤية_2030', 'تنويع_اقتصادي', 'إصلاحات']),

('عاصفة الحزم — التدخل العسكري السعودي في اليمن', 'Operation Decisive Storm — Saudi Military Intervention in Yemen', 'تشكيل تحالف عربي بقيادة السعودية للتدخل عسكرياً في اليمن', 'Formation of Saudi-led Arab coalition for military intervention in Yemen', 'SA', 'security', '2015-03-26', 9, 'سيطرة الحوثيين على صنعاء وتهديد الحدود الجنوبية السعودية والتوازن الإقليمي', 'أكبر عملية عسكرية سعودية تاريخياً — أعادت تشكيل التوازن الأمني في شبه الجزيرة العربية', ARRAY['https://www.aljazeera.net'], ARRAY['عاصفة_الحزم', 'اليمن', 'أمن_إقليمي']),

('انهيار أسعار النفط تحت 30 دولار', 'Oil Price Collapse Below $30', 'تراجع أسعار النفط من 110$ إلى أقل من 30$ للبرميل', 'Oil prices plummet from $110 to below $30 per barrel', 'SA', 'energy', '2015-12-15', 10, 'زيادة الإنتاج الأمريكي من النفط الصخري + رفض أوبك خفض الإنتاج + تباطؤ الاقتصاد الصيني', 'أزمة مالية حادة لدول الخليج — عجز ميزانيات + تسريع خطط التنويع الاقتصادي', ARRAY['https://www.opec.org'], ARRAY['نفط', 'أسعار_الطاقة', 'أوبك']),

('الاتفاق النووي الإيراني (JCPOA)', 'Iran Nuclear Deal (JCPOA)', 'توقيع الاتفاق النووي بين إيران والقوى الكبرى في فيينا', 'Signing of the nuclear agreement between Iran and world powers in Vienna', 'IR', 'diplomatic', '2015-07-14', 9, 'سنوات من المفاوضات لاحتواء البرنامج النووي الإيراني مقابل رفع العقوبات', 'تحول جيوسياسي كبير — رفع العقوبات يعني عودة إيران للأسواق العالمية وتغير موازين القوى الإقليمية', ARRAY['https://www.iaea.org'], ARRAY['إيران', 'نووي', 'JCPOA', 'عقوبات']),

('أزمة اللاجئين السوريين تبلغ ذروتها', 'Syrian Refugee Crisis Peaks', 'تجاوز عدد اللاجئين السوريين 4 ملايين شخص وأزمة إنسانية كبرى', 'Syrian refugees exceed 4 million amid major humanitarian crisis', 'SY', 'social', '2015-09-01', 8, 'استمرار الحرب الأهلية السورية وتدمير البنية التحتية وانعدام الأمان', 'ضغط اقتصادي واجتماعي على الدول المستضيفة (الأردن، لبنان، تركيا) وتأثير ديموغرافي طويل المدى', ARRAY['https://www.unhcr.org'], ARRAY['سوريا', 'لاجئين', 'أزمة_إنسانية']),

-- ══════════════════════════════════════════════
-- 2016
-- ══════════════════════════════════════════════
('الإعلان الرسمي عن رؤية السعودية 2030', 'Official Launch of Saudi Vision 2030', 'ولي العهد الأمير محمد بن سلمان يعلن رؤية السعودية 2030 وبرنامج التحول الوطني', 'Crown Prince Mohammed bin Salman announces Vision 2030 and National Transformation Program', 'SA', 'economic', '2016-04-25', 10, 'ضرورة التنويع الاقتصادي بعد صدمة أسعار النفط والحاجة لاقتصاد مستدام', 'خارطة طريق لأكبر تحول اقتصادي واجتماعي في تاريخ الخليج — 96 هدفاً استراتيجياً', ARRAY['https://vision2030.gov.sa'], ARRAY['رؤية_2030', 'محمد_بن_سلمان', 'تحول_وطني']),

('اتفاقية أوبك+ لخفض الإنتاج', 'OPEC+ Production Cut Agreement', 'اتفاق تاريخي بين أوبك وروسيا لخفض الإنتاج النفطي لدعم الأسعار', 'Historic agreement between OPEC and Russia to cut oil production to support prices', 'SA', 'energy', '2016-11-30', 8, 'استمرار انخفاض أسعار النفط وتأثيره المدمر على ميزانيات الدول المنتجة', 'ولادة تحالف أوبك+ الذي أصبح المحرك الرئيسي لأسواق الطاقة العالمية', ARRAY['https://www.opec.org'], ARRAY['أوبك_بلس', 'نفط', 'خفض_إنتاج']),

('محاولة الانقلاب في تركيا', 'Failed Coup Attempt in Turkey', 'محاولة انقلاب عسكري فاشلة ضد حكومة أردوغان', 'Failed military coup attempt against Erdogan government', 'TR', 'political', '2016-07-15', 8, 'توتر بين الجيش التركي والحزب الحاكم + تأثير حركة غولن المزعوم', 'تحول تركيا نحو نظام رئاسي أقوى وحملة تطهير واسعة — أثر على العلاقات التركية الخليجية', ARRAY['https://www.bbc.com/arabic'], ARRAY['تركيا', 'انقلاب', 'أردوغان']),

('فرض ضريبة القيمة المضافة في الخليج', 'GCC VAT Framework Agreement', 'دول مجلس التعاون توقع اتفاقية إطارية لفرض ضريبة القيمة المضافة 5%', 'GCC states sign framework agreement for 5% Value Added Tax', 'SA', 'economic', '2016-06-01', 7, 'انخفاض إيرادات النفط وضرورة تنويع مصادر الدخل الحكومي', 'أول ضريبة استهلاكية في تاريخ الخليج — تغيير جذري في العلاقة بين المواطن والدولة', ARRAY['https://www.gcc-sg.org'], ARRAY['ضريبة', 'VAT', 'مجلس_التعاون']),

-- ══════════════════════════════════════════════
-- 2017
-- ══════════════════════════════════════════════
('الأزمة الدبلوماسية الخليجية (حصار قطر)', 'Gulf Diplomatic Crisis (Qatar Blockade)', 'السعودية والإمارات والبحرين ومصر تقطع العلاقات مع قطر', 'Saudi Arabia, UAE, Bahrain and Egypt sever relations with Qatar', 'QA', 'diplomatic', '2017-06-05', 9, 'اتهام قطر بدعم الإرهاب والتقارب مع إيران + خلافات سياسية عميقة', 'أكبر أزمة في تاريخ مجلس التعاون — أعادت رسم التحالفات الإقليمية وأثرت على حركة التجارة والطيران', ARRAY['https://www.aljazeera.net'], ARRAY['أزمة_خليجية', 'قطر', 'حصار']),

('معركة الموصل — تحرير المدينة من داعش', 'Battle of Mosul — Liberation from ISIS', 'القوات العراقية تحرر مدينة الموصل بالكامل من تنظيم داعش', 'Iraqi forces fully liberate Mosul from ISIS', 'IQ', 'security', '2017-07-10', 9, 'حملة عسكرية دولية استمرت 9 أشهر لاستعادة ثاني أكبر مدينة عراقية', 'نقطة تحول في الحرب ضد داعش — بداية إعادة إعمار ضخمة في العراق', ARRAY['https://www.bbc.com/arabic'], ARRAY['داعش', 'العراق', 'موصل', 'تحرير']),

('السماح للمرأة السعودية بقيادة السيارة', 'Saudi Women Allowed to Drive', 'مرسوم ملكي تاريخي يسمح للمرأة بقيادة السيارة لأول مرة', 'Historic royal decree allowing women to drive for the first time', 'SA', 'social', '2017-09-26', 8, 'إصلاحات اجتماعية ضمن رؤية 2030 وضغوط دولية وتطور المجتمع السعودي', 'تحول اجتماعي تاريخي — فتح قطاعات اقتصادية جديدة وزيادة مشاركة المرأة في سوق العمل', ARRAY['https://vision2030.gov.sa'], ARRAY['إصلاحات', 'المرأة', 'قيادة_السيارة']),

('إطلاق مشروع نيوم', 'Launch of NEOM Mega-Project', 'الإعلان عن مشروع نيوم بقيمة 500 مليار دولار في شمال غرب السعودية', 'Announcement of $500B NEOM project in northwest Saudi Arabia', 'SA', 'economic', '2017-10-24', 9, 'تجسيد رؤية 2030 في مدينة مستقبلية تعتمد على التقنية والطاقة المتجددة', 'أكبر مشروع تنموي في التاريخ الحديث — يهدف لجذب استثمارات وسياح وكفاءات عالمية', ARRAY['https://www.neom.com'], ARRAY['نيوم', 'مشاريع_كبرى', 'رؤية_2030']),

('ترامب ينسحب من الاتفاق النووي الإيراني', 'Trump Withdraws from Iran Nuclear Deal (Announced)', 'تصاعد التوتر مع إعلان ترامب نيته الانسحاب من JCPOA', 'Rising tensions as Trump signals intent to withdraw from JCPOA', 'IR', 'diplomatic', '2017-10-13', 7, 'معارضة إدارة ترامب للاتفاق ودعم حلفاء أمريكا الإقليميين (السعودية وإسرائيل)', 'بداية تصعيد مع إيران أثر على أمن الخليج وأسعار النفط والملاحة البحرية', ARRAY['https://www.whitehouse.gov'], ARRAY['ترامب', 'إيران', 'JCPOA']),

-- ══════════════════════════════════════════════
-- 2018
-- ══════════════════════════════════════════════
('الانسحاب الأمريكي الرسمي من الاتفاق النووي', 'US Official Withdrawal from Iran Nuclear Deal', 'ترامب يعلن الانسحاب رسمياً من JCPOA وإعادة فرض العقوبات', 'Trump officially announces withdrawal from JCPOA and reimposition of sanctions', 'IR', 'diplomatic', '2018-05-08', 9, 'رؤية أمريكية بأن الاتفاق لا يكفي لاحتواء التهديد الإيراني', 'عودة العقوبات = ارتفاع أسعار النفط + تصعيد إقليمي + انكماش الاقتصاد الإيراني', ARRAY['https://www.state.gov'], ARRAY['عقوبات', 'إيران', 'نفط']),

('إدراج أرامكو في تاسي — الإعلان الأولي', 'Saudi Aramco IPO — Initial Announcement', 'الإعلان عن خطة طرح أرامكو للاكتتاب العام كجزء من رؤية 2030', 'Announcement of Aramco IPO plan as part of Vision 2030', 'SA', 'economic', '2018-01-01', 8, 'تمويل مشاريع رؤية 2030 عبر تسييل جزء من أكبر شركة نفط في العالم', 'أكبر اكتتاب في التاريخ — جذب أنظار المستثمرين العالميين للسوق السعودي', ARRAY['https://www.aramco.com'], ARRAY['أرامكو', 'اكتتاب', 'تاسي']),

('افتتاح السينما في السعودية لأول مرة', 'Cinemas Open in Saudi Arabia for First Time', 'افتتاح أول دار سينما في الرياض بعد حظر دام 35 عاماً', 'First cinema opens in Riyadh after 35-year ban', 'SA', 'social', '2018-04-18', 6, 'إصلاحات الترفيه ضمن رؤية 2030 وهيئة الترفيه الجديدة', 'تحول ثقافي كبير — سوق ترفيه بمليارات الدولارات وتحسين جودة الحياة', ARRAY['https://gea.gov.sa'], ARRAY['سينما', 'ترفيه', 'إصلاحات']),

('اغتيال جمال خاشقجي', 'Assassination of Jamal Khashoggi', 'مقتل الصحفي جمال خاشقجي في القنصلية السعودية بإسطنبول', 'Journalist Jamal Khashoggi killed in Saudi consulate in Istanbul', 'SA', 'political', '2018-10-02', 9, 'توتر بين الصحفي والحكومة السعودية وتقارير عن أوامر بتصفيته', 'أزمة دبلوماسية عالمية — ضغط على العلاقات السعودية الغربية وتأثير على سمعة المملكة', ARRAY['https://www.bbc.com/arabic'], ARRAY['خاشقجي', 'أزمة_دبلوماسية']),

-- ══════════════════════════════════════════════
-- 2019
-- ══════════════════════════════════════════════
('هجمات أرامكو (بقيق وخريص)', 'Aramco Attacks (Abqaiq and Khurais)', 'هجمات بطائرات مسيرة على منشآت أرامكو تعطل 50% من إنتاج النفط السعودي', 'Drone attacks on Aramco facilities disrupt 50% of Saudi oil production', 'SA', 'security', '2019-09-14', 10, 'تصعيد إيراني-حوثي رداً على العقوبات الأمريكية والحرب في اليمن', 'أكبر اضطراب في إمدادات النفط منذ حرب الخليج — كشف هشاشة البنية النفطية العالمية', ARRAY['https://www.aramco.com'], ARRAY['أرامكو', 'هجمات', 'أمن_طاقة']),

('اكتتاب أرامكو التاريخي في تداول', 'Historic Saudi Aramco IPO on Tadawul', 'طرح 1.5% من أسهم أرامكو بأكبر اكتتاب عام في التاريخ — قيمة 1.7 تريليون دولار', 'Aramco lists 1.5% of shares in world''s largest IPO — valued at $1.7 trillion', 'SA', 'economic', '2019-12-11', 10, 'تمويل مشاريع رؤية 2030 وإثبات جاذبية السوق السعودي للمستثمرين العالميين', 'رفع أرامكو لأعلى قيمة سوقية في العالم — دفع تطوير سوق المال السعودي وجذب استثمارات أجنبية', ARRAY['https://www.tadawul.com.sa'], ARRAY['أرامكو', 'اكتتاب', 'سوق_المال']),

('السودان — سقوط البشير', 'Sudan — Fall of Omar al-Bashir', 'الإطاحة بالرئيس عمر البشير بعد احتجاجات شعبية واسعة', 'President Omar al-Bashir ousted after widespread protests', 'SD', 'political', '2019-04-11', 8, 'أزمة اقتصادية خانقة وارتفاع أسعار الخبز وتراكم الفساد', 'بداية مرحلة انتقالية مضطربة — تنافس عسكري مدني أدى لاحقاً لحرب أهلية', ARRAY['https://www.aljazeera.net'], ARRAY['السودان', 'البشير', 'ثورة']),

('إطلاق مشروع البحر الأحمر السياحي', 'Red Sea Tourism Project Launch', 'بدء أعمال البناء في مشروع البحر الأحمر السياحي الفاخر', 'Construction begins on luxury Red Sea tourism project', 'SA', 'economic', '2019-03-01', 7, 'تنويع اقتصادي ضمن رؤية 2030 واستغلال الموقع الجغرافي الفريد', 'أحد أكبر مشاريع السياحة المستدامة عالمياً — 50 فندقاً على 22 جزيرة', ARRAY['https://www.theredsea.sa'], ARRAY['البحر_الأحمر', 'سياحة', 'مشاريع_كبرى']),

-- ══════════════════════════════════════════════
-- 2020
-- ══════════════════════════════════════════════
('جائحة كوفيد-19 تضرب الشرق الأوسط', 'COVID-19 Pandemic Hits Middle East', 'إغلاقات شاملة وتوقف الحج والعمرة وانكماش اقتصادي حاد', 'Full lockdowns, suspension of Hajj/Umrah, and severe economic contraction', 'SA', 'health', '2020-03-15', 10, 'انتشار فيروس كورونا عالمياً من ووهان الصينية', 'أكبر أزمة صحية واقتصادية في التاريخ الحديث — تسريع التحول الرقمي وتغيير نمط الحياة', ARRAY['https://www.who.int'], ARRAY['كوفيد', 'جائحة', 'إغلاق']),

('انفجار مرفأ بيروت', 'Beirut Port Explosion', 'انفجار ضخم في مرفأ بيروت يدمر أحياء كاملة ويقتل أكثر من 200 شخص', 'Massive explosion at Beirut port destroys entire neighborhoods, killing over 200', 'LB', 'security', '2020-08-04', 10, 'تخزين غير آمن لـ 2,750 طن من نيترات الأمونيوم لسنوات بسبب الفساد والإهمال', 'كارثة دمرت اقتصاد لبنان المنهار أصلاً — أزمة ثقة شاملة وهجرة جماعية للكفاءات', ARRAY['https://www.bbc.com/arabic'], ARRAY['بيروت', 'انفجار', 'لبنان']),

('اتفاقيات أبراهام — تطبيع الإمارات وإسرائيل', 'Abraham Accords — UAE-Israel Normalization', 'الإمارات توقع اتفاقية تطبيع تاريخية مع إسرائيل', 'UAE signs historic normalization agreement with Israel', 'AE', 'diplomatic', '2020-09-15', 9, 'تقارب استراتيجي ضد إيران + وعد أمريكي بوقف الضم + مصالح تجارية متبادلة', 'تحول جيوسياسي كبير — فتح أبواب التعاون الاقتصادي والتقني مع إسرائيل', ARRAY['https://www.state.gov'], ARRAY['اتفاقيات_أبراهام', 'تطبيع', 'إسرائيل']),

('حرب أسعار النفط بين السعودية وروسيا', 'Saudi-Russia Oil Price War', 'انهيار محادثات أوبك+ وإغراق السوق بالنفط — أسعار سلبية لأول مرة', 'OPEC+ talks collapse and market flooded — oil prices go negative for first time', 'SA', 'energy', '2020-03-08', 9, 'خلاف سعودي-روسي على حجم تخفيضات الإنتاج وسط انهيار الطلب بسبب كوفيد', 'أسعار النفط السلبية لأول مرة في التاريخ — ضغط هائل على ميزانيات الخليج', ARRAY['https://www.opec.org'], ARRAY['نفط', 'أوبك_بلس', 'حرب_أسعار']),

('رفع ضريبة القيمة المضافة في السعودية إلى 15%', 'Saudi Arabia Triples VAT to 15%', 'رفع ضريبة القيمة المضافة من 5% إلى 15% لمواجهة عجز الميزانية', 'VAT tripled from 5% to 15% to address budget deficit', 'SA', 'economic', '2020-07-01', 7, 'انهيار إيرادات النفط + تكلفة الجائحة + الحاجة لاستقرار مالي', 'أول تجربة ضريبية كبيرة في الخليج — غيرت أنماط الاستهلاك وزادت تكلفة المعيشة', ARRAY['https://www.gazt.gov.sa'], ARRAY['ضريبة', 'VAT', 'ميزانية']),

-- ══════════════════════════════════════════════
-- 2021
-- ══════════════════════════════════════════════
('المصالحة الخليجية (قمة العلا)', 'Gulf Reconciliation (AlUla Summit)', 'إنهاء حصار قطر وعودة العلاقات الدبلوماسية في قمة العلا', 'End of Qatar blockade and restoration of diplomatic ties at AlUla Summit', 'QA', 'diplomatic', '2021-01-05', 8, 'وساطة كويتية وأمريكية + إدراك خطورة الانقسام أمام التهديدات الإقليمية', 'عودة التماسك الخليجي — انفتاح تجاري وإعادة فتح الأجواء والحدود', ARRAY['https://www.gcc-sg.org'], ARRAY['مصالحة', 'قطر', 'العلا']),

('إكسبو 2020 دبي', 'Expo 2020 Dubai Opens', 'افتتاح معرض إكسبو 2020 في دبي (بعد تأجيل سنة بسبب كوفيد)', 'Expo 2020 opens in Dubai (delayed one year due to COVID)', 'AE', 'economic', '2021-10-01', 7, 'استثمار إماراتي ضخم في البنية التحتية والسياحة لتعزيز الاقتصاد بعد الجائحة', 'جذب 24 مليون زائر — عرض قدرات الإمارات اللوجستية والتقنية للعالم', ARRAY['https://www.expo2020dubai.com'], ARRAY['إكسبو', 'دبي', 'سياحة']),

('السعودية تعلن هدف الحياد الكربوني 2060', 'Saudi Arabia Announces Net-Zero 2060 Target', 'المملكة تعلن هدف الوصول للحياد الكربوني بحلول 2060', 'Kingdom announces net-zero carbon emissions target by 2060', 'SA', 'energy', '2021-10-23', 7, 'ضغط دولي للعمل المناخي + فرص اقتصادية في الطاقة المتجددة والهيدروجين الأخضر', 'تحول استراتيجي لأكبر مصدّر للنفط — استثمارات ضخمة في الطاقة المتجددة والهيدروجين', ARRAY['https://www.sgi.gov.sa'], ARRAY['مناخ', 'حياد_كربوني', 'طاقة_متجددة']),

('أزمة لبنان المالية — انهيار الليرة', 'Lebanon Financial Crisis — Currency Collapse', 'الليرة اللبنانية تفقد 95% من قيمتها وأسوأ أزمة اقتصادية في تاريخ البلاد', 'Lebanese lira loses 95% of its value in worst economic crisis in history', 'LB', 'economic', '2021-06-01', 9, 'عقود من الفساد والمحاصصة الطائفية + انفجار بيروت + جائحة كوفيد', 'انهيار اقتصادي شامل — هجرة جماعية للشباب والكفاءات والطبقة الوسطى', ARRAY['https://www.worldbank.org'], ARRAY['لبنان', 'أزمة_مالية', 'ليرة']),

-- ══════════════════════════════════════════════
-- 2022
-- ══════════════════════════════════════════════
('حرب أوكرانيا — تأثيرها على الشرق الأوسط', 'Ukraine War — Impact on Middle East', 'الغزو الروسي لأوكرانيا يرفع أسعار النفط والغذاء ويغير التوازنات الجيوسياسية', 'Russian invasion of Ukraine drives up oil and food prices, shifts geopolitical balances', 'SA', 'political', '2022-02-24', 10, 'طموحات روسية لاستعادة النفوذ + توسع الناتو شرقاً', 'ارتفاع إيرادات النفط الخليجية + أزمة غذاء في مصر والسودان + فرصة لتموضع دبلوماسي محايد', ARRAY['https://www.bbc.com/arabic'], ARRAY['أوكرانيا', 'روسيا', 'نفط', 'غذاء']),

('كأس العالم 2022 في قطر', 'FIFA World Cup 2022 in Qatar', 'قطر تستضيف أول كأس عالم في الشرق الأوسط والعالم العربي', 'Qatar hosts first World Cup in Middle East and Arab world', 'QA', 'social', '2022-11-20', 8, 'فوز قطر بالاستضافة عام 2010 واستثمار 220 مليار دولار في البنية التحتية', 'إنجاز تاريخي — عرض ثقافة المنطقة للعالم وتعزيز السياحة والبنية التحتية القطرية', ARRAY['https://www.qatar2022.qa'], ARRAY['كأس_العالم', 'قطر', 'رياضة']),

('أسعار النفط تتجاوز 120 دولار', 'Oil Prices Exceed $120', 'أسعار النفط تقفز فوق 120 دولار بسبب حرب أوكرانيا', 'Oil prices jump above $120 due to Ukraine war', 'SA', 'energy', '2022-06-01', 8, 'حرب أوكرانيا + العقوبات على النفط الروسي + محدودية الطاقة الإنتاجية الفائضة', 'طفرة مالية لدول الخليج — فوائض ميزانية + تسريع المشاريع الكبرى', ARRAY['https://www.opec.org'], ARRAY['نفط', 'أسعار', 'أوبك']),

('السعودية تفوز باستضافة إكسبو 2030', 'Saudi Arabia Wins Expo 2030 Bid', 'المملكة تفوز باستضافة معرض إكسبو الدولي 2030 في الرياض', 'Kingdom wins bid to host World Expo 2030 in Riyadh', 'SA', 'diplomatic', '2022-11-29', 7, 'حملة دبلوماسية ضخمة + قوة رؤية 2030 + استثمارات البنية التحتية', 'تأكيد لمكانة السعودية الدولية المتنامية — استثمارات ضخمة في الرياض', ARRAY['https://www.bie-paris.org'], ARRAY['إكسبو_2030', 'الرياض', 'رؤية_2030']),

('إطلاق صندوق الاستثمارات العامة خطة 2025-2030', 'PIF Launches 2025-2030 Strategy', 'صندوق الاستثمارات العامة يعلن استراتيجية جديدة بأصول 2.7 تريليون ريال', 'PIF announces new strategy targeting 2.7 trillion SAR in assets', 'SA', 'economic', '2022-01-24', 8, 'النمو السريع للصندوق وتوسع استثماراته المحلية والدولية', 'أكبر صندوق سيادي في العالم يقود التحول الاقتصادي — محرك رئيسي للنمو', ARRAY['https://www.pif.gov.sa'], ARRAY['PIF', 'صندوق_سيادي', 'استثمار']),

-- ══════════════════════════════════════════════
-- 2023
-- ══════════════════════════════════════════════
('المصالحة السعودية الإيرانية (اتفاق بكين)', 'Saudi-Iran Reconciliation (Beijing Agreement)', 'السعودية وإيران تعيدان العلاقات الدبلوماسية بوساطة صينية', 'Saudi Arabia and Iran restore diplomatic ties with Chinese mediation', 'SA', 'diplomatic', '2023-03-10', 10, 'رغبة سعودية في تهدئة المنطقة + طموح صيني لدور وسيط + مصالح إيرانية اقتصادية', 'تحول جيوسياسي تاريخي — الصين كوسيط بديل + تهدئة التوتر في اليمن والخليج', ARRAY['https://www.fmprc.gov.cn'], ARRAY['سعودية_إيران', 'بكين', 'دبلوماسية']),

('انضمام السعودية والإمارات لمجموعة بريكس', 'Saudi Arabia and UAE Join BRICS', 'دعوة السعودية والإمارات ومصر للانضمام لتكتل بريكس الاقتصادي', 'Saudi Arabia, UAE and Egypt invited to join BRICS economic bloc', 'SA', 'economic', '2023-08-24', 8, 'سعي لتنويع الشراكات بعيداً عن الغرب + صعود النفوذ الصيني والهندي', 'تعدد أقطاب النفوذ — دول الخليج تتموضع كمحور بين الشرق والغرب', ARRAY['https://brics2023.gov.za'], ARRAY['بريكس', 'اقتصاد_عالمي', 'تحالفات']),

('حرب غزة — عملية طوفان الأقصى والرد الإسرائيلي', 'Gaza War — Al-Aqsa Flood Operation and Israeli Response', 'هجوم حماس على إسرائيل في 7 أكتوبر والحرب المدمرة على غزة', 'Hamas attack on Israel on October 7 and devastating war on Gaza', 'PS', 'security', '2023-10-07', 10, 'حصار غزة المستمر + فشل المفاوضات + الإحباط الفلسطيني + التطبيع العربي-الإسرائيلي', 'أكبر تصعيد في الصراع الفلسطيني-الإسرائيلي منذ عقود — أوقف مسار التطبيع وأعاد القضية للواجهة', ARRAY['https://www.aljazeera.net'], ARRAY['غزة', 'فلسطين', 'حرب', '7_أكتوبر']),

('الحرب الأهلية في السودان', 'Sudan Civil War', 'اندلاع حرب بين الجيش السوداني وقوات الدعم السريع', 'War erupts between Sudanese army and Rapid Support Forces', 'SD', 'security', '2023-04-15', 9, 'صراع على السلطة بين البرهان وحميدتي وفشل المرحلة الانتقالية', 'أزمة إنسانية كارثية — ملايين النازحين + تدمير الخرطوم + تهديد استقرار المنطقة', ARRAY['https://www.unhcr.org'], ARRAY['السودان', 'حرب_أهلية', 'نازحين']),

('السعودية تحقق فائض ميزانية قياسي', 'Saudi Arabia Achieves Record Budget Surplus', 'فائض ميزانية بقيمة 102 مليار ريال بفضل ارتفاع أسعار النفط', 'Budget surplus of 102 billion riyals driven by high oil prices', 'SA', 'economic', '2023-01-01', 7, 'أسعار نفط مرتفعة + إصلاحات مالية ناجحة + تنويع الإيرادات', 'قوة مالية تمكّن من تسريع مشاريع رؤية 2030 وزيادة الإنفاق الحكومي', ARRAY['https://www.mof.gov.sa'], ARRAY['ميزانية', 'فائض', 'نفط']),

-- ══════════════════════════════════════════════
-- 2024
-- ══════════════════════════════════════════════
('استمرار حرب غزة وتوسع التصعيد', 'Gaza War Continues and Escalation Expands', 'استمرار الحرب على غزة وتوسعها لتشمل حزب الله والحوثيين', 'Gaza war continues and expands to include Hezbollah and Houthis', 'PS', 'security', '2024-01-01', 10, 'رفض إسرائيل لوقف إطلاق النار + تصعيد حزب الله + هجمات الحوثيين على السفن', 'حرب إقليمية شاملة — تأثير على الملاحة البحرية في البحر الأحمر وأسعار الشحن', ARRAY['https://www.aljazeera.net'], ARRAY['غزة', 'حزب_الله', 'حوثي', 'بحر_أحمر']),

('هجمات الحوثيين في البحر الأحمر', 'Houthi Attacks in the Red Sea', 'هجمات حوثية متكررة على السفن التجارية في البحر الأحمر', 'Repeated Houthi attacks on commercial ships in Red Sea', 'YE', 'security', '2024-01-15', 9, 'تضامن حوثي مع غزة + استعراض قوة + ضعف الردع الدولي', 'تعطيل 40% من التجارة البحرية العالمية — ارتفاع تكاليف الشحن وأقساط التأمين', ARRAY['https://www.bbc.com/arabic'], ARRAY['حوثي', 'بحر_أحمر', 'ملاحة']),

('الاقتصاد السعودي ينمو 4.7% في الناتج غير النفطي', 'Saudi Non-Oil GDP Grows 4.7%', 'نمو القطاع غير النفطي السعودي بنسبة 4.7% — دليل نجاح التنويع', 'Saudi non-oil sector grows 4.7% — evidence of successful diversification', 'SA', 'economic', '2024-03-01', 7, 'نجاح سياسات التنويع الاقتصادي وزيادة الاستثمار الأجنبي والسياحة', 'تأكيد أن رؤية 2030 تحقق نتائج ملموسة — تقليل الاعتماد على النفط', ARRAY['https://www.stats.gov.sa'], ARRAY['ناتج_محلي', 'تنويع', 'رؤية_2030']),

('COP28 في دبي — إعلان التحول عن الوقود الأحفوري', 'COP28 in Dubai — Fossil Fuel Transition Declaration', 'مؤتمر المناخ COP28 ينتهي بإعلان تاريخي للتحول عن الوقود الأحفوري', 'COP28 ends with historic declaration to transition away from fossil fuels', 'AE', 'energy', '2024-01-01', 8, 'ضغط دولي متصاعد + كوارث مناخية + قيادة إماراتية للمؤتمر', 'أول اعتراف عالمي بضرورة التحول — يؤثر على استراتيجيات النفط الخليجية', ARRAY['https://www.cop28.com'], ARRAY['COP28', 'مناخ', 'وقود_أحفوري']),

('انتخاب السعودية لاستضافة كأس العالم 2034', 'Saudi Arabia Awarded FIFA World Cup 2034', 'الفيفا تمنح السعودية حق استضافة كأس العالم 2034', 'FIFA awards Saudi Arabia hosting rights for 2034 World Cup', 'SA', 'social', '2024-12-11', 8, 'حملة دبلوماسية ضخمة + استثمارات رياضية + رؤية 2030', 'مشاريع بنية تحتية بمئات المليارات — تأكيد لمكانة السعودية الرياضية العالمية', ARRAY['https://www.fifa.com'], ARRAY['كأس_العالم_2034', 'رياضة', 'سعودية']),

('الإمارات تطلق استراتيجية الذكاء الاصطناعي 2031', 'UAE Launches AI Strategy 2031', 'الإمارات تعلن استراتيجية وطنية للذكاء الاصطناعي بقيمة 10 مليارات دولار', 'UAE announces $10B national AI strategy', 'AE', 'tech', '2024-02-12', 7, 'سباق عالمي على الذكاء الاصطناعي + رغبة في قيادة المنطقة تقنياً', 'الإمارات تتموضع كمركز عالمي للذكاء الاصطناعي — جذب شركات التقنية العالمية', ARRAY['https://ai.gov.ae'], ARRAY['ذكاء_اصطناعي', 'إمارات', 'تقنية']),

-- ══════════════════════════════════════════════
-- 2025
-- ══════════════════════════════════════════════
('هدنة في غزة — بداية مفاوضات السلام', 'Gaza Ceasefire — Peace Negotiations Begin', 'وقف إطلاق نار هش في غزة وبدء مفاوضات لتبادل الأسرى', 'Fragile ceasefire in Gaza and prisoner exchange negotiations begin', 'PS', 'diplomatic', '2025-01-19', 9, 'ضغط دولي متصاعد + إنهاك عسكري + أزمة إنسانية كارثية', 'فرصة لإعادة إعمار غزة وإحياء مسار السلام — لكن الاستقرار غير مضمون', ARRAY['https://www.aljazeera.net'], ARRAY['غزة', 'هدنة', 'سلام']),

('السعودية تطلق أكبر مدينة ترفيه في العالم', 'Saudi Arabia Launches World Largest Entertainment City', 'افتتاح المرحلة الأولى من مدينة القدية الترفيهية جنوب الرياض', 'Phase 1 of Qiddiya entertainment city opens south of Riyadh', 'SA', 'economic', '2025-03-01', 7, 'استثمار 8 مليارات دولار في قطاع الترفيه ضمن رؤية 2030', 'تحويل الرياض لوجهة ترفيهية عالمية — تنويع مصادر الدخل وخلق وظائف', ARRAY['https://www.qiddiya.com'], ARRAY['القدية', 'ترفيه', 'رؤية_2030']),

('النفط يتراجع تحت 70 دولار وسط مخاوف الطلب', 'Oil Falls Below $70 Amid Demand Concerns', 'تراجع أسعار النفط تحت 70 دولار بسبب تباطؤ الاقتصاد الصيني', 'Oil prices fall below $70 due to slowing Chinese economy', 'SA', 'energy', '2025-02-01', 7, 'تباطؤ الاقتصاد الصيني + زيادة إنتاج النفط الأمريكي + تحول نحو الطاقة المتجددة', 'ضغط على ميزانيات الخليج — تسريع التنويع الاقتصادي', ARRAY['https://www.opec.org'], ARRAY['نفط', 'أسعار', 'صين']),

('تشغيل مشروع نيوم — المرحلة الأولى', 'NEOM Phase 1 Operations Begin', 'بدء التشغيل الجزئي لمنطقة خليج نيوم والمدينة الصناعية أوكساجون', 'Partial operations begin at NEOM Bay and Oxagon industrial city', 'SA', 'economic', '2025-06-01', 8, 'استثمارات ضخمة منذ 2017 وضغط لإظهار نتائج ملموسة', 'أول دليل ملموس على تحقق رؤية نيوم — جذب اهتمام عالمي واستثمارات', ARRAY['https://www.neom.com'], ARRAY['نيوم', 'أوكساجون', 'مشاريع']),

('مصر تتلقى حزمة إنقاذ من صندوق النقد الدولي', 'Egypt Receives IMF Bailout Package', 'صندوق النقد الدولي يوافق على حزمة دعم بقيمة 8 مليارات دولار لمصر', 'IMF approves $8 billion support package for Egypt', 'EG', 'economic', '2025-04-01', 8, 'أزمة عملة + تضخم مرتفع + ضغوط ديموغرافية + تأثير حرب غزة على السياحة وقناة السويس', 'إصلاحات اقتصادية مؤلمة — تحرير سعر الصرف وتقليل الدعم الحكومي', ARRAY['https://www.imf.org'], ARRAY['مصر', 'صندوق_النقد', 'إصلاحات']),

('الأردن يطلق استراتيجية التحديث الاقتصادي 2.0', 'Jordan Launches Economic Modernization Strategy 2.0', 'الأردن يطلق المرحلة الثانية من استراتيجية التحديث الاقتصادي', 'Jordan launches second phase of economic modernization strategy', 'JO', 'economic', '2025-05-01', 6, 'تحديات اقتصادية مزمنة + بطالة مرتفعة + فرص في التقنية والسياحة', 'محاولة جذب استثمارات وتقليل البطالة — التركيز على التقنية والصناعات الإبداعية', ARRAY['https://www.pm.gov.jo'], ARRAY['أردن', 'تحديث_اقتصادي']),

-- ══════════════════════════════════════════════
-- 2026
-- ══════════════════════════════════════════════
('ميزانية السعودية 2026 — أكبر إنفاق في التاريخ', 'Saudi Budget 2026 — Largest Spending in History', 'المملكة تعلن ميزانية 2026 بإنفاق قياسي يبلغ 1.28 تريليون ريال', 'Kingdom announces 2026 budget with record spending of 1.28 trillion riyals', 'SA', 'economic', '2026-01-01', 8, 'تسريع مشاريع رؤية 2030 والاستعداد لإكسبو 2030 وكأس العالم 2034', 'استثمار ضخم في البنية التحتية والتعليم والصحة — فرص واسعة للقطاع الخاص', ARRAY['https://www.mof.gov.sa'], ARRAY['ميزانية_2026', 'إنفاق', 'رؤية_2030']),

('الإمارات تطلق أول محطة نووية عربية بكامل طاقتها', 'UAE Brakatah Nuclear Plant at Full Capacity', 'محطة براكة النووية تعمل بكامل طاقتها — 4 مفاعلات نووية', 'Barakah nuclear plant operates at full capacity — 4 nuclear reactors', 'AE', 'energy', '2026-01-15', 7, 'استراتيجية تنويع مصادر الطاقة والاستغناء الجزئي عن الغاز لتوليد الكهرباء', 'أول دولة عربية بطاقة نووية كاملة — تلبية 25% من احتياجات الكهرباء', ARRAY['https://www.enec.gov.ae'], ARRAY['نووي', 'براكة', 'طاقة']),

('أزمة مياه حادة في العراق', 'Severe Water Crisis in Iraq', 'العراق يعلن حالة طوارئ مائية مع انخفاض مستويات دجلة والفرات', 'Iraq declares water emergency as Tigris and Euphrates levels drop', 'IQ', 'health', '2026-02-01', 8, 'سدود تركية وإيرانية + تغير مناخي + سوء إدارة الموارد المائية', 'تهديد وجودي للزراعة والاقتصاد العراقي — نزوح سكاني من المناطق الجنوبية', ARRAY['https://www.worldbank.org'], ARRAY['مياه', 'عراق', 'مناخ']),

('قمة خليجية استثنائية حول الأمن الغذائي', 'Emergency GCC Summit on Food Security', 'قمة خليجية استثنائية لمواجهة تحديات الأمن الغذائي والمائي', 'Emergency GCC summit to address food and water security challenges', 'SA', 'diplomatic', '2026-03-01', 7, 'تداعيات تغير المناخ + اضطرابات سلاسل الإمداد + ارتفاع أسعار الغذاء العالمية', 'تكامل خليجي في الأمن الغذائي — استثمارات مشتركة في الزراعة والتقنية', ARRAY['https://www.gcc-sg.org'], ARRAY['أمن_غذائي', 'مجلس_التعاون', 'مناخ'])

ON CONFLICT (id) DO NOTHING;


-- ─── ECONOMIC INDICATORS (2015–2026) ─────────────────────────

-- Saudi Arabia GDP (Billion USD)
INSERT INTO archive_indicators (country_code, indicator_key, indicator_name_ar, indicator_name_en, value, unit, period, source) VALUES
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 654.3, 'billion_usd', '2015-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 644.9, 'billion_usd', '2016-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 688.6, 'billion_usd', '2017-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 786.5, 'billion_usd', '2018-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 793.0, 'billion_usd', '2019-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 700.1, 'billion_usd', '2020-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 833.5, 'billion_usd', '2021-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 1108.1, 'billion_usd', '2022-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 1068.0, 'billion_usd', '2023-01-01', 'World Bank'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 1112.0, 'billion_usd', '2024-01-01', 'IMF Estimate'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 1150.0, 'billion_usd', '2025-01-01', 'IMF Forecast'),
('SA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 1200.0, 'billion_usd', '2026-01-01', 'IMF Forecast'),

-- UAE GDP
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 358.1, 'billion_usd', '2015-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 357.0, 'billion_usd', '2016-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 385.6, 'billion_usd', '2017-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 422.2, 'billion_usd', '2018-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 421.1, 'billion_usd', '2019-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 349.5, 'billion_usd', '2020-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 415.0, 'billion_usd', '2021-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 507.5, 'billion_usd', '2022-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 509.2, 'billion_usd', '2023-01-01', 'World Bank'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 530.0, 'billion_usd', '2024-01-01', 'IMF Estimate'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 555.0, 'billion_usd', '2025-01-01', 'IMF Forecast'),
('AE', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 580.0, 'billion_usd', '2026-01-01', 'IMF Forecast'),

-- Qatar GDP
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 164.6, 'billion_usd', '2015-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 152.5, 'billion_usd', '2016-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 161.1, 'billion_usd', '2017-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 183.3, 'billion_usd', '2018-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 175.8, 'billion_usd', '2019-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 144.4, 'billion_usd', '2020-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 179.6, 'billion_usd', '2021-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 236.3, 'billion_usd', '2022-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 221.0, 'billion_usd', '2023-01-01', 'World Bank'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 235.0, 'billion_usd', '2024-01-01', 'IMF Estimate'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 245.0, 'billion_usd', '2025-01-01', 'IMF Forecast'),
('QA', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 260.0, 'billion_usd', '2026-01-01', 'IMF Forecast'),

-- Egypt GDP
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 332.7, 'billion_usd', '2015-01-01', 'World Bank'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 332.4, 'billion_usd', '2016-01-01', 'World Bank'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 235.4, 'billion_usd', '2017-01-01', 'World Bank'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 249.6, 'billion_usd', '2018-01-01', 'World Bank'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 303.1, 'billion_usd', '2019-01-01', 'World Bank'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 365.3, 'billion_usd', '2020-01-01', 'World Bank'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 404.1, 'billion_usd', '2021-01-01', 'World Bank'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 476.7, 'billion_usd', '2022-01-01', 'World Bank'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 395.9, 'billion_usd', '2023-01-01', 'World Bank'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 345.0, 'billion_usd', '2024-01-01', 'IMF Estimate'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 380.0, 'billion_usd', '2025-01-01', 'IMF Forecast'),
('EG', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 420.0, 'billion_usd', '2026-01-01', 'IMF Forecast'),

-- Kuwait GDP
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 114.6, 'billion_usd', '2015-01-01', 'World Bank'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 109.4, 'billion_usd', '2016-01-01', 'World Bank'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 120.7, 'billion_usd', '2017-01-01', 'World Bank'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 140.6, 'billion_usd', '2018-01-01', 'World Bank'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 134.8, 'billion_usd', '2019-01-01', 'World Bank'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 105.9, 'billion_usd', '2020-01-01', 'World Bank'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 136.2, 'billion_usd', '2021-01-01', 'World Bank'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 184.6, 'billion_usd', '2022-01-01', 'World Bank'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 161.8, 'billion_usd', '2023-01-01', 'World Bank'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 165.0, 'billion_usd', '2024-01-01', 'IMF Estimate'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 170.0, 'billion_usd', '2025-01-01', 'IMF Forecast'),
('KW', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 178.0, 'billion_usd', '2026-01-01', 'IMF Forecast'),

-- Iraq GDP
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 179.6, 'billion_usd', '2015-01-01', 'World Bank'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 171.5, 'billion_usd', '2016-01-01', 'World Bank'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 195.5, 'billion_usd', '2017-01-01', 'World Bank'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 224.2, 'billion_usd', '2018-01-01', 'World Bank'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 234.1, 'billion_usd', '2019-01-01', 'World Bank'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 167.2, 'billion_usd', '2020-01-01', 'World Bank'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 207.9, 'billion_usd', '2021-01-01', 'World Bank'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 264.2, 'billion_usd', '2022-01-01', 'World Bank'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 250.1, 'billion_usd', '2023-01-01', 'World Bank'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 255.0, 'billion_usd', '2024-01-01', 'IMF Estimate'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 268.0, 'billion_usd', '2025-01-01', 'IMF Forecast'),
('IQ', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 280.0, 'billion_usd', '2026-01-01', 'IMF Forecast'),

-- Jordan GDP
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 37.5, 'billion_usd', '2015-01-01', 'World Bank'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 38.7, 'billion_usd', '2016-01-01', 'World Bank'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 40.1, 'billion_usd', '2017-01-01', 'World Bank'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 42.3, 'billion_usd', '2018-01-01', 'World Bank'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 43.7, 'billion_usd', '2019-01-01', 'World Bank'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 43.7, 'billion_usd', '2020-01-01', 'World Bank'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 45.2, 'billion_usd', '2021-01-01', 'World Bank'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 47.4, 'billion_usd', '2022-01-01', 'World Bank'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 49.8, 'billion_usd', '2023-01-01', 'World Bank'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 51.5, 'billion_usd', '2024-01-01', 'IMF Estimate'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 53.0, 'billion_usd', '2025-01-01', 'IMF Forecast'),
('JO', 'gdp', 'الناتج المحلي الإجمالي', 'GDP', 55.0, 'billion_usd', '2026-01-01', 'IMF Forecast')

ON CONFLICT ON CONSTRAINT archive_indicators_country_code_indicator_key_period_key DO NOTHING;


-- ─── OIL PRICES (Brent Crude Average per Year) ──────────────

INSERT INTO archive_indicators (country_code, indicator_key, indicator_name_ar, indicator_name_en, value, unit, period, source) VALUES
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 52.4, 'usd_barrel', '2015-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 43.7, 'usd_barrel', '2016-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 54.3, 'usd_barrel', '2017-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 71.3, 'usd_barrel', '2018-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 64.2, 'usd_barrel', '2019-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 41.7, 'usd_barrel', '2020-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 70.9, 'usd_barrel', '2021-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 99.0, 'usd_barrel', '2022-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 82.6, 'usd_barrel', '2023-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 80.7, 'usd_barrel', '2024-01-01', 'OPEC'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 68.5, 'usd_barrel', '2025-01-01', 'OPEC Estimate'),
('SA', 'oil_price', 'سعر النفط (برنت)', 'Oil Price (Brent)', 72.0, 'usd_barrel', '2026-01-01', 'OPEC Forecast')
ON CONFLICT ON CONSTRAINT archive_indicators_country_code_indicator_key_period_key DO NOTHING;


-- ─── INFLATION RATES (%) ─────────────────────────────────────

INSERT INTO archive_indicators (country_code, indicator_key, indicator_name_ar, indicator_name_en, value, unit, period, source) VALUES
-- Saudi Arabia
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 2.2, 'percent', '2015-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 2.0, 'percent', '2016-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', -0.8, 'percent', '2017-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 2.5, 'percent', '2018-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', -2.1, 'percent', '2019-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 3.4, 'percent', '2020-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 3.1, 'percent', '2021-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 2.5, 'percent', '2022-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 2.3, 'percent', '2023-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 1.7, 'percent', '2024-01-01', 'GASTAT'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 2.0, 'percent', '2025-01-01', 'IMF Forecast'),
('SA', 'inflation', 'معدل التضخم', 'Inflation Rate', 2.1, 'percent', '2026-01-01', 'IMF Forecast'),
-- Egypt
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 10.4, 'percent', '2015-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 13.8, 'percent', '2016-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 29.5, 'percent', '2017-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 14.4, 'percent', '2018-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 9.2, 'percent', '2019-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 5.7, 'percent', '2020-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 5.2, 'percent', '2021-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 13.9, 'percent', '2022-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 33.9, 'percent', '2023-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 28.5, 'percent', '2024-01-01', 'CBE'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 18.0, 'percent', '2025-01-01', 'IMF Forecast'),
('EG', 'inflation', 'معدل التضخم', 'Inflation Rate', 12.0, 'percent', '2026-01-01', 'IMF Forecast')
ON CONFLICT ON CONSTRAINT archive_indicators_country_code_indicator_key_period_key DO NOTHING;


-- ─── UNEMPLOYMENT RATES (%) ──────────────────────────────────

INSERT INTO archive_indicators (country_code, indicator_key, indicator_name_ar, indicator_name_en, value, unit, period, source) VALUES
-- Saudi Arabia
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 11.5, 'percent', '2015-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 12.3, 'percent', '2016-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 12.8, 'percent', '2017-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 12.7, 'percent', '2018-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 12.0, 'percent', '2019-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 12.6, 'percent', '2020-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 11.0, 'percent', '2021-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 10.1, 'percent', '2022-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 8.6, 'percent', '2023-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 7.7, 'percent', '2024-01-01', 'GASTAT'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 7.0, 'percent', '2025-01-01', 'IMF Forecast'),
('SA', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 6.5, 'percent', '2026-01-01', 'IMF Forecast'),
-- Egypt
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 12.8, 'percent', '2015-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 12.5, 'percent', '2016-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 11.8, 'percent', '2017-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 9.9, 'percent', '2018-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 7.8, 'percent', '2019-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 7.9, 'percent', '2020-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 7.3, 'percent', '2021-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 7.2, 'percent', '2022-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 7.0, 'percent', '2023-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 6.9, 'percent', '2024-01-01', 'CAPMAS'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 6.5, 'percent', '2025-01-01', 'IMF Forecast'),
('EG', 'unemployment', 'معدل البطالة', 'Unemployment Rate', 6.2, 'percent', '2026-01-01', 'IMF Forecast')
ON CONFLICT ON CONSTRAINT archive_indicators_country_code_indicator_key_period_key DO NOTHING;


-- ─── FDI Inflows (Billion USD) ───────────────────────────────

INSERT INTO archive_indicators (country_code, indicator_key, indicator_name_ar, indicator_name_en, value, unit, period, source) VALUES
-- Saudi Arabia FDI
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 8.1, 'billion_usd', '2015-01-01', 'UNCTAD'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 7.5, 'billion_usd', '2016-01-01', 'UNCTAD'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 1.4, 'billion_usd', '2017-01-01', 'UNCTAD'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 4.2, 'billion_usd', '2018-01-01', 'UNCTAD'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 4.6, 'billion_usd', '2019-01-01', 'UNCTAD'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 5.4, 'billion_usd', '2020-01-01', 'UNCTAD'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 19.3, 'billion_usd', '2021-01-01', 'UNCTAD'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 7.9, 'billion_usd', '2022-01-01', 'UNCTAD'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 12.4, 'billion_usd', '2023-01-01', 'MISA'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 15.8, 'billion_usd', '2024-01-01', 'MISA Estimate'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 18.5, 'billion_usd', '2025-01-01', 'MISA Forecast'),
('SA', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 22.0, 'billion_usd', '2026-01-01', 'MISA Forecast'),
-- UAE FDI
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 8.8, 'billion_usd', '2015-01-01', 'UNCTAD'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 9.6, 'billion_usd', '2016-01-01', 'UNCTAD'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 10.4, 'billion_usd', '2017-01-01', 'UNCTAD'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 10.4, 'billion_usd', '2018-01-01', 'UNCTAD'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 13.8, 'billion_usd', '2019-01-01', 'UNCTAD'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 19.9, 'billion_usd', '2020-01-01', 'UNCTAD'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 20.7, 'billion_usd', '2021-01-01', 'UNCTAD'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 22.7, 'billion_usd', '2022-01-01', 'UNCTAD'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 25.3, 'billion_usd', '2023-01-01', 'UNCTAD'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 27.0, 'billion_usd', '2024-01-01', 'Estimate'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 29.0, 'billion_usd', '2025-01-01', 'Forecast'),
('AE', 'fdi', 'الاستثمار الأجنبي المباشر', 'FDI Inflows', 31.0, 'billion_usd', '2026-01-01', 'Forecast')
ON CONFLICT ON CONSTRAINT archive_indicators_country_code_indicator_key_period_key DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- DONE — ~50 events + ~200 indicator data points
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════
