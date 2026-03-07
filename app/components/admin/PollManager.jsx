"use client";
import { useState, useEffect } from "react";
import { toWestern } from "../DateDisplay";

export default function PollManager() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: "", options: [{ id: "a", text: "" }, { id: "b", text: "" }], category: "general", ends_at: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchPolls(); }, []);

  async function fetchPolls() {
    setLoading(true);
    try {
      const res = await fetch("/api/polls?limit=20");
      const data = await res.json();
      setPolls(data.polls || []);
    } catch { setPolls([]); }
    setLoading(false);
  }

  function addOption() {
    const letters = "abcdefghij";
    const nextId = letters[form.options.length] || `opt${form.options.length}`;
    setForm({ ...form, options: [...form.options, { id: nextId, text: "" }] });
  }

  function removeOption(idx) {
    if (form.options.length <= 2) return;
    setForm({ ...form, options: form.options.filter((_, i) => i !== idx) });
  }

  function updateOption(idx, text) {
    const opts = [...form.options];
    opts[idx] = { ...opts[idx], text };
    setForm({ ...form, options: opts });
  }

  async function handleCreate() {
    if (!form.question.trim()) { setMsg({ type: "error", text: "السؤال مطلوب" }); return; }
    if (form.options.some((o) => !o.text.trim())) { setMsg({ type: "error", text: "كل الخيارات مطلوبة" }); return; }

    setSaving(true); setMsg(null);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.question,
          options: form.options,
          category: form.category,
          ends_at: form.ends_at || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "تم إنشاء الاستطلاع" });
      setForm({ question: "", options: [{ id: "a", text: "" }, { id: "b", text: "" }], category: "general", ends_at: "" });
      setShowForm(false);
      fetchPolls();
    } catch (e) { setMsg({ type: "error", text: e.message }); }
    setSaving(false);
  }

  const inputStyle = {
    padding: "10px 12px", background: "#060d18", border: "1px solid #1e293b",
    borderRadius: 6, color: "#e2e8f0", fontFamily: "inherit", fontSize: 13, outline: "none", width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>📊 إدارة الاستطلاعات</div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "8px 16px", background: showForm ? "#7f1d1d" : "#22c55e", border: "none",
          borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        }}>
          {showForm ? "✕ إلغاء" : "+ استطلاع جديد"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="سؤال الاستطلاع" style={inputStyle} />

            <div style={{ fontSize: 11, color: "#94a3b8" }}>الخيارات:</div>
            {form.options.map((opt, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8 }}>
                <input value={opt.text} onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`خيار ${idx + 1}`} style={{ ...inputStyle, flex: 1 }} />
                {form.options.length > 2 && (
                  <button onClick={() => removeOption(idx)} style={{
                    padding: "8px 12px", background: "#7f1d1d", border: "none",
                    borderRadius: 6, color: "#ef4444", fontSize: 12, cursor: "pointer",
                  }}>✕</button>
                )}
              </div>
            ))}
            {form.options.length < 6 && (
              <button onClick={addOption} style={{
                padding: "6px 12px", background: "#1e293b", border: "none", borderRadius: 6,
                color: "#94a3b8", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
              }}>+ إضافة خيار</button>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                <option value="general">عام</option>
                <option value="political">سياسي</option>
                <option value="economic">اقتصادي</option>
                <option value="security">أمني</option>
              </select>
              <input type="datetime-local" value={form.ends_at}
                onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                placeholder="تاريخ الانتهاء (اختياري)"
                style={{ ...inputStyle, direction: "ltr" }} />
            </div>

            <button onClick={handleCreate} disabled={saving} style={{
              padding: "10px", background: "linear-gradient(135deg,#22c55e,#16a34a)",
              border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
            }}>
              {saving ? "جارٍ الإنشاء..." : "إنشاء الاستطلاع"}
            </button>
          </div>
        </div>
      )}

      {msg && (
        <div style={{
          padding: "8px 12px", borderRadius: 6, fontSize: 12,
          background: msg.type === "success" ? "#14532d" : "#7f1d1d",
          color: msg.type === "success" ? "#22c55e" : "#ef4444",
        }}>{msg.text}</div>
      )}

      {/* Polls List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 13 }}>جارٍ التحميل...</div>
      ) : polls.length === 0 ? (
        <div style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 13, background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
          لا توجد استطلاعات
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {polls.map((poll) => {
            const totalVotes = Object.values(poll.vote_counts || {}).reduce((sum, n) => sum + n, 0);
            return (
              <div key={poll.id} style={{
                background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: 14,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{poll.question}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 3,
                    background: poll.is_active ? "#22c55e22" : "#64748b22",
                    color: poll.is_active ? "#22c55e" : "#64748b",
                    fontWeight: 600,
                  }}>
                    {poll.is_active ? "نشط" : "منتهي"}
                  </span>
                </div>

                {(poll.options || []).map((opt) => {
                  const count = (poll.vote_counts || {})[opt.id] || 0;
                  const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  return (
                    <div key={opt.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "6px 10px", marginBottom: 4, background: "#060d18", borderRadius: 4,
                    }}>
                      <span style={{ fontSize: 12, color: "#cbd5e1" }}>{opt.text}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{count} ({pct}%)</span>
                    </div>
                  );
                })}

                <div style={{ marginTop: 8, fontSize: 10, color: "#94a3b8" }}>
                  إجمالي الأصوات: {totalVotes}
                  {poll.ends_at && ` · ينتهي: ${toWestern(new Date(poll.ends_at).toLocaleDateString("ar-EG"))}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
