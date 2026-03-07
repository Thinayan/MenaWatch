/**
 * Content Mapper — Categorizes articles by topic and country
 * Used by content-sync to classify RSS/GDELT articles automatically.
 */

// ── Country Detection ──────────────────────────────────────
interface CountryPattern {
  code: string;
  nameAr: string;
  nameEn: string;
  keywords: string[];
}

const MENA_COUNTRIES: CountryPattern[] = [
  { code: "SA", nameAr: "السعودية", nameEn: "Saudi Arabia", keywords: ["السعودية", "سعودي", "الرياض", "جدة", "مكة", "المدينة", "saudi", "riyadh", "jeddah", "mecca", "medina", "neom", "aramco", "أرامكو", "نيوم", "رؤية 2030", "vision 2030", "ولي العهد", "محمد بن سلمان", "mbs"] },
  { code: "AE", nameAr: "الإمارات", nameEn: "UAE", keywords: ["الإمارات", "إماراتي", "أبوظبي", "دبي", "الشارقة", "uae", "emirates", "dubai", "abu dhabi", "sharjah", "adnoc", "أدنوك"] },
  { code: "EG", nameAr: "مصر", nameEn: "Egypt", keywords: ["مصر", "مصري", "القاهرة", "egypt", "cairo", "suez", "السويس", "سيناء", "sinai"] },
  { code: "IQ", nameAr: "العراق", nameEn: "Iraq", keywords: ["العراق", "عراقي", "بغداد", "iraq", "baghdad", "كردستان", "kurdistan", "البصرة", "basra"] },
  { code: "JO", nameAr: "الأردن", nameEn: "Jordan", keywords: ["الأردن", "أردني", "عمان", "jordan", "amman"] },
  { code: "KW", nameAr: "الكويت", nameEn: "Kuwait", keywords: ["الكويت", "كويتي", "kuwait"] },
  { code: "LB", nameAr: "لبنان", nameEn: "Lebanon", keywords: ["لبنان", "لبناني", "بيروت", "lebanon", "beirut", "حزب الله", "hezbollah"] },
  { code: "LY", nameAr: "ليبيا", nameEn: "Libya", keywords: ["ليبيا", "ليبي", "طرابلس", "libya", "tripoli", "بنغازي", "benghazi"] },
  { code: "MA", nameAr: "المغرب", nameEn: "Morocco", keywords: ["المغرب", "مغربي", "الرباط", "morocco", "rabat", "casablanca", "الدار البيضاء"] },
  { code: "OM", nameAr: "عُمان", nameEn: "Oman", keywords: ["عمان", "عماني", "مسقط", "oman", "muscat"] },
  { code: "PS", nameAr: "فلسطين", nameEn: "Palestine", keywords: ["فلسطين", "فلسطيني", "غزة", "الضفة", "palestine", "gaza", "west bank", "القدس", "jerusalem", "حماس", "hamas"] },
  { code: "QA", nameAr: "قطر", nameEn: "Qatar", keywords: ["قطر", "قطري", "الدوحة", "qatar", "doha"] },
  { code: "SY", nameAr: "سوريا", nameEn: "Syria", keywords: ["سوريا", "سوري", "دمشق", "syria", "damascus", "حلب", "aleppo"] },
  { code: "TN", nameAr: "تونس", nameEn: "Tunisia", keywords: ["تونس", "تونسي", "tunisia", "tunis"] },
  { code: "YE", nameAr: "اليمن", nameEn: "Yemen", keywords: ["اليمن", "يمني", "صنعاء", "yemen", "sanaa", "عدن", "aden", "الحوثي", "houthi"] },
  { code: "BH", nameAr: "البحرين", nameEn: "Bahrain", keywords: ["البحرين", "بحريني", "المنامة", "bahrain", "manama"] },
  { code: "DZ", nameAr: "الجزائر", nameEn: "Algeria", keywords: ["الجزائر", "جزائري", "algeria", "algiers"] },
  { code: "SD", nameAr: "السودان", nameEn: "Sudan", keywords: ["السودان", "سوداني", "الخرطوم", "sudan", "khartoum"] },
  { code: "IR", nameAr: "إيران", nameEn: "Iran", keywords: ["إيران", "إيراني", "طهران", "iran", "tehran", "الحرس الثوري", "irgc"] },
  { code: "TR", nameAr: "تركيا", nameEn: "Turkey", keywords: ["تركيا", "تركي", "أنقرة", "إسطنبول", "turkey", "türkiye", "ankara", "istanbul", "أردوغان", "erdogan"] },
  { code: "IL", nameAr: "إسرائيل", nameEn: "Israel", keywords: ["إسرائيل", "إسرائيلي", "تل أبيب", "israel", "tel aviv", "نتنياهو", "netanyahu", "الكنيست", "knesset"] },
];

