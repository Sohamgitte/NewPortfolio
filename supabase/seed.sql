-- =============================================================================
-- SohamLabs Portfolio CMS - Seed Data
-- =============================================================================
-- Authentic portfolio content for Soham Gitte
-- Run this in Supabase SQL Editor after running schema.sql
-- =============================================================================

-- Clear existing data if re-seeding
TRUNCATE TABLE public.projects, public.experiences, public.educations, public.skills, public.certificates, public.achievements, public.profile_settings CASCADE;

-- 1. PROFILE SETTINGS
INSERT INTO public.profile_settings (
  id,
  full_name,
  title,
  tagline,
  bio_short,
  bio_full,
  avatar_url,
  resume_url,
  email,
  phone,
  location,
  github_url,
  linkedin_url,
  twitter_url,
  website_url,
  hero_cta_primary_text,
  hero_cta_primary_link,
  hero_cta_secondary_text,
  hero_cta_secondary_link,
  availability_status,
  sections_config,
  seo_settings
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Soham Gitte',
  'Computer Engineering Student & Full-Stack Developer',
  'B.Tech CSE @ JNEC''29 | MIT''26 CS | Tech × Design × Entrepreneurship',
  'Passionate tech enthusiast, developer, and creative problem-solver who enjoys turning ideas into scalable, user-friendly digital experiences.',
  'Hi, I''m Soham Gitte, a passionate tech enthusiast, developer, entrepreneur and creative problem-solver who enjoys turning ideas into meaningful digital experiences. I''m particularly interested in building products that are not only functional but also scalable, user-friendly, and visually engaging.

Currently pursuing a B.Tech in Computer Science and Engineering at Jawaharlal Nehru Engineering College (JNEC), MGM University. Before beginning my B.Tech journey, I completed my Diploma in Computer Engineering from Marathwada Institute of Technology (MIT), affiliated with MSBTE. My diploma journey gave me a strong foundation in programming, web development, UI/UX design, and project development—and that''s where my passion for technology truly started.

Beyond academics, I''m focused on learning continuously, building real-world projects, collaborating with ambitious people, and exploring opportunities that help me grow as a developer and builder.',
  '/soham-photo.jpg',
  '/Soham_Gitte_Resume.pdf',
  'sohamgitte125@gmail.com',
  '+91 7058574509',
  'Chhatrapati Sambhajinagar, Maharashtra, India',
  'https://github.com/sohamgitte',
  'https://www.linkedin.com/in/soham-gitte-609470306',
  '',
  'https://sohamgitte.in',
  'Explore Projects',
  '#projects',
  'Download Resume',
  '#resume',
  'Open for Internships, Tech Collaborations & Mentorship',
  '{
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
  '{
    "meta_title": "Soham Gitte | Software Engineer & Builder | SohamLabs",
    "meta_description": "Portfolio of Soham Gitte - Computer Engineering student, full-stack developer with React, Node.js, and PostgreSQL expertise.",
    "og_image": "/soham-photo.jpg"
  }'::jsonb
);

