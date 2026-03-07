"use client";
import { useState, useEffect } from "react";
import PollWidget from "../PollWidget";
import CommentSection from "../CommentSection";
import LiveNewsFeed from "../LiveNewsFeed";

/**
 * TabInteraction — Community engagement tab
 * Shows active polls, comments on featured articles, and trending news.
 */
export default function TabInteraction() {
  const [user, setUser] = useState(null);
  const [featuredArticle, setFeaturedArticle] = useState(null);

  useEffect(() => {
    // Get current user
    import("../../../lib/supabase").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }).catch(() => {});

    // Get featured/latest article for comments
    fetch("/api/articles?featured=true&limit=1")
      .then(r => r.json())
      .then(d => {
        if (d.articles?.length > 0) {
          setFeaturedArticle(d.articles[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0a1628, #0f1f3d)",
        border: "1px solid #1e3a5f",
        borderRadius: 10,
        padding: "16px 20px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
          💬 ساحة التفاعل
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>
          شارك رأيك في الاستطلاعات وعلّق على الأحداث
        </div>
      </div>

      {/* Active Poll */}
      <div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <span>📊</span>
          <span style={{ fontWeight: 600 }}>استطلاع الرأي</span>
          <span style={{
            fontSize: 9, padding: "1px 6px", borderRadius: 3,
            background: "#0ea5e922", color: "#0ea5e9", fontWeight: 600,
          }}>
            مباشر
          </span>
        </div>
        <PollWidget category="general" user={user} />
      </div>

      {/* Comments Section */}
      <div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <span>💬</span>
          <span style={{ fontWeight: 600 }}>التعليقات</span>
        </div>
        {featuredArticle ? (
          <div>
            <div style={{
              background: "#0a1628",
              border: "1px solid #1e293b",
              borderRadius: 8,
              padding: "12px 14px",
              marginBottom: 10,
            }}>
              <div style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 600, marginBottom: 4 }}>
                {featuredArticle.title}
              </div>
              <div style={{ fontSize: 9, color: "#94a3b8" }}>
                {featuredArticle.source_name} — {featuredArticle.category}
              </div>
            </div>
            <CommentSection articleId={featuredArticle.id} user={user} />
          </div>
        ) : (
          <CommentSection user={user} />
        )}
      </div>

      {/* Trending News */}
      <LiveNewsFeed
        category="general"
        title="📰 الأكثر تداولاً"
        limit={5}
      />
    </div>
  );
}
