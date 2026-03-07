"use client";

/**
 * ArticleCard — Reusable article display card
 * Used in OpsRoom tabs, FreeTabs, and search results.
 *
 * Props:
 *   article: { title, description, link, source_name, pub_date, thumbnail, category, sentiment_label, country_codes }
 *   compact: boolean — smaller card for inline tab usage
 *   showMeta: boolean — show category + sentiment badges
 */

const CATEGORY_COLORS = {
  political: { bg: "#1e40af22", color: "#60a5fa", label: "سياسي" },
  economic: { bg: "#16a34a22", color: "#22c55e", label: "اقتصادي" },
  security: { bg: "#dc262622", color: "#ef4444", label: "أمني" },
  health: { bg: "#0891b222", color: "#06b6d4", label: "صحي" },
  energy: { bg: "#f59e0b22", color: "#f59e0b", label: "طاقة" },
  tech: { bg: "#8b5cf622", color: "#a78bfa", label: "تقنية" },
  general: { bg: "#64748b22", color: "#94a3b8", label: "عام" },
};

const SENTIMENT_ICONS = {
  positive: "🟢",
  negative: "🔴",
  neutral: "⚪",
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
    if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
    return date.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function ArticleCard({ article, compact = false, showMeta = true }) {
  if (!article) return null;

  const catInfo = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general;
  const sentimentIcon = SENTIMENT_ICONS[article.sentiment_label] || "⚪";

  if (compact) {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          gap: 10,
          padding: "10px 12px",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 8,
          textDecoration: "none",
          transition: "border-color 0.15s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#334155")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e293b")}
      >
        {/* Thumbnail */}
        {article.thumbnail && (
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 6,
            overflow: "hidden",
            flexShrink: 0,
            background: "#1e293b",
          }}>
            <img
              src={article.thumbnail}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#e2e8f0",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {article.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>{article.source_name}</span>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>·</span>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>{timeAgo(article.pub_date)}</span>
            {showMeta && (
              <>
                <span style={{ fontSize: 10, color: "#94a3b8" }}>·</span>
                <span style={{ fontSize: 8 }}>{sentimentIcon}</span>
              </>
            )}
          </div>
        </div>
      </a>
    );
  }

  // Full card
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 10,
        overflow: "hidden",
        textDecoration: "none",
        transition: "border-color 0.15s, transform 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#334155";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1e293b";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Thumbnail */}
      {article.thumbnail && (
        <div style={{
          width: "100%",
          height: 160,
          background: "#1e293b",
          overflow: "hidden",
        }}>
          <img
            src={article.thumbnail}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.parentElement.style.display = "none"; }}
          />
        </div>
      )}

      <div style={{ padding: "14px 16px" }}>
        {/* Meta badges */}
        {showMeta && (
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 4,
              background: catInfo.bg,
              color: catInfo.color,
              fontWeight: 600,
            }}>
              {catInfo.label}
            </span>
            {article.country_codes?.length > 0 && (
              <span style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 4,
                background: "#1e293b",
                color: "#94a3b8",
              }}>
                {article.country_codes.slice(0, 3).join("، ")}
              </span>
            )}
            <span style={{ fontSize: 10 }}>{sentimentIcon}</span>
          </div>
        )}

        {/* Title */}
        <h3 style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#f1f5f9",
          lineHeight: 1.5,
          margin: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p style={{
            fontSize: 12,
            color: "#94a3b8",
            lineHeight: 1.5,
            margin: "8px 0 0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px solid #1e293b",
        }}>
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
            {article.source_name}
          </span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            {timeAgo(article.pub_date)}
          </span>
        </div>
      </div>
    </a>
  );
}

/**
 * ArticleList — Grid of articles with loading state
 */
export function ArticleList({ articles = [], loading = false, compact = false, showMeta = true, columns = 1 }) {
  if (loading) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : `repeat(${columns}, 1fr)`,
        gap: compact ? 8 : 12,
      }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: compact ? 8 : 10,
            height: compact ? 76 : 280,
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div style={{
        padding: "24px",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: 13,
        background: "#0f172a",
        borderRadius: 8,
        border: "1px solid #1e293b",
      }}>
        لا توجد مقالات حالياً
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: compact ? "1fr" : `repeat(${columns}, 1fr)`,
      gap: compact ? 8 : 12,
    }}>
      {articles.map((article, i) => (
        <ArticleCard
          key={article.id || article.link || i}
          article={article}
          compact={compact}
          showMeta={showMeta}
        />
      ))}
    </div>
  );
}
