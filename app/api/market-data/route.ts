import { NextResponse } from "next/server";

const FALLBACK = {
  markets: [
    { id: "tasi", name: "تاسي", val: "12,847", chg: "+0.41%", up: true, flag: "🇸🇦" },
    { id: "dfm", name: "دبي DFM", val: "4,312", chg: "+0.28%", up: true, flag: "🇦🇪" },
    { id: "adx", name: "أبوظبي ADX", val: "9,124", chg: "-0.12%", up: false, flag: "🇦🇪" },
    { id: "qe", name: "قطر QE", val: "10,218", chg: "+0.18%", up: true, flag: "🇶🇦" },
    { id: "bhb", name: "البحرين BHB", val: "1,904", chg: "+0.05%", up: true, flag: "🇧🇭" },
    { id: "msm", name: "مسقط MSM", val: "4,587", chg: "-0.08%", up: false, flag: "🇴🇲" },
  ],
  stocks: [
    { name: "أرامكو", sym: "2222", sector: "طاقة", val: "28.40", chg: "+0.5%", up: true },
    { name: "سابك", sym: "2010", sector: "بتروكيماويات", val: "73.80", chg: "-0.3%", up: false },
    { name: "الراجحي", sym: "1120", sector: "بنوك", val: "84.50", chg: "+1.2%", up: true },
    { name: "STC", sym: "7010", sector: "اتصالات", val: "43.70", chg: "+0.8%", up: true },
    { name: "معادن", sym: "1211", sector: "مناجم", val: "56.90", chg: "+2.1%", up: true },
  ],
  currencies: [
    { pair: "USD/SAR", val: "3.7500", chg: "+0.01%", up: true },
    { pair: "EUR/SAR", val: "4.0420", chg: "-0.08%", up: false },
    { pair: "GBP/SAR", val: "4.7210", chg: "+0.12%", up: true },
    { pair: "AED/SAR", val: "1.0203", chg: "0.00%", up: null },
    { pair: "KWD/SAR", val: "12.187", chg: "+0.03%", up: true },
    { pair: "BTC/USD", val: "67,420", chg: "+2.40%", up: true },
  ],
  source: "fallback",
  timestamp: new Date().toISOString(),
};

export async function GET() {
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(FALLBACK, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  }

  try {
    const symbols = ["USD/SAR", "EUR/SAR", "BTC/USD"].join(",");
    const res = await fetch(`https://api.twelvedata.com/price?symbol=${symbols}&apikey=${apiKey}`, {
      next: { revalidate: 60 },
    });
    const prices = await res.json();

    const currencies = [
      { pair: "USD/SAR", val: prices["USD/SAR"]?.price ? parseFloat(prices["USD/SAR"].price).toFixed(4) : "3.7500", chg: "+0.01%", up: true },
      { pair: "EUR/SAR", val: prices["EUR/SAR"]?.price ? parseFloat(prices["EUR/SAR"].price).toFixed(4) : "4.0420", chg: "-0.08%", up: false },
      { pair: "AED/SAR", val: "1.0203", chg: "0.00%", up: null },
      { pair: "KWD/SAR", val: "12.187", chg: "+0.03%", up: true },
      { pair: "GBP/SAR", val: "4.7210", chg: "+0.12%", up: true },
      { pair: "BTC/USD", val: prices["BTC/USD"]?.price ? parseFloat(prices["BTC/USD"].price).toLocaleString() : "67,420", chg: "+2.40%", up: true },
    ];

    return NextResponse.json({ ...FALLBACK, currencies, source: "live" }, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch {
    return NextResponse.json(FALLBACK, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  }
}
