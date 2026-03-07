import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "news";
  const q = searchParams.get("q") || "Saudi Arabia UAE Middle East oil OPEC";

  if (type === "news") {
    try {
      const params = new URLSearchParams({
        query: q,
        mode: "artlist",
        maxrecords: "15",
        format: "json",
        sort: "DateDesc",
      });
      const res = await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?${params}`, {
        next: { revalidate: 300 },
      });
      const data = await res.json();
      return NextResponse.json({ articles: data.articles || [], source: "gdelt" });
    } catch {
      return NextResponse.json({ articles: [], source: "error" });
    }
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}
