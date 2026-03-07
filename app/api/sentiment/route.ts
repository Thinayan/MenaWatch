import { NextRequest, NextResponse } from "next/server";

// ── Keyword dictionaries ──────────────────────────────────────────────

const POSITIVE_AR = [
  "نمو", "ارتفاع", "صعود", "استقرار", "تحسن", "اتفاق", "سلام", "ازدهار",
  "نجاح", "تقدم", "شراكة", "استثمار", "إيجابي", "تعاون", "إنجاز", "تطور",
  "فرصة", "انتعاش", "ربح", "مكاسب",
];

const NEGATIVE_AR = [
  "انخفاض", "تراجع", "أزمة", "حرب", "صراع", "هجوم", "تهديد", "خطر",
  "انهيار", "توتر", "عقوبات", "خسارة", "ركود", "تصعيد", "انسحاب",
  "اشتباك", "قصف", "ضحايا", "فشل", "عجز",
];

const POSITIVE_EN = [
  "growth", "rise", "stable", "agreement", "peace", "success", "investment",
  "positive", "partnership", "recovery", "profit", "surge", "rally", "gain",
];

const NEGATIVE_EN = [
  "decline", "crisis", "war", "conflict", "attack", "threat", "collapse",
  "tension", "sanctions", "loss", "recession", "escalation", "bombing",
  "casualties", "failure",
];

// ── Category keyword classifiers ──────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  political: [
    "سياس", "حكوم", "رئيس", "وزير", "برلمان", "انتخاب", "دبلوماس", "سفير",
    "قمة", "مجلس", "سياسة", "حزب", "تشريع", "دولة",
    "political", "government", "president", "minister", "parliament",
    "election", "diplomat", "summit", "policy", "senate", "congress",
  ],
  economic: [
    "اقتصاد", "سوق", "نفط", "بنك", "مال", "تجار", "صناع", "بورصة",
    "أسهم", "عملة", "ميزانية", "ناتج", "تضخم", "فائدة", "ريال", "دولار",
    "economy", "market", "oil", "bank", "trade", "stock", "currency",
    "gdp", "inflation", "interest", "finance", "crude", "opec", "fiscal",
  ],
  security: [
    "أمن", "عسكر", "جيش", "دفاع", "إرهاب", "سلاح", "قوات", "حدود",
    "استخبار", "صاروخ", "طائرة", "درون", "ميليشي", "تحالف",
    "security", "military", "army", "defense", "terror", "weapon", "forces",
    "border", "intelligence", "missile", "drone", "militia", "coalition",
  ],
};

// ── CORS headers ──────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── Types ─────────────────────────────────────────────────────────────

interface ArticleInput {
  title: string;
  description?: string;
  source?: string;
}

interface ArticleSentiment {
  title: string;
  source: string;
  score: number; // -1 to +1
  label: "positive" | "negative" | "neutral";
  positive_hits: string[];
  negative_hits: string[];
  category: "political" | "economic" | "security" | "general";
}

// ── Helpers ───────────────────────────────────────────────────────────

function classifyCategory(text: string): "political" | "economic" | "security" | "general" {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = { political: 0, economic: 0, security: 0 };

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      // For Arabic use includes (partial match works well for root forms)
      // For English use word-boundary check
      if (/[\u0600-\u06FF]/.test(kw)) {
        if (text.includes(kw)) scores[cat]++;
      } else {
        const regex = new RegExp(`\\b${kw}\\b`, "i");
        if (regex.test(lower)) scores[cat]++;
      }
    }
  }

  const max = Math.max(scores.political, scores.economic, scores.security);
  if (max === 0) return "general";
  if (scores.political === max) return "political";
  if (scores.economic === max) return "economic";
  return "security";
}

