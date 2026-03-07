import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";

/**
 * GET /api/archive/compare — مقارنة بين دولتين
 * Query: country1, country2, indicator (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const c1 = searchParams.get("country1") || "SA";
    const c2 = searchParams.get("country2") || "AE";
    const indicator = searchParams.get("indicator");

    // Fetch indicators for both countries
    let q1 = supabaseServer.from("archive_indicators").select("*").eq("country_code", c1).order("period", { ascending: true });
    let q2 = supabaseServer.from("archive_indicators").select("*").eq("country_code", c2).order("period", { ascending: true });

    if (indicator) {
      q1 = q1.eq("indicator_key", indicator);
      q2 = q2.eq("indicator_key", indicator);
    }

    const [r1, r2] = await Promise.all([q1, q2]);

    // Fetch event counts for both
    const [e1, e2] = await Promise.all([
      supabaseServer.from("archive_events").select("event_type", { count: "exact" }).eq("country_code", c1),
      supabaseServer.from("archive_events").select("event_type", { count: "exact" }).eq("country_code", c2),
    ]);

    return NextResponse.json({
      country1: { code: c1, indicators: r1.data || [], eventCount: e1.count || 0 },
      country2: { code: c2, indicators: r2.data || [], eventCount: e2.count || 0 },
    }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