-- 2. PROJECTS
INSERT INTO public.projects (
  title, slug, summary, description, image_url, technologies, demo_url, github_url, is_featured, status, display_order
) VALUES
(
  'Quick-Fix Home Services',
  'quick-fix-home-services',
  'An on-demand home service marketplace connecting customers with vetted local technicians like plumbers, electricians, and carpenters.',
  'Developed during internship at Just Logic Software. Quick-Fix is a full-stack on-demand platform designed to streamline finding, booking, and managing home utility and repair services. Features an interactive service catalog, transparent pricing, customer reviews, provider dispatch workflows, and responsive UI with clean RESTful backend endpoints.',
  '/quick-fix-mockup.png',
  ARRAY['HTML5', 'CSS3', 'Bootstrap 5', 'Node.js', 'Express.js', 'PostgreSQL'],
  'https://sohamgitte.in',
  'https://github.com/sohamgitte',
  true,
  'published',
  1
),
(
  'SohamLabs Portfolio CMS',
  'sohamlabs-portfolio-cms',
  'A high-performance personal developer portfolio and mobile-first headless CMS with Supabase Auth, PostgreSQL, Realtime sync, and PWA capabilities.',
  'Engineered from scratch to allow 100% autonomous content editing from mobile devices. Features strict Row Level Security, instant live publishing without rebuilding or redeployment, client-side input validation, accessible dark UI, and service-worker PWA offline support.',
  '/soham-photo.jpg',
  ARRAY['React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'PWA'],
  'https://sohamgitte.in',
  'https://github.com/sohamgitte/portfolio-cms',
  true,
  'published',
  2
);

-- 3. EXPERIENCES
INSERT INTO public.experiences (
  company, position, employment_type, location, start_date, end_date, is_current, description, highlights, technologies, status, display_order
) VALUES
(
  'Naukri Campus',
  'Campus Ambassador',
  'Part-time / Ambassador',
  'Maharashtra, India',
  'July 2026',
  NULL,
  true,
  'Representing Naukri Campus to bridge the gap between academic education and corporate employment opportunities for engineering students.',
  ARRAY[
    'Organized campus awareness initiatives on student hiring trends, competitive technical tests, and industry skill benchmarks',
    'Guided peers on resume crafting, internship hunting, and early career placement preparations'
  ],
  ARRAY['Leadership', 'Public Speaking', 'Community Building', 'Career Development'],
  'published',
  1
),
(
  'CampusCrew',
  'Campuscrew Ambassador',
  'Part-time / Ambassador',
  'Maharashtra, India',
  'June 2026',
  NULL,
  true,
  'Engaging student developer communities, fostering peer-to-peer technical mentorship, and driving awareness of student opportunities.',
  ARRAY[
    'Coordinated collaborative student developer meetups and interactive technical sessions',
    'Facilitated student engagement across campus tech clubs'
  ],
  ARRAY['Community Engagement', 'Networking', 'Developer Advocacy'],
  'published',
  2
),
(
  'PurnaFinX',
  'Brand Ambassador',
  'Part-time / Ambassador',
  'Maharashtra, India',
  'November 2025',
  NULL,
  true,
  'Representing PurnaFinX as Brand Ambassador — championing financial literacy, engaging student communities, and building a stronger youth finance ecosystem.',
  ARRAY[
    'Advocated smart financial education and budgeting awareness among university students',
    'Conducted outreach campaigns connecting young professionals with modern financial technology tools'
  ],
  ARRAY['Fintech Awareness', 'Brand Ambassadorship', 'Youth Engagement'],
  'published',
  3
),
(
  'JUST LOGIC SOFTWARE PVT LTD',
  'Web Development Intern',
  'Internship',
  'Chhatrapati Sambhajinagar, Maharashtra, India',
  'June 2025',
  'September 2025',
  false,
  'Gained hands-on experience in full-stack web application development, real-world system architecture, database modeling, and deployment practices.',
  ARRAY[
    'Architected and implemented Quick-Fix Home Services full-stack application connecting customers with skilled tradespeople',
    'Engineered responsive frontend interfaces using HTML5, CSS3, and Bootstrap 5',
    'Implemented backend RESTful APIs with Node.js and Express.js backed by PostgreSQL database'
  ],
  ARRAY['HTML5', 'CSS3', 'Bootstrap 5', 'Node.js', 'Express.js', 'PostgreSQL', 'REST APIs'],
  'published',
  4
);

-- 4. EDUCATIONS
INSERT INTO public.educations (
  institution, degree, field_of_study, location, start_year, end_year, grade, description, status, display_order
) VALUES
(
  'M.G.M''s Jawaharlal Nehru College of Engineering (JNEC), MGM University',
  'Bachelor of Technology (B.Tech)',
  'Computer Science and Engineering',
  'Chhatrapati Sambhajinagar, Maharashtra',
  '2026',
  '2029',
  'Pursuing',
  'Focusing on advanced algorithms, distributed computing, database systems, software architecture, and emerging AI technologies.',
  'published',
  1
),
(
  'Marathwada Institute of Technology (MIT) Engineering College',
  'Diploma in Engineering',
  'Computer Engineering',
  'Satara Road, Chhatrapati Sambhajinagar, Maharashtra',
  '2023',
  '2026',
  'Graduated with Distinction',
  'Built strong fundamentals in programming, object-oriented concepts, web design, UI/UX, database management, and hands-on lab projects.',
  'published',
  2
);

-- 5. SKILLS
INSERT INTO public.skills (name, category, level, icon, status, display_order) VALUES
-- Frontend
('HTML5 & CSS3', 'frontend', 'Advanced', 'Code', 'published', 1),
('JavaScript (ES6+)', 'frontend', 'Advanced', 'FileCode', 'published', 2),
('TypeScript', 'frontend', 'Intermediate', 'FileCode2', 'published', 3),
('React.js', 'frontend', 'Advanced', 'Atom', 'published', 4),
('Tailwind CSS', 'frontend', 'Advanced', 'Palette', 'published', 5),
('Bootstrap 5', 'frontend', 'Advanced', 'Layout', 'published', 6),
('Responsive Web Design', 'frontend', 'Advanced', 'Smartphone', 'published', 7),
-- Backend & Database
('Node.js', 'backend', 'Intermediate', 'Server', 'published', 8),
('Express.js', 'backend', 'Intermediate', 'Layers', 'published', 9),
('PostgreSQL', 'database', 'Intermediate', 'Database', 'published', 10),
('MongoDB', 'database', 'Intermediate', 'Database', 'published', 11),
('RESTful API Design', 'backend', 'Intermediate', 'Network', 'published', 12),
-- Tools & Design
('UI/UX Design & Figma', 'tools_design', 'Advanced', 'Figma', 'published', 13),
('Git & GitHub', 'tools_design', 'Advanced', 'GitBranch', 'published', 14),
('AI Tools & Prompt Engineering', 'tools_design', 'Intermediate', 'Sparkles', 'published', 15),
-- Core & Professional
('Competitive Analysis', 'core', 'Advanced', 'TrendingUp', 'published', 16),
('Entrepreneurship & Start-up Ventures', 'core', 'Intermediate', 'Briefcase', 'published', 17),
('Creative Problem Solving', 'core', 'Advanced', 'Lightbulb', 'published', 18);

-- 6. CERTIFICATES
INSERT INTO public.certificates (
  title, issuer, issue_date, credential_id, credential_url, file_url, status, display_order
) VALUES
(
  'Vista Equity Partners - AI in Action Job Simulation',
  'Forage / Vista Equity Partners',
  '2026',
  'VEP-AI-2026',
  'https://www.theforage.com',
  '',
  'published',
  1
),
(
  'Create Your First Gemini Enterprise Application',
  'Google Cloud & DeepMind',
  '2026',
  'GCP-GEMINI-ENT-01',
  'https://cloud.google.com',
  '',
  'published',
  2
),
(
  'Claude Code in Action',
  'Anthropic',
  '2026',
  'ANTH-CLAUDE-ACT-01',
  'https://anthropic.com',
  '',
  'published',
  3
),
(
  'Implement Cloud Security Fundamentals on Google Cloud',
  'Google Cloud Skills Boost',
  '2025',
  'GCP-SEC-FUND-2025',
  'https://www.cloudskillsboost.google',
  '',
  'published',
  4
),
(
  'MongoDB Basics for Students',
  'MongoDB University',
  '2025',
  'MDB-STU-BASICS',
  'https://learn.mongodb.com',
  '',
  'published',
  5
);

-- 7. ACHIEVEMENTS
INSERT INTO public.achievements (
  title, category, organization, date, description, link_url, status, display_order
) VALUES
(
  'Fintech Ecosystem Advocacy',
  'Brand Ambassador Recognition',
  'PurnaFinX',
  '2025 - 2026',
  'Promoted financial literacy and modern fintech products across college campuses in Maharashtra, onboarding hundreds of students to financial education tracks.',
  'https://www.linkedin.com/in/soham-gitte-609470306',
  'published',
  1
),
(
  'Student Career & Tech Ambassador',
  'Campus Ambassador',
  'Naukri Campus',
  '2026',
  'Empowering undergraduate engineering students with resume building strategies and corporate recruitment readiness.',
  'https://www.linkedin.com/in/soham-gitte-609470306',
  'published',
  2
),
(
  'Full-Stack Home Services Deployment',
  'Technical Milestone',
  'Just Logic Software',
  '2025',
  'Independently developed Quick-Fix Home Services end-to-end as an intern project with full CRUD capabilities and PostgreSQL integration.',
  'https://sohamgitte.in',
  'published',
  3
);