function analyzeText(text: string): {
  score: number;
  label: "positive" | "negative" | "neutral";
  positive_hits: string[];
  negative_hits: string[];
} {
  const positive_hits: string[] = [];
  const negative_hits: string[] = [];

  // Check Arabic keywords (partial / root matching)
  for (const kw of POSITIVE_AR) {
    if (text.includes(kw)) positive_hits.push(kw);
  }
  for (const kw of NEGATIVE_AR) {
    if (text.includes(kw)) negative_hits.push(kw);
  }

  // Check English keywords (word-boundary matching)
  const lower = text.toLowerCase();
  for (const kw of POSITIVE_EN) {
    const regex = new RegExp(`\\b${kw}\\b`, "i");
    if (regex.test(lower)) positive_hits.push(kw);
  }
  for (const kw of NEGATIVE_EN) {
    const regex = new RegExp(`\\b${kw}\\b`, "i");
    if (regex.test(lower)) negative_hits.push(kw);
  }

  const total = positive_hits.length + negative_hits.length;
  if (total === 0) {
    return { score: 0, label: "neutral", positive_hits, negative_hits };
  }

  // Score ranges from -1 (all negative) to +1 (all positive)
  const score = (positive_hits.length - negative_hits.length) / total;

  let label: "positive" | "negative" | "neutral";
  if (score > 0.15) label = "positive";
  else if (score < -0.15) label = "negative";
  else label = "neutral";

  return { score: Math.round(score * 100) / 100, label, positive_hits, negative_hits };
}

function computeTrend(scores: number[]): "improving" | "declining" | "stable" {
  if (scores.length < 2) return "stable";
  // Simple: compare average of first half vs second half
  const mid = Math.floor(scores.length / 2);
  const firstHalf = scores.slice(0, mid);
  const secondHalf = scores.slice(mid);
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const diff = avgSecond - avgFirst;
  if (diff > 0.1) return "improving";
  if (diff < -0.1) return "declining";
  return "stable";
}

// ── POST handler ──────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const articles: ArticleInput[] = body.articles;

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { error: "Request body must contain a non-empty 'articles' array with {title, description?, source?}" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Analyse each article
    const results: ArticleSentiment[] = articles.map((article) => {
      const combinedText = `${article.title || ""} ${article.description || ""}`;
      const { score, label, positive_hits, negative_hits } = analyzeText(combinedText);
      const category = classifyCategory(combinedText);

      return {
        title: article.title,
        source: article.source || "unknown",
        score,
        label,
        positive_hits,
        negative_hits,
        category,
      };
    });

    // Overall aggregates
    const allScores = results.map((r) => r.score);
    const overallScore =
      allScores.length > 0
        ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100) / 100
        : 0;

    let overallLabel: "positive" | "negative" | "neutral";
    if (overallScore > 0.15) overallLabel = "positive";
    else if (overallScore < -0.15) overallLabel = "negative";
    else overallLabel = "neutral";

    const trend = computeTrend(allScores);

    // Category breakdowns
    const categoryGroups: Record<string, number[]> = {
      political: [],
      economic: [],
      security: [],
      general: [],
    };
    for (const r of results) {
      categoryGroups[r.category].push(r.score);
    }

    const categories = Object.entries(categoryGroups)
      .filter(([, scores]) => scores.length > 0)
      .map(([cat, scores]) => {
        const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;
        let lbl: "positive" | "negative" | "neutral";
        if (avg > 0.15) lbl = "positive";
        else if (avg < -0.15) lbl = "negative";
        else lbl = "neutral";
        return { category: cat, score: avg, label: lbl, count: scores.length };
      });

    // Distribution counts
    const distribution = {
      positive: results.filter((r) => r.label === "positive").length,
      negative: results.filter((r) => r.label === "negative").length,
      neutral: results.filter((r) => r.label === "neutral").length,
    };

    return NextResponse.json(
      {
        overall: {
          score: overallScore,
          label: overallLabel,
          trend,
          total_articles: results.length,
        },
        distribution,
        categories,
        articles: results,
        analyzed_at: new Date().toISOString(),
      },
      {
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Sentiment analysis error:", message);
    return NextResponse.json(
      { error: `Sentiment analysis failed: ${message}` },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
