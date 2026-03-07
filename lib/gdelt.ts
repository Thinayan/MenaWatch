const GDELT_BASE = "https://api.gdeltproject.org/api/v2";

export interface GDELTArticle {
  url: string;
  title: string;
  seendate: string;
  domain: string;
  sourcecountry: string;
  language: string;
  tone: number;
}

export async function fetchGDELTNews(query: string, maxRecords = 10): Promise<GDELTArticle[]> {
  const params = new URLSearchParams({
    query: query,
    mode: "artlist",
    maxrecords: String(maxRecords),
    format: "json",
    sort: "DateDesc",
  });
  try {
    const res = await fetch(`${GDELT_BASE}/doc/doc?${params}`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.articles || [];
  } catch {
    return [];
  }
}

export async function fetchGDELTGeo(country: string) {
  const params = new URLSearchParams({
    query: `sourcecountry:${country}`,
    mode: "tonechart",
    format: "json",
  });
  try {
    const res = await fetch(`${GDELT_BASE}/doc/doc?${params}`, { next: { revalidate: 600 } });
    return res.json();
  } catch {
    return null;
  }
}
