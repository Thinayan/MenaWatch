import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * POST /api/polls/vote — Cast a vote on a poll
 *
 * Body: { poll_id, option_id }
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 500, headers: CORS_HEADERS });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {},
    },
  });

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "يجب تسجيل الدخول للتصويت" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  try {
    const body = await req.json();
    const { poll_id, option_id } = body;

    if (!poll_id || !option_id) {
      return NextResponse.json(
        { error: "poll_id and option_id are required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Verify poll exists and is active
    const { data: poll } = await supabase
      .from("polls")
      .select("id, options, is_active, ends_at")
      .eq("id", poll_id)
      .single();

    if (!poll) {
      return NextResponse.json({ error: "الاستطلاع غير موجود" }, { status: 404, headers: CORS_HEADERS });
    }

    if (!poll.is_active) {
      return NextResponse.json({ error: "الاستطلاع مغلق" }, { status: 400, headers: CORS_HEADERS });
    }

    if (poll.ends_at && new Date(poll.ends_at) < new Date()) {
      return NextResponse.json({ error: "انتهت مدة الاستطلاع" }, { status: 400, headers: CORS_HEADERS });
    }

    // Verify option_id exists in poll options
    const validOption = poll.options?.some((o: any) => o.id === option_id);
    if (!validOption) {
      return NextResponse.json({ error: "خيار غير صالح" }, { status: 400, headers: CORS_HEADERS });
    }

    // Insert vote (UNIQUE constraint prevents duplicate voting)
    const { error } = await supabase
      .from("poll_votes")
      .insert({
        poll_id,
        user_id: user.id,
        option_id,
      });

    if (error) {
      if (error.code === "23505") { // Unique violation
        return NextResponse.json(
          { error: "لقد صوّتت في هذا الاستطلاع من قبل" },
          { status: 409, headers: CORS_HEADERS }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    }

    return NextResponse.json(
      { success: true, message: "تم تسجيل صوتك بنجاح" },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
