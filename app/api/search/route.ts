import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";

const CATEGORIES = ["political", "economic", "security", "health", "energy", "tech", "general"];
const COUNTRIES = [
  "SA", "AE", "QA", "KW", "BH", "OM", "IQ", "EG",
  "JO", "LB", "SY", "YE", "LY", "SD", "IR", "TN", "MA", "DZ", "PS", "IL",
];

/**
 * GET /api/search — بحث شامل في المقالات والتقارير
 *
 * Query params:
 * - q: نص البحث (مطلوب، 2 أحرف على الأقل)
 * - category: تصفية بالفئة
 * - country: تصفية بالدولة (ISO code)
 * - type: articles | reports | all (default: all)
 * - from: تاريخ البداية (YYYY-MM-DD)
 * - to: تاريخ النهاية (YYYY-MM-DD)
 * - limit: عدد النتائج (max 50, default 20)
 * - offset: pagination offset
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const category = searchParams.get("category");
    const country = searchParams.get("country");
    const type = searchParams.get("type") || "all";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    if (q.length < 2) {
      return NextResponse.json({ error: "البحث يتطلب حرفين على الأقل", results: [], total: 0 }, { status: 400 });
    }

    const results: any[] = [];
    let totalArticles = 0;
    let totalReports = 0;

    // ── Search articles ──
    if (type === "all" || type === "articles") {
      let query = supabaseServer
        .from("articles")
        .select("id, title, description, link, thumbnail, source_name, pub_date, category, country_codes, sentiment_label", { count: "exact" })
        .eq("is_published", true)
        .textSearch("fts", q.split(/\s+/).join(" & "), { type: "plain", config: "simple" });

      if (category && CATEGORIES.includes(category)) {
        query = query.eq("category", category);
      }
      if (country && COUNTRIES.includes(country)) {
        query = query.contains("country_codes", [country]);
      }
      if (from) query = query.gte("pub_date", from);
      if (to) query = query.lte("pub_date", to + "T23:59:59Z");

      query = query.order("pub_date", { ascending: false });

      if (type === "articles") {
        query = query.range(offset, offset + limit - 1);
      } else {
        query = query.limit(limit);
      }

      const { data, count, error } = await query;
      if (!error && data) {
        totalArticles = count || 0;
        data.forEach(a => {
          results.push({
            type: "article",
            id: a.id,
            title: a.title,
            description: a.description,
            link: a.link,
            thumbnail: a.thumbnail,
            source: a.source_name,
            date: a.pub_date,
            category: a.category,
            countries: a.country_codes,
            sentiment: a.sentiment_label,
          });
        });
      }
    }

    // ── Search daily_reports ──
    if (type === "all" || type === "reports") {
      // Try text search on daily_reports (if fts column exists)
      let rQuery = supabaseServer
        .from("daily_reports")
        .select("id, report_date, executive_summary, status", { count: "exact" });

      // Use ilike as fallback since daily_reports may not have fts column
      rQuery = rQuery.or(`executive_summary.ilike.%${q}%`);

      if (from) rQuery = rQuery.gte("report_date", from);
      if (to) rQuery = rQuery.lte("report_date", to);
      rQuery = rQuery.eq("status", "sent");
      rQuery = rQuery.order("report_date", { ascending: false });

      if (type === "reports") {
        rQuery = rQuery.range(offset, offset + limit - 1);
      } else {
        rQuery = rQuery.limit(Math.max(5, limit - results.length));
      }

      const { data: rData, count: rCount, error: rError } = await rQuery;
      if (!rError && rData) {
        totalReports = rCount || 0;
        rData.forEach(r => {
          results.push({
            type: "report",
            id: r.id,
            title: `تقرير ${r.report_date}`,
            description: r.executive_summary?.slice(0, 200) || "",
            link: null,
            thumbnail: null,
            source: "MENA Watch",
            date: r.report_date,
            category: null,
            countries: [],
            sentiment: null,
          });
        });
      }
    }

    // Sort combined results by date
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const total = type === "articles" ? totalArticles : type === "reports" ? totalReports : totalArticles + totalReports;

    return NextResponse.json({
      results,
      total,
      limit,
      offset,
      query: q,
      hasMore: offset + limit < total,
      breakdown: { articles: totalArticles, reports: totalReports },
    }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, results: [], total: 0 }, { status: 500 });
  }
}
