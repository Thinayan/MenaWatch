import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function getSupabase(cookieStore: ReturnType<typeof cookies>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {}, // Read-only in API routes
    },
  });
}

/**
 * GET /api/comments — Fetch comments for an article or report
 *
 * Query params:
 *   article_id — UUID of article
 *   report_id  — ID of daily report
 *   limit      — items per page (default 50, max 100)
 *   offset     — pagination offset
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get("article_id");
  const reportId = searchParams.get("report_id");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  if (!articleId && !reportId) {
    return NextResponse.json(
      { error: "article_id or report_id is required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const cookieStore = await cookies();
  const supabase = getSupabase(cookieStore);
  if (!supabase) {
    return NextResponse.json({ comments: [], total: 0 }, { headers: CORS_HEADERS });
  }

  try {
    let query = supabase
      .from("comments")
      .select(`
        id, content, created_at, parent_id,
        user_id,
        profiles!inner(full_name, email, role)
      `, { count: "exact" })
      .eq("is_approved", true)
      .eq("is_hidden", false)
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (articleId) {
      query = query.eq("article_id", articleId);
    } else {
      query = query.eq("report_id", reportId);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message, comments: [] },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Format comments with user info
    const comments = (data || []).map((c: any) => ({
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      parent_id: c.parent_id,
      user: {
        id: c.user_id,
        name: c.profiles?.full_name || c.profiles?.email?.split("@")[0] || "مستخدم",
        role: c.profiles?.role || "free",
      },
    }));

    return NextResponse.json(
      { comments, total: count || 0 },
      { headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message, comments: [] },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * POST /api/comments — Add a new comment (authenticated)
 *
 * Body: { article_id?, report_id?, parent_id?, content }
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = getSupabase(cookieStore);
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 500, headers: CORS_HEADERS });
  }

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول لإضافة تعليق" }, { status: 401, headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { article_id, report_id, parent_id, content } = body;

    // Validate
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "محتوى التعليق مطلوب" }, { status: 400, headers: CORS_HEADERS });
    }
    if (content.length > 1000) {
      return NextResponse.json({ error: "التعليق يجب ألا يتجاوز 1000 حرف" }, { status: 400, headers: CORS_HEADERS });
    }
    if (!article_id && !report_id) {
      return NextResponse.json({ error: "article_id or report_id is required" }, { status: 400, headers: CORS_HEADERS });
    }

    // Check rate limit (max 10 comments per hour per user)
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count } = await supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneHourAgo);

    if ((count || 0) >= 10) {
      return NextResponse.json(
        { error: "لقد تجاوزت الحد الأقصى للتعليقات (10 تعليقات في الساعة)" },
        { status: 429, headers: CORS_HEADERS }
      );
    }

    // Insert comment (auto-approve for pro/admin users)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const autoApprove = profile?.role === "admin" || profile?.role === "pro";

    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        article_id: article_id || null,
        report_id: report_id || null,
        parent_id: parent_id || null,
        content: content.trim(),
        is_approved: autoApprove,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    }

    return NextResponse.json({
      comment: data,
      message: autoApprove ? "تم إضافة التعليق" : "تم إرسال التعليق وسيظهر بعد الموافقة",
    }, { status: 201, headers: CORS_HEADERS });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * DELETE /api/comments?id=UUID — Delete own comment
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("id");

  if (!commentId) {
    return NextResponse.json({ error: "comment id is required" }, { status: 400, headers: CORS_HEADERS });
  }

  const cookieStore = await cookies();
  const supabase = getSupabase(cookieStore);
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 500, headers: CORS_HEADERS });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401, headers: CORS_HEADERS });
  }

  // RLS handles permission check
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
  }

  return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
