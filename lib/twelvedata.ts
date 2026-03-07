const BASE = "https://api.twelvedata.com";
const KEY = process.env.TWELVE_DATA_API_KEY;

export async function getQuote(symbol: string) {
  const res = await fetch(`${BASE}/quote?symbol=${symbol}&apikey=${KEY}`);
  return res.json();
}

export async function getBatchQuotes(symbols: string[]) {
  const sym = symbols.join(",");
  const res = await fetch(`${BASE}/price?symbol=${sym}&apikey=${KEY}`);
  return res.json();
}

export async function getForexRate(from: string, to: string) {
  const res = await fetch(`${BASE}/exchange_rate?symbol=${from}/${to}&apikey=${KEY}`);
  return res.json();
}
