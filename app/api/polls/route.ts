import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseServer } from "../../../lib/supabase-server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function getSupabase(cookieStore: ReturnType<typeof cookies>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {},
    },
  });
}

/**
 * GET /api/polls — Fetch active polls
 *
 * Query params:
 *   category — filter by category
 *   limit    — items per page (default 5)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 20);

  try {
    let query = supabaseServer
      .from("polls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message, polls: [] }, { status: 500, headers: CORS_HEADERS });
    }

    // Check if current user has voted on each poll
    const cookieStore = await cookies();
    const supabase = getSupabase(cookieStore);
    let userVotes: Record<string, string> = {};

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && data?.length) {
        const pollIds = data.map((p: any) => p.id);
        const { data: votes } = await supabase
          .from("poll_votes")
          .select("poll_id, option_id")
          .eq("user_id", user.id)
          .in("poll_id", pollIds);

        if (votes) {
          for (const v of votes) {
            userVotes[v.poll_id] = v.option_id;
          }
        }
      }
    }

    // Get vote counts per option for each poll
    const pollsWithResults = await Promise.all(
      (data || []).map(async (poll: any) => {
        const { data: votes } = await supabaseServer
          .from("poll_votes")
          .select("option_id");

        // Actually, let's count votes properly
        const { data: pollVotes } = await supabaseServer
          .from("poll_votes")
          .select("option_id")
          .eq("poll_id", poll.id);

        const voteCounts: Record<string, number> = {};
        for (const v of (pollVotes || [])) {
          voteCounts[v.option_id] = (voteCounts[v.option_id] || 0) + 1;
        }

        return {
          ...poll,
          vote_counts: voteCounts,
          user_vote: userVotes[poll.id] || null,
        };
      })
    );

    return NextResponse.json(
      { polls: pollsWithResults },
      { headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message, polls: [] }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * POST /api/polls — Create a new poll (admin only)
 *
 * Body: { question, options: [{id, text}], category?, ends_at? }
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = getSupabase(cookieStore);
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 500, headers: CORS_HEADERS });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401, headers: CORS_HEADERS });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "صلاحيات الأدمن مطلوبة" }, { status: 403, headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { question, options, category, ends_at } = body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: "السؤال وخيارات (على الأقل 2) مطلوبة" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { data, error } = await supabaseServer
      .from("polls")
      .insert({
        question,
        options,
        category: category || "general",
        ends_at: ends_at || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
    }

    return NextResponse.json({ poll: data }, { status: 201, headers: CORS_HEADERS });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
