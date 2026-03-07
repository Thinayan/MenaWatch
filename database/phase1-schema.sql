-- ============================================================
-- MENA.Watch — Phase 1 Schema: Content + Interaction System
-- Run in Supabase SQL Editor
-- ============================================================

-- ┌─────────────────────────────────────────────────┐
-- │  1. ARTICLES — RSS + GDELT content storage      │
-- └─────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS articles (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_key    TEXT NOT NULL,
  source_name   TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  link          TEXT NOT NULL,
  thumbnail     TEXT,
  pub_date      TIMESTAMPTZ DEFAULT NOW(),
  category      TEXT DEFAULT 'general'
                CHECK (category IN ('political','economic','security','health','energy','tech','general')),
  country_codes TEXT[] DEFAULT '{}',
  sentiment_score FLOAT DEFAULT 0,
  sentiment_label TEXT DEFAULT 'neutral'
                CHECK (sentiment_label IN ('positive','negative','neutral')),
  is_featured   BOOLEAN DEFAULT false,
  is_published  BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate articles from same source
  UNIQUE(source_key, link)
);

-- Full-text search vector (auto-generated)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,''))
  ) STORED;

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_articles_category    ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_pub_date    ON articles(pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source      ON articles(source_key);
CREATE INDEX IF NOT EXISTS idx_articles_countries   ON articles USING GIN(country_codes);
CREATE INDEX IF NOT EXISTS idx_articles_fts         ON articles USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_articles_featured    ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_sentiment   ON articles(sentiment_label);

-- RLS: Everyone can read published articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Service role can manage articles"
  ON articles FOR ALL
  USING (auth.role() = 'service_role');


-- ┌─────────────────────────────────────────────────┐
-- │  2. COMMENTS — User comments on articles/reports│
-- └─────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS comments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  article_id  UUID REFERENCES articles(id) ON DELETE CASCADE,
  report_id   UUID,  -- references daily_reports if exists
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE,  -- single-level reply
  content     TEXT NOT NULL CHECK (char_length(content) <= 1000),
  is_approved BOOLEAN DEFAULT false,
  is_hidden   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_article  ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_report   ON comments(report_id);
CREATE INDEX IF NOT EXISTS idx_comments_user     ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent   ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved) WHERE is_approved = true;

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Everyone reads approved, non-hidden comments
CREATE POLICY "Anyone can read approved comments"
  ON comments FOR SELECT
  USING (is_approved = true AND is_hidden = false);

-- Users can insert their own comments
CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Admin/service can manage all
CREATE POLICY "Service role manages all comments"
  ON comments FOR ALL
  USING (auth.role() = 'service_role');


-- ┌─────────────────────────────────────────────────┐
-- │  3. POLLS — User polls/surveys                  │
-- └─────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS polls (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question    TEXT NOT NULL,
  options     JSONB NOT NULL DEFAULT '[]',  -- [{text: "...", votes: 0}, ...]
  category    TEXT DEFAULT 'general',
  is_active   BOOLEAN DEFAULT true,
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_polls_active   ON polls(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_polls_category ON polls(category);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active polls"
  ON polls FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role manages polls"
  ON polls FOR ALL
  USING (auth.role() = 'service_role');


-- ┌─────────────────────────────────────────────────┐
-- │  4. POLL_VOTES — One vote per user per poll     │
-- └─────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS poll_votes (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id   UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  user_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(poll_id, user_id)  -- one vote per user per poll
);

CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user ON poll_votes(user_id);

ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own votes"
  ON poll_votes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can vote once"
  ON poll_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages votes"
  ON poll_votes FOR ALL
  USING (auth.role() = 'service_role');


-- ┌─────────────────────────────────────────────────┐
-- │  5. EDITORIAL_CALENDAR — Content scheduling     │
-- └─────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS editorial_calendar (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT,
  category   TEXT DEFAULT 'general',
  status     TEXT DEFAULT 'draft'
             CHECK (status IN ('draft','scheduled','published','cancelled')),
  publish_at TIMESTAMPTZ,
  author_id  UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_editorial_status ON editorial_calendar(status);
CREATE INDEX IF NOT EXISTS idx_editorial_publish ON editorial_calendar(publish_at);

ALTER TABLE editorial_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages editorial"
  ON editorial_calendar FOR ALL
  USING (auth.role() = 'service_role');


-- ┌─────────────────────────────────────────────────┐
-- │  6. TEAM_MEMBERS — About page (Phase 2)         │
-- └─────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS team_members (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar       TEXT NOT NULL,
  name_en       TEXT,
  title_ar      TEXT NOT NULL,
  title_en      TEXT,
  bio_ar        TEXT,
  bio_en        TEXT,
  photo_url     TEXT,
  linkedin      TEXT,
  twitter       TEXT,
  display_order INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role manages team"
  ON team_members FOR ALL
  USING (auth.role() = 'service_role');


-- ┌─────────────────────────────────────────────────┐
-- │  7. FTS for daily_reports (if table exists)      │
-- └─────────────────────────────────────────────────┘
-- Uncomment if daily_reports table exists:
-- ALTER TABLE daily_reports ADD COLUMN IF NOT EXISTS fts tsvector
--   GENERATED ALWAYS AS (
--     to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,''))
--   ) STORED;
-- CREATE INDEX IF NOT EXISTS idx_daily_reports_fts ON daily_reports USING GIN(fts);


-- ============================================================
-- DONE — Run this in Supabase SQL Editor to create all tables
-- ============================================================
