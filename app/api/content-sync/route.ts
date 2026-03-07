import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";
import { mapArticle } from "../../../lib/content-mapper";

/**
 * Content Sync Cron — Runs every 30 minutes via Vercel Cron
 * 1. Fetches RSS feeds (29 sources)
 * 2. Fetches GDELT articles
 * 3. Classifies each article (category, country, sentiment)
 * 4. Upserts into `articles` table (skips duplicates)
 */

// ── RSS Sources (same as /api/rss) ────────────────────────
const RSS_SOURCES: Record<string, { url: string; name: string; nameAr: string }> = {
  alarabiya: { url: "https://www.alarabiya.net/mrss", name: "Al Arabiya", nameAr: "العربية" },
  alarabiya_biz: { url: "https://www.alarabiya.net/aswaq/mrss", name: "Al Arabiya Business", nameAr: "العربية بزنس" },
  alarabiya_energy: { url: "https://www.alarabiya.net/aswaq/energy/mrss", name: "Al Arabiya Energy", nameAr: "العربية طاقة" },
  alarabiya_tech: { url: "https://www.alarabiya.net/technology/mrss", name: "Al Arabiya Tech", nameAr: "العربية تقنية" },
  alarabiya_en: { url: "https://english.alarabiya.net/mrss", name: "Al Arabiya English", nameAr: "العربية إنجليزي" },
  alhadath: { url: "https://www.alhadath.net/mrss", name: "Al Hadath", nameAr: "الحدث" },
  aljazeera: { url: "https://feeds.aljazeera.net/ar/rss", name: "Al Jazeera", nameAr: "الجزيرة" },
  aljazeera_en: { url: "https://www.aljazeera.com/xml/rss/all.xml", name: "Al Jazeera English", nameAr: "الجزيرة إنجليزي" },
  bbc_ar: { url: "http://feeds.bbci.co.uk/arabic/rss.xml", name: "BBC Arabic", nameAr: "بي بي سي عربي" },
  bbc_en: { url: "http://feeds.bbci.co.uk/news/rss.xml", name: "BBC News", nameAr: "بي بي سي" },
  france24: { url: "https://www.france24.com/ar/rss", name: "France 24", nameAr: "فرانس 24" },
  dw: { url: "https://rss.dw.com/xml/rss-ar-all", name: "DW Arabic", nameAr: "دي دبليو عربية" },
  rt: { url: "https://arabic.rt.com/rss/", name: "RT Arabic", nameAr: "آر تي عربي" },
  spa: { url: "https://www.spa.gov.sa/rss", name: "SPA", nameAr: "وكالة الأنباء السعودية" },
  ain: { url: "https://www.ain.sa/rss", name: "Ain News", nameAr: "عين الإخبارية" },
  aleqt: { url: "https://www.aleqt.com/rss", name: "Al Eqtisadiah", nameAr: "الاقتصادية" },
  arabnews: { url: "https://www.arabnews.com/rss", name: "Arab News", nameAr: "عرب نيوز" },
  argaam: { url: "https://www.argaam.com/rss", name: "Argaam", nameAr: "أرقام" },
  okaz: { url: "https://www.okaz.com.sa/rss", name: "Okaz", nameAr: "عكاظ" },
  alriyadh: { url: "https://www.alriyadh.com/rss", name: "Al Riyadh", nameAr: "الرياض" },
  techcrunch: { url: "https://techcrunch.com/feed/", name: "TechCrunch", nameAr: "تك كرنش" },
  aitnews: { url: "https://www.aitnews.com/feed/", name: "AIT News", nameAr: "البوابة العربية للأخبار التقنية" },
  ummalqura: { url: "https://www.uqn.gov.sa/rss", name: "Um Al-Qura", nameAr: "جريدة أم القرى" },
  sabq: { url: "https://sabq.org/rss", name: "Sabq", nameAr: "صحيفة سبق" },
  maaal: { url: "https://www.maaal.com/feed/", name: "Maaal", nameAr: "مال" },

  // ── مصادر سعودية رسمية (حكومة + شركات) ──────────────────
  sama_ar: { url: "https://www.sama.gov.sa/ar-sa/News/Pages/rss.aspx", name: "SAMA", nameAr: "البنك المركزي السعودي" },
  royal_court: { url: "https://www.spa.gov.sa/rss/category/royalcourt", name: "Royal Court", nameAr: "الديوان الملكي" },
  mof_sa: { url: "https://www.mof.gov.sa/RSS/Pages/default.aspx", name: "MOF Saudi", nameAr: "وزارة المالية السعودية" },
  mci_sa: { url: "https://www.mc.gov.sa/ar/RSSFeeds/Pages/default.aspx", name: "MCI Saudi", nameAr: "وزارة التجارة السعودية" },
  moe_sa: { url: "https://www.moe.gov.sa/ar/news/Pages/rss.aspx", name: "MOE Saudi", nameAr: "وزارة التعليم السعودية" },
  moh_sa: { url: "https://www.moh.gov.sa/RSS/Pages/News.aspx", name: "MOH Saudi", nameAr: "وزارة الصحة السعودية" },
  cma_sa: { url: "https://cma.org.sa/RSSFeeds/Pages/default.aspx", name: "CMA Saudi", nameAr: "هيئة السوق المالية" },
  aramco_news: { url: "https://www.aramco.com/en/news-media/news/rss", name: "Aramco", nameAr: "أرامكو السعودية" },
  sabic_news: { url: "https://www.sabic.com/en/rss", name: "SABIC", nameAr: "سابك" },
  stc_news: { url: "https://www.stc.com.sa/wps/wcm/connect/english/stc/rss", name: "STC", nameAr: "الاتصالات السعودية" },
  tadawul: { url: "https://www.saudiexchange.sa/wps/portal/saudiexchange/newsroom/rss", name: "Tadawul", nameAr: "تداول السعودية" },
  gastat: { url: "https://www.stats.gov.sa/rss.xml", name: "GASTAT", nameAr: "الهيئة العامة للإحصاء" },

  // ── مصادر دولية ──────────────────────────────────────────
  un_news_ar: { url: "https://news.un.org/feed/subscribe/ar/news/region/middle-east/feed/rss.xml", name: "UN News Arabic", nameAr: "أخبار الأمم المتحدة" },
  worldbank_mena: { url: "https://blogs.worldbank.org/en/arabvoices/rss.xml", name: "World Bank MENA", nameAr: "البنك الدولي — الشرق الأوسط" },
  imf_mena: { url: "https://www.imf.org/en/News/rss?Language=ENG&Series=All&Category=Middle%20East", name: "IMF MENA", nameAr: "صندوق النقد الدولي" },
  reuters_me: { url: "https://www.reuters.com/arc/outboundfeeds/rss/region/middle-east/", name: "Reuters Middle East", nameAr: "رويترز — الشرق الأوسط" },
  ap_news: { url: "https://rsshub.app/apnews/topics/world-news", name: "Associated Press", nameAr: "أسوشيتد برس" },

  // ── شركات استشارية عالمية (تقارير ورؤى مجانية) ────────────
  mckinsey_me: { url: "https://www.mckinsey.com/rss/insights", name: "McKinsey Insights", nameAr: "ماكنزي" },
  bcg_me: { url: "https://www.bcg.com/rss/insights", name: "BCG Insights", nameAr: "بوسطن كونسلتينج" },
  pwc_me: { url: "https://www.pwc.com/m1/en/rss-feeds/insights-rss.xml", name: "PwC Middle East", nameAr: "برايس ووتر هاوس" },
  kpmg_me: { url: "https://kpmg.com/sa/en/home/rss.xml", name: "KPMG Saudi", nameAr: "كي بي إم جي" },
  strategyand_me: { url: "https://www.strategyand.pwc.com/m1/en/rss-feeds.xml", name: "Strategy& ME", nameAr: "ستراتيجي آند" },
  deloitte_me: { url: "https://www2.deloitte.com/xe/en/rss.xml", name: "Deloitte ME", nameAr: "ديلويت" },
  ey_me: { url: "https://www.ey.com/en_ae/rss", name: "EY Middle East", nameAr: "إرنست آند يونغ" },
};

