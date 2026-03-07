import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseServer } from "../../../../lib/supabase-server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function requireAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return user;
}

/**
 * GET /api/admin/team — جميع الأعضاء (بما فيهم غير النشطين)
 */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  try {
    const { data, error } = await supabaseServer
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message, members: [] }, { status: 500, headers: CORS_HEADERS });
    }

    return NextResponse.json({ members: data || [] }, { headers: CORS_HEADERS });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, members: [] }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * POST /api/admin/team — إضافة عضو جديد
 */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { name_ar, title_ar, name_en, title_en, bio_ar, bio_en, photo_url, linkedin, twitter, display_order } = body;

    if (!name_ar || !title_ar) {
      return NextResponse.json({ error: "name_ar و title_ar مطلوبان" }, { status: 400, headers: CORS_HEADERS });
    }

    const { data, error } = await supabaseServer
      .from("team_members")
      .insert({
        name_ar, title_ar,
        name_en: name_en || null,
        title_en: title_en || null,
        bio_ar: bio_ar || null,
        bio_en: bio_en || null,
        photo_url: photo_url || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        display_order: display_order || 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    }

    return NextResponse.json({ member: data, success: true }, { headers: CORS_HEADERS });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * PUT /api/admin/team — تعديل عضو
 * Body: { id, ...fields }
 */
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "id مطلوب" }, { status: 400, headers: CORS_HEADERS });
    }

    const { error } = await supabaseServer
      .from("team_members")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    }

    return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * DELETE /api/admin/team — حذف عضو
 * Body: { id }
 */
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id مطلوب" }, { status: 400, headers: CORS_HEADERS });
    }

    const { error } = await supabaseServer
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    }

    return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
