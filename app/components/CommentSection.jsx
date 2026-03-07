"use client";
import { useState, useEffect } from "react";

/**
 * CommentSection — Display and post comments for articles/reports
 *
 * Props:
 *   articleId: string (UUID)  — for article comments
 *   reportId: string          — for report comments
 *   user: { id, email }      — current user (null if not logged in)
 */
export default function CommentSection({ articleId, reportId, user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [articleId, reportId]);

  async function fetchComments() {
    setLoading(true);
    try {
      const param = articleId ? `article_id=${articleId}` : `report_id=${reportId}`;
      const res = await fetch(`/api/comments?${param}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      setComments([]);
    }
    setLoading(false);
  }

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: articleId || undefined,
          report_id: reportId || undefined,
          parent_id: replyTo || undefined,
          content: text.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.error || "حدث خطأ" });
      } else {
        setMsg({ type: "success", text: data.message });
        setText("");
        setReplyTo(null);
        fetchComments();
      }
    } catch {
      setMsg({ type: "error", text: "فشل إرسال التعليق" });
    }
    setSubmitting(false);
  }

  async function handleDelete(commentId) {
    if (!confirm("هل تريد حذف هذا التعليق؟")) return;
    try {
      await fetch(`/api/comments?id=${commentId}`, { method: "DELETE" });
      fetchComments();
    } catch {}
  }

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  }

  // Organize into threads (parent → replies)
  const rootComments = comments.filter((c) => !c.parent_id);
  const replies = comments.filter((c) => c.parent_id);

  function getReplies(parentId) {
    return replies.filter((r) => r.parent_id === parentId);
  }

  return (
    <div style={{
      background: "#0a1628",
      border: "1px solid #1e293b",
      borderRadius: 10,
      padding: 16,
      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
      direction: "rtl",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 16 }}>💬</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>
          التعليقات ({comments.length})
        </span>
      </div>

      {/* Comment Form */}
      {user ? (
        <div style={{ marginBottom: 16 }}>
          {replyTo && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
              padding: "6px 10px", background: "#1e293b", borderRadius: 6, fontSize: 12, color: "#94a3b8",
            }}>
              <span>↩️ رد على تعليق</span>
              <button onClick={() => setReplyTo(null)} style={{
                background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12,
              }}>إلغاء</button>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="أضف تعليقك..."
              maxLength={1000}
              style={{
                flex: 1, padding: "10px 12px", background: "#060d18", border: "1px solid #1e293b",
                borderRadius: 8, color: "#e2e8f0", fontFamily: "inherit", fontSize: 13,
                resize: "vertical", minHeight: 60, maxHeight: 150, outline: "none",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !text.trim()}
              style={{
                padding: "10px 16px", background: submitting ? "#1e293b" : "#22c55e",
                border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
                alignSelf: "flex-end",
              }}
            >
              {submitting ? "..." : "إرسال"}
            </button>
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
            {text.length}/1000
          </div>
          {msg && (
            <div style={{
              marginTop: 8, padding: "8px 12px", borderRadius: 6, fontSize: 12,
              background: msg.type === "success" ? "#14532d" : "#7f1d1d",
              color: msg.type === "success" ? "#22c55e" : "#ef4444",
            }}>
              {msg.text}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          padding: "12px", background: "#060d18", border: "1px solid #1e293b",
          borderRadius: 8, textAlign: "center", marginBottom: 16,
        }}>
          <a href="/login" style={{ color: "#22c55e", fontSize: 13, textDecoration: "none" }}>
            سجّل دخولك للتعليق ←
          </a>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>
          جارٍ تحميل التعليقات...
        </div>
      ) : rootComments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>
          لا توجد تعليقات بعد. كن أول من يعلق!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rootComments.map((comment) => (
            <div key={comment.id}>
              {/* Main Comment */}
              <CommentBubble
                comment={comment}
                user={user}
                onReply={() => setReplyTo(comment.id)}
                onDelete={() => handleDelete(comment.id)}
                timeAgo={timeAgo}
              />

              {/* Replies */}
              {getReplies(comment.id).map((reply) => (
                <div key={reply.id} style={{ marginRight: 28, marginTop: 6 }}>
                  <CommentBubble
                    comment={reply}
                    user={user}
                    onDelete={() => handleDelete(reply.id)}
                    timeAgo={timeAgo}
                    isReply
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentBubble({ comment, user, onReply, onDelete, timeAgo, isReply }) {
  const isOwn = user?.id === comment.user?.id;
  const roleBadge = comment.user?.role === "admin" ? "أدمن" : comment.user?.role === "pro" ? "خبير" : null;

  return (
    <div style={{
      padding: "10px 14px",
      background: isReply ? "#0f172a" : "#060d18",
      border: "1px solid #1e293b",
      borderRadius: 8,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>
          {comment.user?.name || "مستخدم"}
        </span>
        {roleBadge && (
          <span style={{
            fontSize: 9, padding: "1px 6px", borderRadius: 3,
            background: comment.user?.role === "admin" ? "#f59e0b22" : "#22c55e22",
            color: comment.user?.role === "admin" ? "#f59e0b" : "#22c55e",
            fontWeight: 700,
          }}>
            {roleBadge}
          </span>
        )}
        <span style={{ fontSize: 10, color: "#94a3b8" }}>
          {timeAgo(comment.created_at)}
        </span>
      </div>

      {/* Content */}
      <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>
        {comment.content}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {!isReply && onReply && user && (
          <button onClick={onReply} style={{
            background: "none", border: "none", color: "#64748b", fontSize: 11,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            ↩️ رد
          </button>
        )}
        {isOwn && (
          <button onClick={onDelete} style={{
            background: "none", border: "none", color: "#ef4444", fontSize: 11,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            🗑️ حذف
          </button>
        )}
      </div>
    </div>
  );
}
