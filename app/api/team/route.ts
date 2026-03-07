import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";

/**
 * GET /api/team — الأعضاء النشطين مرتبين حسب display_order
 */
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseServer
      .from("team_members")
      .select("id, name_ar, name_en, title_ar, title_en, bio_ar, bio_en, photo_url, linkedin, twitter, display_order")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      // If table doesn't exist yet, return empty gracefully
      return NextResponse.json({ members: [] }, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" }
      });
    }

    return NextResponse.json({ members: data || [] }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" }
    });
  } catch (e: any) {
    return NextResponse.json({ members: [], error: e.message }, { status: 500 });
  }
}