// ── Category Detection ─────────────────────────────────────
interface CategoryPattern {
  id: string;
  nameAr: string;
  keywords: string[];
}

const CATEGORIES: CategoryPattern[] = [
  {
    id: "political",
    nameAr: "سياسي",
    keywords: [
      "سياسة", "سياسي", "حكومة", "حكومي", "رئيس", "وزير", "برلمان", "مجلس", "انتخابات",
      "دبلوماسي", "دبلوماسية", "سفير", "سفارة", "خارجية", "قمة", "معاهدة", "اتفاقية",
      "حزب", "معارضة", "ديمقراطية", "استفتاء", "تعيين", "إقالة",
      "politics", "political", "government", "president", "minister", "parliament",
      "election", "diplomat", "embassy", "treaty", "summit", "opposition", "party",
      "sanctions", "عقوبات", "تطبيع", "normalization"
    ],
  },
  {
    id: "economic",
    nameAr: "اقتصادي",
    keywords: [
      "اقتصاد", "اقتصادي", "سوق", "أسواق", "بورصة", "تداول", "نفط", "بترول", "غاز",
      "بنك", "مصرف", "مصرفي", "تضخم", "ناتج", "استثمار", "تمويل", "ميزانية",
      "أوبك", "opec", "أرباح", "إيرادات", "صادرات", "واردات", "تجارة",
      "oil", "gas", "economy", "economic", "market", "stock", "bank", "gdp", "trade",
      "inflation", "investment", "budget", "revenue", "export", "import",
      "أرامكو", "aramco", "sabic", "سابك", "تداول", "tadawul",
      "عملة", "دولار", "ريال", "dollar", "currency", "forex"
    ],
  },
  {
    id: "security",
    nameAr: "أمني",
    keywords: [
      "أمن", "أمني", "عسكر", "عسكري", "جيش", "دفاع", "إرهاب", "حرب", "صراع",
      "سلاح", "صاروخ", "قصف", "غارة", "هجوم", "عملية", "استخبارات",
      "تحالف", "حلف", "ناتو", "حدود", "لاجئ", "نازح",
      "security", "military", "army", "defense", "terror", "war", "conflict",
      "weapon", "missile", "attack", "strike", "nato", "intelligence",
      "refugee", "border", "ceasefire", "وقف إطلاق", "هدنة", "truce"
    ],
  },
  {
    id: "health",
    nameAr: "صحي",
    keywords: [
      "صحة", "صحي", "طب", "طبي", "مستشفى", "عيادة", "دواء", "لقاح", "وباء",
      "فيروس", "مرض", "علاج", "جراحة", "تمريض", "منظمة الصحة",
      "health", "medical", "hospital", "vaccine", "virus", "disease", "treatment",
      "who", "pandemic", "epidemic", "pharmaceutical", "دوائي"
    ],
  },
  {
    id: "energy",
    nameAr: "طاقة",
    keywords: [
      "طاقة", "كهرباء", "شمسية", "متجددة", "نووي", "هيدروجين", "رياح",
      "مصفاة", "تكرير", "خط أنابيب", "حقل", "تنقيب", "إنتاج نفطي",
      "energy", "solar", "renewable", "nuclear", "hydrogen", "wind",
      "refinery", "pipeline", "drilling", "production"
    ],
  },
  {
    id: "tech",
    nameAr: "تقنية",
    keywords: [
      "تقنية", "تكنولوجيا", "ذكاء اصطناعي", "رقمي", "تحول رقمي", "بيانات",
      "إنترنت", "اتصالات", "فضاء", "قمر صناعي", "روبوت", "بلوكتشين",
      "technology", "tech", "ai", "artificial intelligence", "digital",
      "data", "internet", "telecom", "space", "satellite", "blockchain", "5g"
    ],
  },
];

