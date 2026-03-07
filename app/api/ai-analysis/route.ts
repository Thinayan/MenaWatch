import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }); }

export async function POST(req: NextRequest) {
  try {
    const { name, risk, trend, detail } = await req.json();

    if (!name || risk === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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
    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "تعذّر الاتصال بمحرك التحليل" },
      { status: 500 }
    );
  }
}
