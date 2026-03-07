/**
 * تحويل الأرقام الهندية (٠١٢٣٤٥٦٧٨٩) إلى أرقام غربية (0123456789)
 * يُستخدم مع مخرجات Intl.DateTimeFormat و toLocaleDateString("ar-*")
 */
export function toWestern(str: string | number | null | undefined): string {
  if (str == null) return "";
  return String(str).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
}

/**
 * تنسيق رقم بالفواصل الغربية: 2,347
 */
export function formatNum(n: number | string): string {
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(num)) return String(n);
  return num.toLocaleString("en-US");
}

/**
 * تنسيق تاريخ عربي بأرقام غربية
 */
export function formatDateAr(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const raw = d.toLocaleDateString("ar-EG", { timeZone: "Asia/Riyadh", ...opts });
  return toWestern(raw);
}
