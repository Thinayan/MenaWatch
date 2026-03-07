"use client";
import { useState } from "react";

/**
 * ArchiveImporter — Admin tool for bulk importing archive events & indicators
 * Supports JSON paste, file upload (JSON/CSV), and manual entry
 */
export default function ArchiveImporter() {
  const [mode, setMode] = useState("events"); // events | indicators
  const [inputMethod, setInputMethod] = useState("paste"); // paste | file | manual
  const [jsonText, setJsonText] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Manual event form
  const [manualEvent, setManualEvent] = useState({
    title_ar: "", title_en: "", description_ar: "", description_en: "",
    country_code: "SA", event_type: "political", occurred_at: "",
    impact_score: 5, why_it_happened: "", what_it_means: "",
    tags: "",
  });

  // Manual indicator form
  const [manualIndicator, setManualIndicator] = useState({
    country_code: "SA", indicator_key: "gdp", indicator_name_ar: "",
    indicator_name_en: "", value: "", unit: "", period: "", source: "",
  });

  const handleImport = async (data) => {
    setImporting(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/archive/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: mode, data }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setResult(d);
    } catch (e) {
      setError(e.message);
    }
    setImporting(false);
  };

  const handlePasteImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      handleImport(arr);
    } catch {
      setError("صيغة JSON غير صالحة");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        if (file.name.endsWith(".csv")) {
          const parsed = parseCSV(text);
          handleImport(parsed);
        } else {
          const parsed = JSON.parse(text);
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          handleImport(arr);
        }
      } catch {
        setError("خطأ في قراءة الملف");
      }
    };
    reader.readAsText(file);
  };

  const handleManualSubmit = () => {
    if (mode === "events") {
      const ev = {
        ...manualEvent,
        impact_score: Number(manualEvent.impact_score),
        tags: manualEvent.tags ? manualEvent.tags.split(",").map(t => t.trim()) : [],
        source_urls: [],
      };
      handleImport([ev]);
    } else {
      const ind = {
        ...manualIndicator,
        value: Number(manualIndicator.value),
      };
      handleImport([ind]);
    }
  };

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV فارغ");
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
    return lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
      const obj = {};
      headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
      return obj;
    });
  };

  const inputStyle = {
    width: "100%", padding: "8px 12px", background: "#060d18",
    border: "1px solid #1e293b", borderRadius: 6, color: "#e2e8f0",
    fontSize: 12, fontFamily: "inherit",
  };

  const btnStyle = (active) => ({
    padding: "6px 14px", borderRadius: 6, border: "1px solid",
    borderColor: active ? "#22c55e" : "#1e293b",
    background: active ? "#22c55e18" : "transparent",
    color: active ? "#22c55e" : "#94a3b8",
    fontSize: 11, fontWeight: active ? 700 : 500,
    cursor: "pointer", fontFamily: "inherit",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Mode Selector */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { setMode("events"); setResult(null); setError(null); }} style={btnStyle(mode === "events")}>
          📅 أحداث تاريخية
        </button>
        <button onClick={() => { setMode("indicators"); setResult(null); setError(null); }} style={btnStyle(mode === "indicators")}>
          📊 مؤشرات اقتصادية
        </button>
      </div>

      {/* Input Method */}
      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "paste", label: "📋 لصق JSON" },
          { id: "file", label: "📁 رفع ملف" },
          { id: "manual", label: "✏️ إدخال يدوي" },
        ].map(m => (
          <button key={m.id} onClick={() => { setInputMethod(m.id); setResult(null); setError(null); }}
            style={btnStyle(inputMethod === m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      {/* JSON Template Hint */}
      {inputMethod === "paste" && (
        <div style={{ background: "#080f1c", border: "1px solid #1e293b", borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 8 }}>
            {mode === "events"
              ? "الحقول المطلوبة: title_ar, country_code, event_type, occurred_at"
              : "الحقول المطلوبة: country_code, indicator_key, period, value"}
          </div>
          <textarea
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            placeholder={mode === "events"
              ? '[\n  {\n    "title_ar": "عنوان الحدث",\n    "country_code": "SA",\n    "event_type": "political",\n    "occurred_at": "2024-01-15",\n    "impact_score": 7,\n    "why_it_happened": "السبب",\n    "what_it_means": "الدلالة"\n  }\n]'
              : '[\n  {\n    "country_code": "SA",\n    "indicator_key": "gdp",\n    "value": 833.5,\n    "unit": "مليار $",\n    "period": "2024-01-01",\n    "source": "البنك الدولي"\n  }\n]'
            }
            style={{
              ...inputStyle, minHeight: 180, fontFamily: "'Courier New', monospace",
              fontSize: 11, lineHeight: 1.6, direction: "ltr", resize: "vertical",
            }}
          />
          <button onClick={handlePasteImport} disabled={!jsonText || importing}
            style={{
              marginTop: 10, width: "100%", padding: "10px", borderRadius: 8,
              border: "none", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              cursor: jsonText ? "pointer" : "not-allowed",
              background: jsonText ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#1e293b",
              color: jsonText ? "#fff" : "#64748b",
            }}>
            {importing ? "جارٍ الاستيراد..." : `📥 استيراد ${mode === "events" ? "أحداث" : "مؤشرات"}`}
          </button>
        </div>
      )}

      {/* File Upload */}
      {inputMethod === "file" && (
        <div style={{ background: "#080f1c", border: "1px solid #1e293b", borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 8 }}>
            ارفع ملف JSON أو CSV
          </div>
          <input
            type="file" accept=".json,.csv"
            onChange={handleFileUpload}
            style={{ ...inputStyle, padding: 10 }}
          />
          <div style={{ fontSize: 9, color: "#64748b", marginTop: 6 }}>
            CSV: السطر الأول عناوين الأعمدة، بقية الأسطر البيانات
          </div>
        </div>
      )}

      {/* Manual Entry */}
      {inputMethod === "manual" && mode === "events" && (
        <div style={{ background: "#080f1c", border: "1px solid #1e293b", borderRadius: 8, padding: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>العنوان (عربي) *</label>
              <input value={manualEvent.title_ar} onChange={e => setManualEvent(p => ({ ...p, title_ar: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>العنوان (إنجليزي)</label>
              <input value={manualEvent.title_en} onChange={e => setManualEvent(p => ({ ...p, title_en: e.target.value }))} style={{ ...inputStyle, direction: "ltr" }} />
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>الدولة *</label>
              <select value={manualEvent.country_code} onChange={e => setManualEvent(p => ({ ...p, country_code: e.target.value }))} style={inputStyle}>
                {[["SA","السعودية"],["AE","الإمارات"],["QA","قطر"],["EG","مصر"],["KW","الكويت"],["OM","عمان"],["IQ","العراق"],["JO","الأردن"],["LB","لبنان"],["YE","اليمن"],["SY","سوريا"],["SD","السودان"],["LY","ليبيا"],["IR","إيران"],["BH","البحرين"]].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>النوع *</label>
              <select value={manualEvent.event_type} onChange={e => setManualEvent(p => ({ ...p, event_type: e.target.value }))} style={inputStyle}>
                {[["political","سياسي"],["economic","اقتصادي"],["security","أمني"],["diplomatic","دبلوماسي"],["energy","طاقة"],["social","اجتماعي"],["health","صحي"],["tech","تقني"]].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>التاريخ *</label>
              <input type="date" value={manualEvent.occurred_at} onChange={e => setManualEvent(p => ({ ...p, occurred_at: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>درجة التأثير (1-10)</label>
              <input type="number" min="1" max="10" value={manualEvent.impact_score} onChange={e => setManualEvent(p => ({ ...p, impact_score: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>الوصف (عربي)</label>
              <textarea value={manualEvent.description_ar} onChange={e => setManualEvent(p => ({ ...p, description_ar: e.target.value }))} style={{ ...inputStyle, minHeight: 60 }} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>لماذا حدث؟</label>
              <textarea value={manualEvent.why_it_happened} onChange={e => setManualEvent(p => ({ ...p, why_it_happened: e.target.value }))} style={{ ...inputStyle, minHeight: 60 }} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>ماذا يعني لك؟</label>
              <textarea value={manualEvent.what_it_means} onChange={e => setManualEvent(p => ({ ...p, what_it_means: e.target.value }))} style={{ ...inputStyle, minHeight: 60 }} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>الوسوم (مفصولة بفاصلة)</label>
              <input value={manualEvent.tags} onChange={e => setManualEvent(p => ({ ...p, tags: e.target.value }))} placeholder="رؤية 2030، اقتصاد، نفط" style={inputStyle} />
            </div>
          </div>
          <button onClick={handleManualSubmit} disabled={!manualEvent.title_ar || !manualEvent.occurred_at || importing}
            style={{
              marginTop: 12, width: "100%", padding: "10px", borderRadius: 8,
              border: "none", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              cursor: manualEvent.title_ar ? "pointer" : "not-allowed",
              background: manualEvent.title_ar ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#1e293b",
              color: manualEvent.title_ar ? "#fff" : "#64748b",
            }}>
            {importing ? "جارٍ الحفظ..." : "📥 إضافة الحدث"}
          </button>
        </div>
      )}

      {inputMethod === "manual" && mode === "indicators" && (
        <div style={{ background: "#080f1c", border: "1px solid #1e293b", borderRadius: 8, padding: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>الدولة *</label>
              <select value={manualIndicator.country_code} onChange={e => setManualIndicator(p => ({ ...p, country_code: e.target.value }))} style={inputStyle}>
                {[["SA","السعودية"],["AE","الإمارات"],["QA","قطر"],["EG","مصر"],["KW","الكويت"],["OM","عمان"],["IQ","العراق"],["JO","الأردن"],["LB","لبنان"],["BH","البحرين"]].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>المؤشر *</label>
              <select value={manualIndicator.indicator_key} onChange={e => setManualIndicator(p => ({ ...p, indicator_key: e.target.value }))} style={inputStyle}>
                {[["gdp","الناتج المحلي"],["inflation","التضخم"],["oil_price","سعر النفط"],["unemployment","البطالة"],["fdi","الاستثمار الأجنبي"],["population","السكان"],["debt_gdp","الدين/الناتج"],["reserves","الاحتياطيات"],["trade_balance","الميزان التجاري"],["cpi","مؤشر أسعار المستهلك"]].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>القيمة *</label>
              <input type="number" step="0.01" value={manualIndicator.value} onChange={e => setManualIndicator(p => ({ ...p, value: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>الوحدة</label>
              <input value={manualIndicator.unit} onChange={e => setManualIndicator(p => ({ ...p, unit: e.target.value }))} placeholder="مليار $، %، ..." style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>الفترة (تاريخ) *</label>
              <input type="date" value={manualIndicator.period} onChange={e => setManualIndicator(p => ({ ...p, period: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#94a3b8" }}>المصدر</label>
              <input value={manualIndicator.source} onChange={e => setManualIndicator(p => ({ ...p, source: e.target.value }))} placeholder="البنك الدولي، صندوق النقد..." style={inputStyle} />
            </div>
          </div>
          <button onClick={handleManualSubmit} disabled={!manualIndicator.value || !manualIndicator.period || importing}
            style={{
              marginTop: 12, width: "100%", padding: "10px", borderRadius: 8,
              border: "none", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              cursor: manualIndicator.value ? "pointer" : "not-allowed",
              background: manualIndicator.value ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#1e293b",
              color: manualIndicator.value ? "#fff" : "#64748b",
            }}>
            {importing ? "جارٍ الحفظ..." : "📥 إضافة المؤشر"}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          background: "#064e3b", border: "1px solid #22c55e44", borderRadius: 8, padding: 14,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#6ee7b7", marginBottom: 6 }}>
            ✅ تم الاستيراد بنجاح
          </div>
          <div style={{ fontSize: 11, color: "#a7f3d0" }}>
            الإجمالي: {result.total} | تم إضافة: {result.inserted}
            {result.errors && (
              <div style={{ marginTop: 6, color: "#fbbf24" }}>
                ⚠️ أخطاء: {result.errors.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: "#7f1d1d", border: "1px solid #ef444444", borderRadius: 8, padding: 14,
        }}>
          <div style={{ fontSize: 12, color: "#fca5a5" }}>❌ {error}</div>
        </div>
      )}

      {/* Stats */}
      <div style={{
        background: "#080f1c", border: "1px solid #1e293b", borderRadius: 8, padding: 14,
      }}>
        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 8, fontWeight: 700 }}>
          📋 دليل الاستيراد
        </div>
        <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.8 }}>
          {mode === "events" ? (
            <>
              <div>• title_ar (مطلوب): عنوان الحدث بالعربي</div>
              <div>• country_code (مطلوب): رمز الدولة (SA, AE, EG...)</div>
              <div>• event_type (مطلوب): political, economic, security, diplomatic, energy, social, health, tech</div>
              <div>• occurred_at (مطلوب): تاريخ الحدث (YYYY-MM-DD)</div>
              <div>• impact_score: درجة التأثير من 1 إلى 10</div>
              <div>• why_it_happened: لماذا حدث (تحليل)</div>
              <div>• what_it_means: ماذا يعني لك (دلالة استراتيجية)</div>
              <div>• tags: وسوم (مصفوفة نصية)</div>
            </>
          ) : (
            <>
              <div>• country_code (مطلوب): رمز الدولة</div>
              <div>• indicator_key (مطلوب): gdp, inflation, oil_price, unemployment, fdi, population...</div>
              <div>• value (مطلوب): القيمة الرقمية</div>
              <div>• period (مطلوب): التاريخ (YYYY-MM-DD)</div>
              <div>• unit: الوحدة (مليار $، %...)</div>
              <div>• source: المصدر (البنك الدولي، صندوق النقد...)</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
