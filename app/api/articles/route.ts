import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * GET /api/articles — Fetch articles with filters + pagination
 *
 * Query params:
 *   category   — political/economic/security/health/energy/tech/general
 *   country    — ISO country code (SA, AE, EG, etc.)
 *   source     — source_key (alarabiya, gdelt, etc.)
 *   search     — full-text search query
 *   featured   — true/false
 *   limit      — items per page (default 20, max 100)
 *   offset     — pagination offset (default 0)
 *   sort       — pub_date (default) or sentiment_score
 *   order      — desc (default) or asc
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const country = searchParams.get("country");
  const source = searchParams.get("source");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");
  const sort = searchParams.get("sort") || "pub_date";
  const order = searchParams.get("order") || "desc";

  try {
    let query = supabaseServer
      .from("articles")
      .select("*", { count: "exact" })
      .eq("is_published", true);

    // Apply filters
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (country) {
      query = query.contains("country_codes", [country]);
    }

    if (source) {
      query = query.eq("source_key", source);
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    // Full-text search
    if (search) {
      query = query.textSearch("fts", search, { type: "plain" });
    }

    // Sorting
    const ascending = order === "asc";
    if (sort === "sentiment_score") {
      query = query.order("sentiment_score", { ascending });
    } else {
      query = query.order("pub_date", { ascending });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message, articles: [] },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        articles: data || [],
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
      {
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message, articles: [] },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
