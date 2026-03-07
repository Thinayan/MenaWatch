import { NextRequest, NextResponse } from "next/server";

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
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface RSSArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  thumbnail: string;
}

function extractTagContent(xml: string, tag: string): string {
  // Handle CDATA sections
  const cdataPattern = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i");
  const cdataMatch = xml.match(cdataPattern);
  if (cdataMatch) return cdataMatch[1].trim();

  // Handle regular content
  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(pattern);
  return match ? match[1].trim() : "";
}

function extractThumbnail(itemXml: string): string {
  // Try media:content url attribute
  const mediaContent = itemXml.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*/i);
  if (mediaContent) return mediaContent[1];

  // Try media:thumbnail url attribute
  const mediaThumbnail = itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*/i);
  if (mediaThumbnail) return mediaThumbnail[1];

  // Try enclosure url (common in RSS feeds)
  const enclosure = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*/i);
  if (enclosure) return enclosure[1];

  // Try image tag inside item
  const image = itemXml.match(/<image[^>]*>[\s\S]*?<url>([^<]+)<\/url>/i);
  if (image) return image[1].trim();

  // Try og:image or img src in description/content
  const imgSrc = itemXml.match(/<img[^>]*src=["']([^"']+)["'][^>]*/i);
  if (imgSrc) return imgSrc[1];

  return "";
}

function parseRSSItems(xml: string): RSSArticle[] {
  const articles: RSSArticle[] = [];

  // Split by <item> tags (works for both RSS 2.0 and Atom-like feeds)
  const itemPattern = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(xml)) !== null && articles.length < 20) {
    const itemXml = match[1];

    const title = extractTagContent(itemXml, "title")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/<[^>]+>/g, "");

    const link = extractTagContent(itemXml, "link") || "";
    const description = extractTagContent(itemXml, "description")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .substring(0, 300);

    const pubDate = extractTagContent(itemXml, "pubDate");
    const thumbnail = extractThumbnail(itemXml);

    if (title) {
      articles.push({ title, link, description, pubDate, thumbnail });
    }
  }

  return articles;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");

  if (!source) {
    return NextResponse.json(
      { error: "Missing 'source' query parameter. Use ?source=alarabiya or ?source=all" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // Return list of all available sources
  if (source === "all") {
    const sources = Object.entries(RSS_SOURCES).map(([key, { name, nameAr }]) => ({
      key,
      name,
      nameAr,
    }));
    return NextResponse.json(
      { sources, count: sources.length },
      { headers: CORS_HEADERS }
    );
  }

  // Validate the requested source
  const feedConfig = RSS_SOURCES[source];
  if (!feedConfig) {
    return NextResponse.json(
      {
        error: `Unknown source '${source}'. Use ?source=all to see available sources.`,
        availableSources: Object.keys(RSS_SOURCES),
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const res = await fetch(feedConfig.url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        "User-Agent": "MenaWatch-RSS/1.0",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          source,
          sourceName: feedConfig.name,
          sourceNameAr: feedConfig.nameAr,
          articles: [],
          error: `Feed returned HTTP ${res.status}`,
        },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    const xml = await res.text();
    const articles = parseRSSItems(xml);

    return NextResponse.json(
      {
        source,
        sourceName: feedConfig.name,
        sourceNameAr: feedConfig.nameAr,
        articles,
        count: articles.length,
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown fetch error";
    return NextResponse.json(
      {
        source,
        sourceName: feedConfig.name,
        sourceNameAr: feedConfig.nameAr,
        articles: [],
        error: `Failed to fetch RSS feed: ${message}`,
      },
      { status: 502, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
