import { NextRequest, NextResponse } from "next/server";

/**
 * RSS Bar API — Fetches news for the header scrolling bars
 * Supports: saudi (أخبار السعودية), markets (الأسواق والاقتصاد)
 *
 * Strategy: Try multiple sources in order — use first one that returns data
 */

const FEEDS: Record<string, { label: string; sources: { url: string; name: string }[] }> = {
  saudi: {
    label: "أخبار السعودية",
    sources: [
      { url: "http://feeds.bbci.co.uk/arabic/rss.xml", name: "BBC عربي" },
      { url: "https://www.spa.gov.sa/rss", name: "واس" },
      { url: "https://aawsat.com/feed", name: "الشرق الأوسط" },
      { url: "https://feeds.aljazeera.net/ar/rss", name: "الجزيرة" },
      { url: "https://arabic.rt.com/rss/", name: "RT عربي" },
      { url: "https://www.alarabiya.net/mrss", name: "العربية" },
    ],
  },
  markets: {
    label: "الأسواق والاقتصاد",
    sources: [
      { url: "https://www.argaam.com/rss", name: "أرقام" },
      { url: "https://www.aleqt.com/rss", name: "الاقتصادية" },
      { url: "https://www.maaal.com/feed/", name: "مال" },
      { url: "http://feeds.bbci.co.uk/arabic/rss.xml", name: "BBC عربي" },
      { url: "https://www.alarabiya.net/aswaq/mrss", name: "العربية بزنس" },
    ],
  },
};

function extractTagContent(xml: string, tag: string): string {
  const cdataPattern = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i");
  const cdataMatch = xml.match(cdataPattern);
  if (cdataMatch) return cdataMatch[1].trim();

  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(pattern);
  return match ? match[1].trim() : "";
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

function timeAgo(dateStr: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  } catch {
    return "";
  }
}

function parseItems(xml: string): { title: string; link: string; time: string }[] {
  const items: { title: string; link: string; time: string }[] = [];
  const itemPattern = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(xml)) !== null && items.length < 15) {
    const itemXml = match[1];
    const title = cleanHTML(extractTagContent(itemXml, "title"));
    const link = extractTagContent(itemXml, "link") || "";
    const pubDate = extractTagContent(itemXml, "pubDate");

    if (title && title.length > 5) {
      items.push({
        title,
        link,
        time: pubDate ? timeAgo(pubDate) : "",
      });
    }
  }

  return items;
}

async function fetchFeed(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MenaWatch/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const feed = req.nextUrl.searchParams.get("feed") || "saudi";
  const config = FEEDS[feed];

  if (!config) {
    return NextResponse.json({ items: [], error: "Unknown feed" }, { status: 400 });
  }

  // Try each source in order — return first one that produces results
  const errors: string[] = [];

  for (const source of config.sources) {
    const xml = await fetchFeed(source.url);
    if (!xml) {
      errors.push(`${source.name}: fetch failed`);
      continue;
    }

    const items = parseItems(xml);
    if (items.length > 0) {
      return NextResponse.json({
        items,
        feed: config.label,
        source: source.name,
        count: items.length,
      });
    }
    errors.push(`${source.name}: no items parsed`);
  }

  // If all sources fail, return empty with debug info
  return NextResponse.json({
    items: [],
    feed: config.label,
    error: `All ${config.sources.length} sources failed`,
    debug: errors,
  });
}