// ── XML Parsing (same as /api/rss) ─────────────────────────
function extractTagContent(xml: string, tag: string): string {
  const cdataPattern = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i");
  const cdataMatch = xml.match(cdataPattern);
  if (cdataMatch) return cdataMatch[1].trim();

  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(pattern);
  return match ? match[1].trim() : "";
}

function extractThumbnail(itemXml: string): string {
  const mediaContent = itemXml.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*/i);
  if (mediaContent) return mediaContent[1];
  const mediaThumbnail = itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*/i);
  if (mediaThumbnail) return mediaThumbnail[1];
  const enclosure = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*/i);
  if (enclosure) return enclosure[1];
  const imgSrc = itemXml.match(/<img[^>]*src=["']([^"']+)["'][^>]*/i);
  if (imgSrc) return imgSrc[1];
  return "";
}

function cleanHTML(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

interface RawArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  thumbnail: string;
}

function parseRSSItems(xml: string, limit = 15): RawArticle[] {
  const articles: RawArticle[] = [];
  const itemPattern = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(xml)) !== null && articles.length < limit) {
    const itemXml = match[1];
    const title = cleanHTML(extractTagContent(itemXml, "title"));
    const link = extractTagContent(itemXml, "link") || "";
    const description = cleanHTML(extractTagContent(itemXml, "description")).substring(0, 500);
    const pubDate = extractTagContent(itemXml, "pubDate");
    const thumbnail = extractThumbnail(itemXml);

    if (title && link) {
      articles.push({ title, link, description, pubDate, thumbnail });
    }
  }
  return articles;
}

