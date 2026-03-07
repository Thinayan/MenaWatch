import { NextRequest, NextResponse } from "next/server";

/**
 * RSS Bar API — Fetches specific RSS feeds for the header news bars
 * Supports: saudi (Saudi Today), markets (Aswaq)
 */

const FEEDS: Record<string, { url: string; name: string }> = {
  saudi: {
    url: "https://www.alarabiya.net/feed/rss2/ar/saudi-today.xml",
    name: "العربية — أخبار السعودية",
  },
  markets: {
    url: "https://www.alarabiya.net/feed/rss2/ar/aswaq.xml",
    name: "العربية — الأسواق",
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

export async function GET(req: NextRequest) {
  const feed = req.nextUrl.searchParams.get("feed") || "saudi";
  const config = FEEDS[feed];

  if (!config) {
    return NextResponse.json({ items: [], error: "Unknown feed" }, { status: 400 });
  }

  try {
    const res = await fetch(config.url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent": "MenaWatch/1.0",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: 300 }, // cache 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json({ items: [], error: `Feed returned ${res.status}` });
    }

    const xml = await res.text();
    const items: { title: string; link: string; time: string }[] = [];

    const itemPattern = /<item[\s>]([\s\S]*?)<\/item>/gi;
    let match: RegExpExecArray | null;

    while ((match = itemPattern.exec(xml)) !== null && items.length < 20) {
      const itemXml = match[1];
      const title = cleanHTML(extractTagContent(itemXml, "title"));
      const link = extractTagContent(itemXml, "link") || "";
      const pubDate = extractTagContent(itemXml, "pubDate");

      if (title && link) {
        items.push({
          title,
          link,
          time: pubDate ? timeAgo(pubDate) : "",
        });
      }
    }

    return NextResponse.json({
      items,
      feed: config.name,
      count: items.length,
    });
  } catch (e: any) {
    return NextResponse.json({ items: [], error: e.message });
  }
}
