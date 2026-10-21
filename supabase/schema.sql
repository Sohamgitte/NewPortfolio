-- =============================================================================
-- SohamLabs Portfolio CMS - PostgreSQL Database Schema & Security Policies
-- =============================================================================
-- Target: Supabase PostgreSQL (15+)
-- Features: Normalized tables, strict RLS, security definer admin helper,
--           Realtime publication, auto-updating timestamps, and storage policies.
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS
-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. ADMIN USERS TABLE
-- Stores authorized admin user mappings linked directly to auth.users UUID
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for admin_users
CREATE OR REPLACE TRIGGER tr_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Security Definer Function: is_admin()
-- Evaluates whether the currently authenticated session belongs to an authorized admin.
-- Using SECURITY DEFINER ensures that RLS policies can query admin_users without recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- 4. PROFILE & SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.profile_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL DEFAULT 'Soham Gitte',
  title TEXT NOT NULL DEFAULT 'Software Engineer & Builder',
  tagline TEXT NOT NULL DEFAULT 'Building Products, Startups & What''s Next',
  bio_short TEXT,
  bio_full TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  email TEXT NOT NULL DEFAULT 'sohamgitte125@gmail.com',
  phone TEXT DEFAULT '+91 7058574509',
  location TEXT DEFAULT 'Chhatrapati Sambhajinagar, Maharashtra, India',
  github_url TEXT DEFAULT 'https://github.com/sohamgitte',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/soham-gitte-609470306',
  twitter_url TEXT,
  website_url TEXT DEFAULT 'https://sohamgitte.in',
  hero_cta_primary_text TEXT DEFAULT 'Explore Projects',
  hero_cta_primary_link TEXT DEFAULT '#projects',
  hero_cta_secondary_text TEXT DEFAULT 'Download Resume',
  hero_cta_secondary_link TEXT DEFAULT '#resume',
  availability_status TEXT DEFAULT 'Open for Internships & High-Impact Tech Projects',
  sections_config JSONB NOT NULL DEFAULT '{
    "about": true,
    "skills": true,
    "projects": true,
    "experience": true,
    "education": true,
    "certificates": true,
    "achievements": true,
    "resume": true,
    "contact": true
  }'::jsonb,
  seo_settings JSONB NOT NULL DEFAULT '{
    "meta_title": "Soham Gitte | Software Engineer & Builder | SohamLabs",
    "meta_description": "Full-Stack Developer, Computer Engineering student at JNEC, builder of scalable web applications.",
    "og_image": "/soham-photo.jpg"
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER tr_profile_settings_updated_at
BEFORE UPDATE ON public.profile_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(display_order);

CREATE OR REPLACE TRIGGER tr_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  employment_type TEXT DEFAULT 'Internship',
  location TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiences_status ON public.experiences(status);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON public.experiences(display_order);

CREATE OR REPLACE TRIGGER tr_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  location TEXT,
  start_year TEXT NOT NULL,
  end_year TEXT,
  grade TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_educations_status ON public.educations(status);
CREATE INDEX IF NOT EXISTS idx_educations_order ON public.educations(display_order);

CREATE OR REPLACE TRIGGER tr_educations_updated_at
BEFORE UPDATE ON public.educations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'tools_design', 'core')),
  level TEXT DEFAULT 'Intermediate',
  icon TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_status ON public.skills(status);

CREATE OR REPLACE TRIGGER tr_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates(status);

CREATE OR REPLACE TRIGGER tr_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Milestone',
  organization TEXT,
  date TEXT,
  description TEXT,
  link_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_status ON public.achievements(status);

CREATE OR REPLACE TRIGGER tr_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. CONTACT MESSAGES (PRIVATE & SECURE)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT 'New Portfolio Contact Message',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON public.contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ADMIN_USERS Policies
-- Only authenticated admins can view admin_users list
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- PROFILE_SETTINGS Policies
-- Anyone can view profile settings (Public read)
CREATE POLICY "Public can view profile_settings"
  ON public.profile_settings
  FOR SELECT
  TO public
  USING (true);

-- Only verified admin can modify profile settings
CREATE POLICY "Admin full manage profile_settings"
  ON public.profile_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- PROJECTS Policies
-- Public can view only published projects
CREATE POLICY "Public can view published projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (status = 'published');

-- Admin has full access to all projects
CREATE POLICY "Admin full manage projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- EXPERIENCES Policies
CREATE POLICY "Public can view published experiences"
  ON public.experiences
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Admin full manage experiences"
  ON public.experiences
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- EDUCATIONS Policies
CREATE POLICY "Public can view published educations"
  ON public.educations
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Admin full manage educations"
  ON public.educations
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- SKILLS Policies
CREATE POLICY "Public can view published skills"
  ON public.skills
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Admin full manage skills"
  ON public.skills
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- CERTIFICATES Policies
CREATE POLICY "Public can view published certificates"
  ON public.certificates
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Admin full manage certificates"
  ON public.certificates
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ACHIEVEMENTS Policies
CREATE POLICY "Public can view published achievements"
  ON public.achievements
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Admin full manage achievements"
  ON public.achievements
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- CONTACT_MESSAGES Policies
-- Public can ONLY insert new message (cannot read any message!)
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  TO public
  WITH CHECK (
    char_length(name) > 0 AND char_length(name) <= 100 AND
    char_length(email) > 3 AND char_length(email) <= 150 AND
    char_length(message) > 0 AND char_length(message) <= 3000
  );

-- Only verified admin can view, update (mark read), or delete contact messages
CREATE POLICY "Admin full manage contact messages"
  ON public.contact_messages
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- STORAGE BUCKET CONFIGURATION & POLICIES
-- =============================================================================

-- Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf'];

-- Storage RLS: Public can read all assets in portfolio-assets bucket
CREATE POLICY "Public Read Portfolio Assets"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-assets');

-- Storage RLS: Only authorized admin can upload, modify, or delete assets
CREATE POLICY "Admin Insert Portfolio Assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admin Update Portfolio Assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admin Delete Portfolio Assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin());

-- =============================================================================
-- SUPABASE REALTIME REPLICATION
-- =============================================================================
-- Enable realtime publication for live updates on the portfolio website
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'profile_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_settings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'experiences'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.experiences;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'educations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.educations;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'skills'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.skills;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'certificates'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'achievements'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.achievements;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'contact_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
  END IF;
END $$;
