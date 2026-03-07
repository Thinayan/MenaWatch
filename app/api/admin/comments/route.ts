import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseServer } from "../../../../lib/supabase-server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
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
 * GET /api/admin/comments — List all comments for moderation
 */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  try {
    const { data, error } = await supabaseServer
      .from("comments")
      .select(`
        id, content, created_at, is_approved, is_hidden, user_id, article_id, report_id, parent_id,
        profiles(full_name, email),
        articles(title)
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message, comments: [] }, { status: 500, headers: CORS_HEADERS });
    }

    const comments = (data || []).map((c: any) => ({
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      is_approved: c.is_approved,
      is_hidden: c.is_hidden,
      user_id: c.user_id,
      user_name: c.profiles?.full_name || c.profiles?.email?.split("@")[0] || "مستخدم",
      article_id: c.article_id,
      article_title: c.articles?.title || null,
      report_id: c.report_id,
      parent_id: c.parent_id,
    }));

    return NextResponse.json({ comments }, { headers: CORS_HEADERS });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, comments: [] }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * PUT /api/admin/comments — Update comment status (approve/hide/unhide/delete)
 * Body: { id, action: "approve"|"hide"|"unhide"|"delete" }
 */
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  try {
    const { id, action } = await req.json();
    if (!id || !action) {
      return NextResponse.json({ error: "id and action required" }, { status: 400, headers: CORS_HEADERS });
    }

    if (action === "approve") {
      await supabaseServer.from("comments").update({ is_approved: true, is_hidden: false }).eq("id", id);
    } else if (action === "hide") {
      await supabaseServer.from("comments").update({ is_hidden: true }).eq("id", id);
    } else if (action === "unhide") {
      await supabaseServer.from("comments").update({ is_hidden: false }).eq("id", id);
    } else if (action === "delete") {
      await supabaseServer.from("comments").delete().eq("id", id);
    }

    return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