// ── Fetch all RSS feeds ────────────────────────────────────
async function fetchAllRSS(): Promise<{ sourceKey: string; sourceName: string; articles: RawArticle[] }[]> {
  const results: { sourceKey: string; sourceName: string; articles: RawArticle[] }[] = [];

  // Fetch feeds in batches of 8 to balance speed and server load
  const entries = Object.entries(RSS_SOURCES);
  const BATCH_SIZE = 8;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async ([key, config]) => {
      try {
        const res = await fetch(config.url, {
          signal: AbortSignal.timeout(10000), // 10s timeout per feed
          headers: {
            "User-Agent": "MenaWatch-ContentSync/1.0",
            Accept: "application/rss+xml, application/xml, text/xml, */*",
          },
        });
        if (!res.ok) return { sourceKey: key, sourceName: config.nameAr, articles: [] as RawArticle[] };
        const xml = await res.text();
        const articles = parseRSSItems(xml, 15);
        return { sourceKey: key, sourceName: config.nameAr, articles };
      } catch {
        return { sourceKey: key, sourceName: config.nameAr, articles: [] as RawArticle[] };
      }
    });

    const batchResults = await Promise.allSettled(promises);
    for (const r of batchResults) {
      if (r.status === "fulfilled") results.push(r.value);
    }
  }

  return results;
}

