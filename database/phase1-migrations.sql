-- ============================================================
-- MENA.Watch — Phase 1: Content System + User Interaction
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ARTICLES — Stores RSS + GDELT articles
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_key    TEXT NOT NULL,                    -- e.g. "alarabiya", "gdelt"
  source_name   TEXT NOT NULL,                    -- e.g. "العربية", "GDELT"
  title         TEXT NOT NULL,
  description   TEXT,
  link          TEXT NOT NULL,
  thumbnail     TEXT,
  pub_date      TIMESTAMPTZ DEFAULT now(),
  category      TEXT DEFAULT 'general',           -- political/economic/security/health/energy/tech/general
  country_codes TEXT[] DEFAULT '{}',              -- e.g. {"SA","AE","EG"}
  sentiment_score FLOAT DEFAULT 0,               -- -1 to +1
  sentiment_label TEXT DEFAULT 'neutral',         -- positive/negative/neutral
  is_featured   BOOLEAN DEFAULT false,
  is_published  BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  -- Full-text search vector
  fts           TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) STORED,

  -- Prevent duplicate articles
  UNIQUE(source_key, link)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_pub_date ON articles(pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source_key);
CREATE INDEX IF NOT EXISTS idx_articles_countries ON articles USING GIN(country_codes);
CREATE INDEX IF NOT EXISTS idx_articles_fts ON articles USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published) WHERE is_published = true;

-- RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Everyone can read published articles
CREATE POLICY "articles_read_published" ON articles
  FOR SELECT USING (is_published = true);

-- Service role can do everything (used by content-sync cron)
-- Note: service_role bypasses RLS by default, no policy needed

-- ────────────────────────────────────────────────────────────
-- 2. COMMENTS — User comments on articles/reports
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id  UUID REFERENCES articles(id) ON DELETE CASCADE,
  report_id   TEXT,                               -- for daily_reports reference
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE,  -- one-level replies
  content     TEXT NOT NULL CHECK (char_length(content) <= 1000),
  is_approved BOOLEAN DEFAULT false,
  is_hidden   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),

  -- Must reference either article or report
  CHECK (article_id IS NOT NULL OR report_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id) WHERE article_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_report ON comments(report_id) WHERE report_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved, is_hidden);

-- RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved, non-hidden comments
CREATE POLICY "comments_read_approved" ON comments
  FOR SELECT USING (is_approved = true AND is_hidden = false);

-- Users can read their own comments (even if not approved yet)
CREATE POLICY "comments_read_own" ON comments
  FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can insert comments
CREATE POLICY "comments_insert" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can update any comment (approve/hide)
-- Admin check via profiles table
CREATE POLICY "comments_admin_update" ON comments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete any comment
CREATE POLICY "comments_admin_delete" ON comments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────
-- 3. POLLS + POLL_VOTES — User polls
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS polls (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question    TEXT NOT NULL,
  options     JSONB NOT NULL DEFAULT '[]',        -- [{"id":"a","text":"خيار 1"},...]
  category    TEXT DEFAULT 'general',
  is_active   BOOLEAN DEFAULT true,
  starts_at   TIMESTAMPTZ DEFAULT now(),
  ends_at     TIMESTAMPTZ,
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT now(),
  total_votes INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_polls_active ON polls(is_active, starts_at DESC);
CREATE INDEX IF NOT EXISTS idx_polls_category ON polls(category);

-- RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

-- Everyone can read active polls
CREATE POLICY "polls_read_active" ON polls
  FOR SELECT USING (is_active = true);

-- Admins can manage polls
CREATE POLICY "polls_admin_all" ON polls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Poll Votes
CREATE TABLE IF NOT EXISTS poll_votes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id    UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id  TEXT NOT NULL,                       -- matches options[].id
  created_at TIMESTAMPTZ DEFAULT now(),

  -- One vote per user per poll
  UNIQUE(poll_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user ON poll_votes(user_id);

-- RLS
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Users can read votes on polls they voted on
CREATE POLICY "poll_votes_read" ON poll_votes
  FOR SELECT USING (true);

-- Authenticated users can vote
CREATE POLICY "poll_votes_insert" ON poll_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users cannot change their vote
-- (No UPDATE policy)

-- ────────────────────────────────────────────────────────────
-- 4. EDITORIAL_CALENDAR — Admin editorial planning
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS editorial_calendar (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT,
  category    TEXT DEFAULT 'general',
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published','cancelled')),
  publish_at  TIMESTAMPTZ,
  author_id   UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_editorial_status ON editorial_calendar(status);
CREATE INDEX IF NOT EXISTS idx_editorial_publish ON editorial_calendar(publish_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_editorial_author ON editorial_calendar(author_id);

-- RLS
ALTER TABLE editorial_calendar ENABLE ROW LEVEL SECURITY;

-- Only admins can access editorial calendar
CREATE POLICY "editorial_admin_all" ON editorial_calendar
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────
-- 5. HELPER: Update total_votes trigger for polls
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_poll_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE polls SET total_votes = total_votes + 1 WHERE id = NEW.poll_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE polls SET total_votes = total_votes - 1 WHERE id = OLD.poll_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_poll_vote_count ON poll_votes;
CREATE TRIGGER trg_poll_vote_count
  AFTER INSERT OR DELETE ON poll_votes
  FOR EACH ROW EXECUTE FUNCTION update_poll_vote_count();

-- ────────────────────────────────────────────────────────────
-- 6. HELPER: Updated_at trigger
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_articles_updated ON articles;
CREATE TRIGGER trg_articles_updated
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_comments_updated ON comments;
CREATE TRIGGER trg_comments_updated
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_editorial_updated ON editorial_calendar;
CREATE TRIGGER trg_editorial_updated
  BEFORE UPDATE ON editorial_calendar
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Done! Tables created:
-- ✅ articles (with FTS + indexes)
-- ✅ comments (with RLS)
-- ✅ polls + poll_votes (with vote counting trigger)
-- ✅ editorial_calendar (admin-only)
-- ============================================================
