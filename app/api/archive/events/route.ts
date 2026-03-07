import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";

/**
 * GET /api/archive/events — أحداث تاريخية بفلاتر
 * Query: country, type, from, to, impact_min, q (search), limit, offset, sort
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");
    const type = searchParams.get("type");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const impactMin = searchParams.get("impact_min");
    const q = searchParams.get("q");
    const limit = Math.min(parseInt(searchParams.get("limit") || "30"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");
    const sort = searchParams.get("sort") || "occurred_at";
    const order = searchParams.get("order") || "desc";

    let query = supabaseServer
      .from("archive_events")
      .select("*", { count: "exact" });

    if (country) query = query.eq("country_code", country);
    if (type) query = query.eq("event_type", type);
    if (from) query = query.gte("occurred_at", from);
    if (to) query = query.lte("occurred_at", to);
    if (impactMin) query = query.gte("impact_score", parseInt(impactMin));
    if (q && q.length >= 2) {
      query = query.textSearch("fts", q.split(/\s+/).join(" & "), { type: "plain", config: "simple" });
    }

    const validSorts = ["occurred_at", "impact_score", "created_at"];
    const sortField = validSorts.includes(sort) ? sort : "occurred_at";
    query = query.order(sortField, { ascending: order === "asc" });
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message, events: [] }, { status: 500 });
    }

    return NextResponse.json({
      events: data || [],
      total: count || 0,
      limit, offset,
      hasMore: (offset + limit) < (count || 0),
    }, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, events: [] }, { status: 500 });
  }
}