// ── Fetch GDELT articles ───────────────────────────────────
async function fetchGDELT(): Promise<RawArticle[]> {
  try {
    const queries = [
      "Saudi Arabia Middle East",
      "UAE Dubai Abu Dhabi",
      "OPEC oil gas energy",
      "Egypt Iraq Syria conflict",
    ];

    const allArticles: RawArticle[] = [];

    for (const q of queries) {
      try {
        const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=artlist&maxrecords=10&format=json&sort=DateDesc`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.articles) {
          for (const a of data.articles) {
            if (allArticles.length >= 30) break;
            allArticles.push({
              title: a.title || "",
              link: a.url || "",
              description: a.seendate ? `GDELT — ${a.domain || ""}` : "",
              pubDate: a.seendate || new Date().toISOString(),
              thumbnail: a.socialimage || "",
            });
          }
        }
      } catch {
        // Skip failed GDELT queries
      }
    }

    return allArticles;
  } catch {
    return [];
  }
}

// ── Main Sync Logic ────────────────────────────────────────
async function syncContent() {
  const startTime = Date.now();
  const stats = {
    rss_sources_fetched: 0,
    rss_articles_found: 0,
    gdelt_articles_found: 0,
    total_upserted: 0,
    errors: [] as string[],
  };

  // 1. Fetch RSS + GDELT in parallel
  const [rssResults, gdeltArticles] = await Promise.all([
    fetchAllRSS(),
    fetchGDELT(),
  ]);

  // 2. Prepare articles for upsert
  const articlesToUpsert: any[] = [];

  // Process RSS
  for (const source of rssResults) {
    if (source.articles.length > 0) stats.rss_sources_fetched++;
    stats.rss_articles_found += source.articles.length;

    for (const article of source.articles) {
      const mapped = mapArticle({ title: article.title, description: article.description });
      articlesToUpsert.push({
        source_key: source.sourceKey,
        source_name: source.sourceName,
        title: article.title.substring(0, 500),
        description: article.description?.substring(0, 1000) || null,
        link: article.link,
        thumbnail: article.thumbnail || null,
        pub_date: article.pubDate ? new Date(article.pubDate).toISOString() : new Date().toISOString(),
        category: mapped.category,
        country_codes: mapped.country_codes,
        sentiment_score: mapped.sentiment_score,
        sentiment_label: mapped.sentiment_label,
        is_published: true,
      });
    }
  }

  // Process GDELT
  stats.gdelt_articles_found = gdeltArticles.length;
  for (const article of gdeltArticles) {
    const mapped = mapArticle({ title: article.title, description: article.description });
    articlesToUpsert.push({
      source_key: "gdelt",
      source_name: "GDELT",
      title: article.title.substring(0, 500),
      description: article.description?.substring(0, 1000) || null,
      link: article.link,
      thumbnail: article.thumbnail || null,
      pub_date: article.pubDate ? new Date(article.pubDate).toISOString() : new Date().toISOString(),
      category: mapped.category,
      country_codes: mapped.country_codes,
      sentiment_score: mapped.sentiment_score,
      sentiment_label: mapped.sentiment_label,
      is_published: true,
    });
  }

  // 3. Upsert in batches of 50
  const UPSERT_BATCH = 50;
  for (let i = 0; i < articlesToUpsert.length; i += UPSERT_BATCH) {
    const batch = articlesToUpsert.slice(i, i + UPSERT_BATCH);
    try {
      const { error, data } = await supabaseServer
        .from("articles")
        .upsert(batch, {
          onConflict: "source_key,link",
          ignoreDuplicates: true,
        });

      if (error) {
        stats.errors.push(`Upsert batch ${i / UPSERT_BATCH + 1}: ${error.message}`);
      } else {
        stats.total_upserted += batch.length;
      }
    } catch (e: any) {
      stats.errors.push(`Upsert batch error: ${e.message}`);
    }
  }

  // 4. Clean up old articles (older than 30 days, not featured)
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await supabaseServer
      .from("articles")
      .delete()
      .eq("is_featured", false)
      .lt("pub_date", thirtyDaysAgo.toISOString());
  } catch {
    // Non-critical — log but don't fail
  }

  const duration = Date.now() - startTime;
  return {
    ...stats,
    duration_ms: duration,
    timestamp: new Date().toISOString(),
  };
}

// ── API Handler ────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets this header for cron jobs)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Allow: Vercel cron (no auth needed), or manual with CRON_SECRET, or if no secret is set
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Check if it's a Vercel cron request
    const isVercelCron = req.headers.get("x-vercel-cron") === "true" ||
      req.headers.get("user-agent")?.includes("vercel-cron");

    if (!isVercelCron) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await syncContent();
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Support POST as well (for manual triggers from admin)
export async function POST(req: NextRequest) {
  return GET(req);
}
