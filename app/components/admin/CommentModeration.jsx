"use client";
import { useState, useEffect } from "react";

export default function CommentModeration() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, approved, hidden

  useEffect(() => { fetchComments(); }, []);

  async function fetchComments() {
    setLoading(true);
    try {
      // Fetch all comments (admin endpoint)
      const res = await fetch("/api/admin/comments");
      const data = await res.json();
      setComments(data.comments || []);
    } catch { setComments([]); }
    setLoading(false);
  }

  async function handleAction(commentId, action) {
    try {
      await fetch("/api/admin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commentId, action }),
      });
      fetchComments();
    } catch {}
  }

  const filteredComments = comments.filter((c) => {
    if (filter === "pending") return !c.is_approved && !c.is_hidden;
    if (filter === "approved") return c.is_approved && !c.is_hidden;
    if (filter === "hidden") return c.is_hidden;
    return true;
  });

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>💬 إدارة التعليقات</div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "pending", label: "بانتظار الموافقة", color: "#f59e0b" },
          { id: "approved", label: "معتمدة", color: "#22c55e" },
          { id: "hidden", label: "مخفية", color: "#ef4444" },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: "5px 12px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            background: filter === f.id ? f.color + "22" : "#1e293b",
            color: filter === f.id ? f.color : "#64748b",
          }}>
            {f.label} ({comments.filter((c) => {
              if (f.id === "pending") return !c.is_approved && !c.is_hidden;
              if (f.id === "approved") return c.is_approved && !c.is_hidden;
              if (f.id === "hidden") return c.is_hidden;
              return false;
            }).length})
          </button>
        ))}
      </div>

      {/* Comments */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 24, color: "#64748b", fontSize: 13 }}>جارٍ التحميل...</div>
      ) : filteredComments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 24, color: "#475569", fontSize: 13, background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
          لا توجد تعليقات
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredComments.map((comment) => (
            <div key={comment.id} style={{
              background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: 14,
            }}>
              {/* User + Time */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>
                  {comment.user_name || "مستخدم"}
                </span>
                <span style={{ fontSize: 10, color: "#475569" }}>{timeAgo(comment.created_at)}</span>
                {comment.article_title && (
                  <span style={{ fontSize: 10, color: "#3b82f6" }}>على: {comment.article_title}</span>
                )}
              </div>

              {/* Content */}
              <div style={{
                fontSize: 13, color: "#cbd5e1", lineHeight: 1.6,
                padding: "10px 12px", background: "#060d18", borderRadius: 6, marginBottom: 10,
              }}>
                {comment.content}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6 }}>
                {!comment.is_approved && !comment.is_hidden && (
                  <button onClick={() => handleAction(comment.id, "approve")} style={{
                    padding: "5px 12px", background: "#14532d", border: "none", borderRadius: 4,
                    color: "#22c55e", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>✅ موافقة</button>
                )}
                {!comment.is_hidden && (
                  <button onClick={() => handleAction(comment.id, "hide")} style={{
                    padding: "5px 12px", background: "#7f1d1d", border: "none", borderRadius: 4,
                    color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>🚫 إخفاء</button>
                )}
                {comment.is_hidden && (
                  <button onClick={() => handleAction(comment.id, "unhide")} style={{
                    padding: "5px 12px", background: "#1e293b", border: "none", borderRadius: 4,
                    color: "#94a3b8", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>↩️ إظهار</button>
                )}
                <button onClick={() => handleAction(comment.id, "delete")} style={{
                  padding: "5px 12px", background: "#450a0a", border: "none", borderRadius: 4,
                  color: "#fca5a5", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                }}>🗑️ حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
