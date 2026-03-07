import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";

/**
 * GET /api/archive/indicators — مؤشرات زمنية للرسوم البيانية
 * Query: country, indicator, from, to
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country") || "SA";
    const indicator = searchParams.get("indicator");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = supabaseServer
      .from("archive_indicators")
      .select("*")
      .eq("country_code", country);

    if (indicator) query = query.eq("indicator_key", indicator);
    if (from) query = query.gte("period", from);
    if (to) query = query.lte("period", to);
    query = query.order("period", { ascending: true });

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message, indicators: [] }, { status: 500 });
    }

    return NextResponse.json({
      indicators: data || [],
      country,
    }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, indicators: [] }, { status: 500 });
  }
}
