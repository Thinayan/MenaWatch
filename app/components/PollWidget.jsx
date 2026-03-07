"use client";
import { useState, useEffect } from "react";
import { toWestern } from "./DateDisplay";

/**
 * PollWidget — Display a poll with voting and results
 *
 * Props:
 *   category: string — filter polls by category (optional)
 *   user: { id } — current user (null if not logged in)
 *   compact: boolean — smaller widget for sidebar
 */
export default function PollWidget({ category, user, compact = false }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
  }, [category]);

  async function fetchPolls() {
    setLoading(true);
    try {
      const params = category ? `?category=${category}` : "";
      const res = await fetch(`/api/polls${params}`);
      const data = await res.json();
      setPolls(data.polls || []);
    } catch {
      setPolls([]);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{
        background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10,
        padding: 16, textAlign: "center", color: "#94a3b8", fontSize: 13,
      }}>
        جارٍ تحميل الاستطلاعات...
      </div>
    );
  }

  if (!polls.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {polls.map((poll) => (
        <SinglePoll key={poll.id} poll={poll} user={user} compact={compact} onVoted={fetchPolls} />
      ))}
    </div>
  );
}

function SinglePoll({ poll, user, compact, onVoted }) {
  const [voting, setVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(!!poll.user_vote);
  const [userVote, setUserVote] = useState(poll.user_vote);
  const [voteCounts, setVoteCounts] = useState(poll.vote_counts || {});
  const [error, setError] = useState(null);

  const totalVotes = Object.values(voteCounts).reduce((sum, n) => sum + n, 0);
  const showResults = hasVoted || !user;

  async function handleVote() {
    if (!selectedOption || voting) return;
    setVoting(true);
    setError(null);

    try {
      const res = await fetch("/api/polls/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poll_id: poll.id, option_id: selectedOption }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setHasVoted(true);
        setUserVote(selectedOption);
        setVoteCounts((prev) => ({
          ...prev,
          [selectedOption]: (prev[selectedOption] || 0) + 1,
        }));
      }
    } catch {
      setError("فشل التصويت");
    }
    setVoting(false);
  }

  const options = poll.options || [];

  return (
    <div style={{
      background: "#0a1628",
      border: "1px solid #1e293b",
      borderRadius: 10,
      padding: compact ? 14 : 18,
      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
      direction: "rtl",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: compact ? 14 : 18 }}>📊</span>
        <span style={{
          fontSize: compact ? 13 : 15,
          fontWeight: 700,
          color: "#f1f5f9",
          lineHeight: 1.4,
        }}>
          {poll.question}
        </span>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((option) => {
          const count = voteCounts[option.id] || 0;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isSelected = selectedOption === option.id;
          const isUserVote = userVote === option.id;

          if (showResults) {
            // Results view
            return (
              <div key={option.id} style={{
                position: "relative",
                padding: "10px 14px",
                background: "#060d18",
                border: `1px solid ${isUserVote ? "#22c55e44" : "#1e293b"}`,
                borderRadius: 8,
                overflow: "hidden",
              }}>
                {/* Progress bar */}
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, bottom: 0,
                  width: `${pct}%`,
                  background: isUserVote ? "#22c55e15" : "#1e293b33",
                  transition: "width 0.5s ease",
                }} />

                <div style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{
                    fontSize: 13,
                    color: isUserVote ? "#22c55e" : "#cbd5e1",
                    fontWeight: isUserVote ? 600 : 400,
                  }}>
                    {isUserVote && "✓ "}{option.text}
                  </span>
                  <span style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}>
                    {pct}%
                  </span>
                </div>
              </div>
            );
          }

          // Voting view
          return (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              style={{
                padding: "10px 14px",
                background: isSelected ? "#22c55e15" : "#060d18",
                border: `1px solid ${isSelected ? "#22c55e44" : "#1e293b"}`,
                borderRadius: 8,
                color: isSelected ? "#22c55e" : "#cbd5e1",
                fontSize: 13,
                fontWeight: isSelected ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "right",
                transition: "all 0.15s",
              }}
            >
              {isSelected ? "◉ " : "○ "}{option.text}
            </button>
          );
        })}
      </div>

      {/* Vote button */}
      {user && !hasVoted && (
        <button
          onClick={handleVote}
          disabled={!selectedOption || voting}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "10px",
            background: selectedOption ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#1e293b",
            border: "none",
            borderRadius: 8,
            color: selectedOption ? "#fff" : "#64748b",
            fontSize: 13,
            fontWeight: 700,
            cursor: selectedOption ? "pointer" : "not-allowed",
            fontFamily: "inherit",
          }}
        >
          {voting ? "جارٍ التصويت..." : "صوّت"}
        </button>
      )}

      {!user && (
        <div style={{
          marginTop: 10, textAlign: "center", fontSize: 11, color: "#94a3b8",
        }}>
          <a href="/login" style={{ color: "#22c55e", textDecoration: "none" }}>
            سجّل دخولك للتصويت
          </a>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>
          {totalVotes} صوت
        </span>
        {poll.ends_at && (
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            ينتهي: {toWestern(new Date(poll.ends_at).toLocaleDateString("ar-EG", { month: "short", day: "numeric" }))}
          </span>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: 8, padding: "8px 12px", borderRadius: 6, fontSize: 12,
          background: "#7f1d1d", color: "#ef4444",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