// ── Sentiment Keywords (from existing /api/sentiment) ──────
const POSITIVE_KW = [
  "نمو", "ارتفاع", "استقرار", "نجاح", "تقدم", "إنجاز", "تحسن", "زيادة",
  "اتفاق", "سلام", "تعاون", "شراكة", "تنمية", "ازدهار", "فائض", "إيجابي",
  "growth", "rise", "stability", "success", "progress", "improvement",
  "agreement", "peace", "cooperation", "partnership", "surplus", "positive",
  "record", "milestone", "achievement", "boost", "gain", "recovery"
];

const NEGATIVE_KW = [
  "انخفاض", "تراجع", "أزمة", "حرب", "صراع", "عقوبات", "تصعيد", "انهيار",
  "تهديد", "خسارة", "عجز", "ركود", "فساد", "احتجاج", "قتل", "ضحايا",
  "decline", "crisis", "war", "conflict", "sanctions", "escalation", "collapse",
  "threat", "loss", "deficit", "recession", "corruption", "protest", "casualties",
  "attack", "strike", "bomb", "terror", "violence"
];

// ── Public Functions ───────────────────────────────────────

export interface ArticleInput {
  title: string;
  description?: string;
  link?: string;
  source?: string;
}

export interface MappedArticle {
  category: string;
  country_codes: string[];
  sentiment_score: number;
  sentiment_label: string;
}

/**
 * Detect countries mentioned in article text
 */
export function detectCountries(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const country of MENA_COUNTRIES) {
    for (const kw of country.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        if (!found.includes(country.code)) {
          found.push(country.code);
        }
        break;
      }
    }
  }

  return found;
}

/**
 * Detect the primary category of an article
 */
export function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const cat of CATEGORIES) {
    scores[cat.id] = 0;
    for (const kw of cat.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        scores[cat.id]++;
      }
    }
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "general";
}

/**
 * Analyze sentiment of article text
 * Returns score (-1 to +1) and label (positive/negative/neutral)
 */
export function analyzeSentiment(text: string): { score: number; label: string } {
  const lower = text.toLowerCase();
  let pos = 0;
  let neg = 0;

  for (const kw of POSITIVE_KW) {
    if (lower.includes(kw.toLowerCase())) pos++;
  }
  for (const kw of NEGATIVE_KW) {
    if (lower.includes(kw.toLowerCase())) neg++;
  }

  const total = pos + neg;
  if (total === 0) return { score: 0, label: "neutral" };

  const score = Math.round(((pos - neg) / total) * 100) / 100;
  const label = score > 0.15 ? "positive" : score < -0.15 ? "negative" : "neutral";

  return { score, label };
}

/**
 * Full article mapping — category + countries + sentiment
 */
export function mapArticle(article: ArticleInput): MappedArticle {
  const text = `${article.title || ""} ${article.description || ""}`;

  return {
    category: detectCategory(text),
    country_codes: detectCountries(text),
    ...analyzeSentiment(text),
  };
}

/**
 * Get category display name in Arabic
 */
export function getCategoryNameAr(categoryId: string): string {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat?.nameAr || "عام";
}

/**
 * Get country name in Arabic
 */
export function getCountryNameAr(code: string): string {
  const country = MENA_COUNTRIES.find((c) => c.code === code);
  return country?.nameAr || code;
}

/**
 * List all categories
 */
export function getAllCategories() {
  return [
    { id: "political", nameAr: "سياسي" },
    { id: "economic", nameAr: "اقتصادي" },
    { id: "security", nameAr: "أمني" },
    { id: "health", nameAr: "صحي" },
    { id: "energy", nameAr: "طاقة" },
    { id: "tech", nameAr: "تقنية" },
    { id: "general", nameAr: "عام" },
  ];
}

/**
 * List all MENA countries
 */
export function getAllCountries() {
  return MENA_COUNTRIES.map((c) => ({ code: c.code, nameAr: c.nameAr, nameEn: c.nameEn }));
}
