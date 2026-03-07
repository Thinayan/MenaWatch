import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/archive/import
 * Admin-only: Bulk import events or indicators
 * Body: { type: "events" | "indicators", data: Array }
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(c) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
        },
      }
    );

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "غير مسجل الدخول" }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const body = await req.json();
    const { type, data } = body;

    if (!type || !data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "البيانات مفقودة أو فارغة" }, { status: 400 });
    }

    if (type === "events") {
      return await importEvents(supabase, data);
    } else if (type === "indicators") {
      return await importIndicators(supabase, data);
    } else {
      return NextResponse.json({ error: "نوع غير معروف: events أو indicators فقط" }, { status: 400 });
    }
  } catch (e: any) {
    console.error("Import error:", e);
    return NextResponse.json({ error: e.message || "خطأ في الاستيراد" }, { status: 500 });
  }
}

async function importEvents(supabase: any, data: any[]) {
  const validEvents = data.map((e, i) => {
    if (!e.title_ar || !e.country_code || !e.event_type || !e.occurred_at) {
      throw new Error(`حدث #${i + 1}: الحقول المطلوبة: title_ar, country_code, event_type, occurred_at`);
    }
    return {
      title_ar: e.title_ar,
      title_en: e.title_en || null,
      description_ar: e.description_ar || null,
      description_en: e.description_en || null,
      country_code: e.country_code.toUpperCase(),
      event_type: e.event_type,
      occurred_at: e.occurred_at,
      impact_score: Math.min(10, Math.max(1, Number(e.impact_score) || 5)),
      why_it_happened: e.why_it_happened || null,
      what_it_means: e.what_it_means || null,
      source_urls: Array.isArray(e.source_urls) ? e.source_urls : [],
      tags: Array.isArray(e.tags) ? e.tags : [],
    };
  });

  // Batch insert (upsert on title_ar + occurred_at)
  let inserted = 0;
  let errors: string[] = [];
  const BATCH = 50;

  for (let i = 0; i < validEvents.length; i += BATCH) {
    const batch = validEvents.slice(i, i + BATCH);
    const { data: result, error } = await supabase
      .from("archive_events")
      .upsert(batch, { onConflict: "title_ar,occurred_at", ignoreDuplicates: true })
      .select("id");

    if (error) {
      errors.push(`دفعة ${Math.floor(i / BATCH) + 1}: ${error.message}`);
    } else {
      inserted += result?.length || 0;
    }
  }

  return NextResponse.json({
    success: true,
    type: "events",
    total: validEvents.length,
    inserted,
    errors: errors.length > 0 ? errors : undefined,
  });
}

async function importIndicators(supabase: any, data: any[]) {
  const validIndicators = data.map((ind, i) => {
    if (!ind.country_code || !ind.indicator_key || !ind.period || ind.value === undefined) {
      throw new Error(`مؤشر #${i + 1}: الحقول المطلوبة: country_code, indicator_key, period, value`);
    }
    return {
      country_code: ind.country_code.toUpperCase(),
      indicator_key: ind.indicator_key,
      indicator_name_ar: ind.indicator_name_ar || ind.indicator_key,
      indicator_name_en: ind.indicator_name_en || ind.indicator_key,
      value: Number(ind.value),
      unit: ind.unit || "",
      period: ind.period,
      source: ind.source || "import",
    };
  });

  let inserted = 0;
  let errors: string[] = [];
  const BATCH = 100;

  for (let i = 0; i < validIndicators.length; i += BATCH) {
    const batch = validIndicators.slice(i, i + BATCH);
    const { data: result, error } = await supabase
      .from("archive_indicators")
      .upsert(batch, {
        onConflict: "country_code,indicator_key,period",
        ignoreDuplicates: false,
      })
      .select("id");

    if (error) {
      errors.push(`دفعة ${Math.floor(i / BATCH) + 1}: ${error.message}`);
    } else {
      inserted += result?.length || 0;
    }
  }

  return NextResponse.json({
    success: true,
    type: "indicators",
    total: validIndicators.length,
    inserted,
    errors: errors.length > 0 ? errors : undefined,
  });
}
