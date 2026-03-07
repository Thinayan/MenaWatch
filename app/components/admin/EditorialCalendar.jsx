"use client";
import { useState, useEffect } from "react";

const STATUS_MAP = {
  draft: { label: "مسودة", color: "#64748b", bg: "#64748b22" },
  scheduled: { label: "مجدول", color: "#3b82f6", bg: "#3b82f622" },
  published: { label: "منشور", color: "#22c55e", bg: "#22c55e22" },
  cancelled: { label: "ملغي", color: "#ef4444", bg: "#ef444422" },
};

const CATEGORIES = [
  { id: "general", label: "عام" },
  { id: "political", label: "سياسي" },
  { id: "economic", label: "اقتصادي" },
  { id: "security", label: "أمني" },
  { id: "health", label: "صحي" },
  { id: "energy", label: "طاقة" },
  { id: "tech", label: "تقنية" },
];

export default function EditorialCalendar() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", category: "general", status: "draft", publish_at: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchEntries(); }, []);

  async function fetchEntries() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/editorial");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch { setEntries([]); }
    setLoading(false);
  }

  async function handleSave() {
    if (!form.title.trim()) { setMsg({ type: "error", text: "العنوان مطلوب" }); return; }
    setSaving(true); setMsg(null);
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;
      const res = await fetch("/api/admin/editorial", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: editingId ? "تم التحديث" : "تم الإضافة" });
      resetForm();
      fetchEntries();
    } catch (e) { setMsg({ type: "error", text: e.message }); }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("هل تريد حذف هذا المحتوى؟")) return;
    try {
      await fetch(`/api/admin/editorial?id=${id}`, { method: "DELETE" });
      fetchEntries();
    } catch {}
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      content: entry.content || "",
      category: entry.category,
      status: entry.status,
      publish_at: entry.publish_at ? entry.publish_at.slice(0, 16) : "",
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ title: "", content: "", category: "general", status: "draft", publish_at: "" });
    setShowForm(false);
  }

  const filteredEntries = filter === "all" ? entries : entries.filter((e) => e.status === filter);

  const inputStyle = {
    padding: "10px 12px", background: "#060d18", border: "1px solid #1e293b",
    borderRadius: 6, color: "#e2e8f0", fontFamily: "inherit", fontSize: 13, outline: "none", width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>📅 الجدول التحريري</div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={{
          padding: "8px 16px", background: showForm ? "#7f1d1d" : "#22c55e", border: "none",
          borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        }}>
          {showForm ? "✕ إلغاء" : "+ إضافة محتوى"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="عنوان المحتوى" style={inputStyle} />
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="محتوى / ملاحظات" rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <input type="datetime-local" value={form.publish_at}
                onChange={(e) => setForm({ ...form, publish_at: e.target.value })}
                style={{ ...inputStyle, direction: "ltr" }} />
            </div>
            <button onClick={handleSave} disabled={saving} style={{
              padding: "10px", background: "linear-gradient(135deg,#22c55e,#16a34a)",
              border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
            }}>
              {saving ? "جارٍ الحفظ..." : editingId ? "تحديث" : "إضافة"}
            </button>
            {msg && (
              <div style={{
                padding: "8px 12px", borderRadius: 6, fontSize: 12,
                background: msg.type === "success" ? "#14532d" : "#7f1d1d",
                color: msg.type === "success" ? "#22c55e" : "#ef4444",
              }}>{msg.text}</div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 6 }}>
        {[{ id: "all", label: "الكل" }, ...Object.entries(STATUS_MAP).map(([k, v]) => ({ id: k, label: v.label }))].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: "5px 12px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            background: filter === f.id ? "#22c55e22" : "#1e293b",
            color: filter === f.id ? "#22c55e" : "#64748b",
          }}>
            {f.label} {f.id !== "all" && `(${entries.filter((e) => e.status === f.id).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 24, color: "#64748b", fontSize: 13 }}>جارٍ التحميل...</div>
      ) : filteredEntries.length === 0 ? (
        <div style={{ textAlign: "center", padding: 24, color: "#475569", fontSize: 13, background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
          لا توجد عناصر
        </div>
      ) : (
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          {filteredEntries.map((entry) => {
            const st = STATUS_MAP[entry.status] || STATUS_MAP.draft;
            return (
              <div key={entry.id} style={{
                padding: "12px 16px", borderBottom: "1px solid #1e293b",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{entry.title}</span>
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: st.bg, color: st.color, fontWeight: 600 }}>
                      {st.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>
                    {entry.category} · {entry.publish_at ? new Date(entry.publish_at).toLocaleDateString("ar-SA") : "بدون موعد"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => startEdit(entry)} style={{
                    padding: "4px 10px", background: "#1e293b", border: "none", borderRadius: 4,
                    color: "#94a3b8", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  }}>✏️</button>
                  <button onClick={() => handleDelete(entry.id)} style={{
                    padding: "4px 10px", background: "#7f1d1d", border: "none", borderRadius: 4,
                    color: "#ef4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
