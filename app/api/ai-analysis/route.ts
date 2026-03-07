import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }); }

const FREE_AI_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    const { name, risk, trend, detail } = await req.json();

    if (!name || risk === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check AI usage limits for free users
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      });

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, ai_uses_today, last_ai_reset")
          .eq("id", user.id)
          .single();

        if (profile) {
          const today = new Date().toISOString().split("T")[0];
          let usesToday = profile.ai_uses_today || 0;

          // Reset counter if new day
          if (profile.last_ai_reset !== today) {
            usesToday = 0;
            await supabase.from("profiles").update({
              ai_uses_today: 0,
              last_ai_reset: today,
            }).eq("id", user.id);
          }

          // Check limit for free users only
          if (profile.role === "free" || !profile.role) {
            if (usesToday >= FREE_AI_LIMIT) {
              return NextResponse.json(
                { error: "وصلت للحد اليومي — ترقّ للخطة المدفوعة للحصول على تحليلات غير محدودة", limit_reached: true },
                { status: 429 }
              );
            }
          }

          // Increment counter after successful analysis (done below)
        }
      }
    }

    const response = await getAnthropic().messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "أنت محلل استراتيجي متخصص في شؤون الشرق الأوسط. قدم تحليلاً موجزاً ودقيقاً في 3 نقاط قصيرة.",
      messages: [{
        role: "user",
        content: `حلّل الوضع في: ${name}\nمستوى الخطر: ${risk}/100\nالاتجاه: ${trend}\nالتفاصيل: ${detail}\n\nقدم تحليلاً استراتيجياً موجزاً في 3 نقاط (الوضع الراهن، المخاطر الرئيسية، الفرص المحتملة).`
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Increment AI usage counter after successful analysis
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase2 = createServerClient(supabaseUrl, supabaseKey, {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll() {},
          },
        });
        const { data: { user: u2 } } = await supabase2.auth.getUser();
        if (u2) {
          const today = new Date().toISOString().split("T")[0];
          const { data: p2 } = await supabase2.from("profiles").select("ai_uses_today").eq("id", u2.id).single();
          await supabase2.from("profiles").update({
            ai_uses_today: (p2?.ai_uses_today || 0) + 1,
            last_ai_reset: today,
          }).eq("id", u2.id);
        }
      } catch (e) {
        // Non-critical, don't fail the response
      }
    }

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "تعذّر الاتصال بمحرك التحليل" },
      { status: 500 }
    );
  }
}
