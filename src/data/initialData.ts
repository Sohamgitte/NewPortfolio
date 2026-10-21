import {
  ProfileSettings,
  Project,
  Experience,
  Education,
  Skill,
  Certificate,
  Achievement,
} from '../types';

export const initialProfileSettings: ProfileSettings = {
  id: 'a0000000-0000-0000-0000-000000000001',
  full_name: 'Soham Gitte',
  title: 'Computer Engineering Student & Full-Stack Developer',
  tagline: 'B.Tech CSE @ JNEC’29 | MIT’26 CS | Tech × Design × Entrepreneurship',
  bio_short:
    'Passionate tech enthusiast, developer, and creative problem-solver who enjoys turning ideas into scalable, user-friendly digital experiences.',
  bio_full: `Hi, I'm Soham Gitte, a passionate tech enthusiast, developer, entrepreneur and creative problem-solver who enjoys turning ideas into meaningful digital experiences. I'm particularly interested in building products that are not only functional but also scalable, user-friendly, and visually engaging.

Currently pursuing a B.Tech in Computer Science and Engineering at Jawaharlal Nehru Engineering College (JNEC), MGM University. Before beginning my B.Tech journey, I completed my Diploma in Computer Engineering from Marathwada Institute of Technology (MIT), affiliated with MSBTE. My diploma journey gave me a strong foundation in programming, web development, UI/UX design, and project development—and that's where my passion for technology truly started.

Beyond academics, I'm focused on learning continuously, building real-world projects, collaborating with ambitious people, and exploring opportunities that help me grow as a developer and builder.`,
  avatar_url: '/soham-photo.jpg',
  resume_url: '/Soham_Gitte_Resume.pdf',
  email: 'sohamgitte125@gmail.com',
  phone: '+91 7058574509',
  location: 'Chhatrapati Sambhajinagar, Maharashtra, India',
  github_url: 'https://github.com/sohamgitte',
  linkedin_url: 'https://www.linkedin.com/in/soham-gitte-609470306',
  twitter_url: '',
  website_url: 'https://sohamgitte.in',
  hero_cta_primary_text: 'Explore Projects',
  hero_cta_primary_link: '#projects',
  hero_cta_secondary_text: 'Download Resume',
  hero_cta_secondary_link: '#resume',
  availability_status: 'Open for Internships, Tech Collaborations & Mentorship',
  sections_config: {
    about: true,
    skills: true,
    projects: true,
    experience: true,
    education: true,
    certificates: true,
    achievements: true,
    resume: true,
    contact: true,
  },
  seo_settings: {
    meta_title: 'Soham Gitte | Software Engineer & Builder | SohamLabs',
    meta_description:
      'Personal portfolio and engineering showcase of Soham Gitte. Full-Stack Developer specializing in React, Node.js, and PostgreSQL.',
    og_image: '/soham-photo.jpg',
  },
};

export const initialProjects: Project[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    title: 'Quick-Fix Home Services',
    slug: 'quick-fix-home-services',
    summary:
      'An on-demand home service marketplace connecting customers with vetted local technicians like plumbers, electricians, and carpenters.',
    description:
      'Developed during internship at Just Logic Software. Quick-Fix is a full-stack platform designed to streamline booking home repair services. Features an interactive service catalog, transparent pricing, customer reviews, provider dispatch workflows, and responsive UI with clean RESTful backend endpoints.',
    image_url: '/soham-photo.jpg',
    technologies: ['HTML5', 'CSS3', 'Bootstrap 5', 'Node.js', 'Express.js', 'PostgreSQL'],
    demo_url: 'https://sohamgitte.in',
    github_url: 'https://github.com/sohamgitte',
    is_featured: true,
    status: 'published',
    display_order: 1,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    title: 'SohamLabs Portfolio CMS',
    slug: 'sohamlabs-portfolio-cms',
    summary:
      'A high-performance personal developer portfolio and mobile-first headless CMS with Supabase Auth, PostgreSQL, Realtime sync, and PWA capabilities.',
    description:
      'Engineered to allow 100% autonomous content editing from mobile phones without rebuilding. Features strict Row Level Security, instant live publishing, client-side input validation, accessible dark UI, and service-worker PWA offline support.',
    image_url: '/soham-photo.jpg',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'PWA'],
    demo_url: 'https://sohamgitte.in',
    github_url: 'https://github.com/sohamgitte/portfolio-cms',
    is_featured: true,
    status: 'published',
    display_order: 2,
  },
];

export const initialExperiences: Experience[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    company: 'Naukri Campus',
    position: 'Campus Ambassador',
    employment_type: 'Ambassador',
    location: 'Maharashtra, India',
    start_date: 'July 2026',
    end_date: null,
    is_current: true,
    description:
      'Representing Naukri Campus to bridge the gap between academic education and corporate employment opportunities for engineering students.',
    highlights: [
      'Organized campus awareness initiatives on student hiring trends, competitive technical tests, and industry skill benchmarks',
      'Guided peers on resume crafting, internship hunting, and early career placement preparations',
    ],
    technologies: ['Leadership', 'Public Speaking', 'Community Building', 'Career Development'],
    status: 'published',
    display_order: 1,
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    company: 'CampusCrew',
    position: 'Campuscrew Ambassador',
    employment_type: 'Ambassador',
    location: 'Maharashtra, India',
    start_date: 'June 2026',
    end_date: null,
    is_current: true,
    description:
      'Engaging student developer communities, fostering peer-to-peer technical mentorship, and driving awareness of student opportunities.',
    highlights: [
      'Coordinated collaborative student developer meetups and interactive technical sessions',
      'Facilitated student engagement across campus tech clubs',
    ],
    technologies: ['Community Engagement', 'Networking', 'Developer Advocacy'],
    status: 'published',
    display_order: 2,
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    company: 'PurnaFinX',
    position: 'Brand Ambassador',
    employment_type: 'Ambassador',
    location: 'Maharashtra, India',
    start_date: 'November 2025',
    end_date: null,
    is_current: true,
    description:
      'Representing PurnaFinX as Brand Ambassador — championing financial literacy, engaging student communities, and building a stronger youth finance ecosystem.',
    highlights: [
      'Advocated smart financial education and budgeting awareness among university students',
      'Conducted outreach campaigns connecting young professionals with modern financial technology tools',
    ],
    technologies: ['Fintech Awareness', 'Brand Ambassadorship', 'Youth Engagement'],
    status: 'published',
    display_order: 3,
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    company: 'JUST LOGIC SOFTWARE PVT LTD',
    position: 'Web Development Intern',
    employment_type: 'Internship',
    location: 'Chhatrapati Sambhajinagar, Maharashtra, India',
    start_date: 'June 2025',
    end_date: 'September 2025',
    is_current: false,
    description:
      'Gained hands-on experience in full-stack web application development, real-world system architecture, database modeling, and deployment practices.',
    highlights: [
      'Architected and implemented Quick-Fix Home Services full-stack application connecting customers with skilled tradespeople',
      'Engineered responsive frontend interfaces using HTML5, CSS3, and Bootstrap 5',
      'Implemented backend RESTful APIs with Node.js and Express.js backed by PostgreSQL database',
    ],
    technologies: ['HTML5', 'CSS3', 'Bootstrap 5', 'Node.js', 'Express.js', 'PostgreSQL', 'REST APIs'],
    status: 'published',
    display_order: 4,
  },
];

export const initialEducations: Education[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    institution: "M.G.M's Jawaharlal Nehru College of Engineering (JNEC), MGM University",
    degree: 'Bachelor of Technology (B.Tech)',
    field_of_study: 'Computer Science and Engineering',
    location: 'Chhatrapati Sambhajinagar, Maharashtra',
    start_year: '2026',
    end_year: '2029',
    grade: 'Pursuing',
    description:
      'Focusing on advanced algorithms, distributed systems, database design, software architecture, and emerging AI technologies.',
    status: 'published',
    display_order: 1,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    institution: 'Marathwada Institute of Technology (MIT) Engineering College',
    degree: 'Diploma in Engineering',
    field_of_study: 'Computer Engineering',
    location: 'Satara Road, Chhatrapati Sambhajinagar, Maharashtra',
    start_year: '2023',
    end_year: '2026',
    grade: 'First Class with Distinction',
    description:
      'Built strong fundamentals in programming, object-oriented concepts, web design, UI/UX, database management, and hands-on lab projects.',
    status: 'published',
    display_order: 2,
  },
];

export const initialSkills: Skill[] = [
  { id: 's1', name: 'HTML5 & CSS3', category: 'frontend', level: 'Advanced', icon: 'Code', status: 'published', display_order: 1 },
  { id: 's2', name: 'JavaScript (ES6+)', category: 'frontend', level: 'Advanced', icon: 'FileCode', status: 'published', display_order: 2 },
  { id: 's3', name: 'TypeScript', category: 'frontend', level: 'Intermediate', icon: 'FileCode2', status: 'published', display_order: 3 },
  { id: 's4', name: 'React.js', category: 'frontend', level: 'Advanced', icon: 'Atom', status: 'published', display_order: 4 },
  { id: 's5', name: 'Tailwind CSS', category: 'frontend', level: 'Advanced', icon: 'Palette', status: 'published', display_order: 5 },
  { id: 's6', name: 'Bootstrap 5', category: 'frontend', level: 'Advanced', icon: 'Layout', status: 'published', display_order: 6 },
  { id: 's7', name: 'Responsive Web Design', category: 'frontend', level: 'Advanced', icon: 'Smartphone', status: 'published', display_order: 7 },

  { id: 's8', name: 'Node.js', category: 'backend', level: 'Intermediate', icon: 'Server', status: 'published', display_order: 8 },
  { id: 's9', name: 'Express.js', category: 'backend', level: 'Intermediate', icon: 'Layers', status: 'published', display_order: 9 },
  { id: 's10', name: 'RESTful API Design', category: 'backend', level: 'Intermediate', icon: 'Network', status: 'published', display_order: 10 },

  { id: 's11', name: 'PostgreSQL', category: 'database', level: 'Intermediate', icon: 'Database', status: 'published', display_order: 11 },
  { id: 's12', name: 'MongoDB', category: 'database', level: 'Intermediate', icon: 'Database', status: 'published', display_order: 12 },

  { id: 's13', name: 'UI/UX Design & Figma', category: 'tools_design', level: 'Advanced', icon: 'Figma', status: 'published', display_order: 13 },
  { id: 's14', name: 'Git & GitHub', category: 'tools_design', level: 'Advanced', icon: 'GitBranch', status: 'published', display_order: 14 },
  { id: 's15', name: 'AI Tools & Prompt Engineering', category: 'tools_design', level: 'Intermediate', icon: 'Sparkles', status: 'published', display_order: 15 },

  { id: 's16', name: 'Competitive Analysis', category: 'core', level: 'Advanced', icon: 'TrendingUp', status: 'published', display_order: 16 },
  { id: 's17', name: 'Entrepreneurship & Start-up Ventures', category: 'core', level: 'Intermediate', icon: 'Briefcase', status: 'published', display_order: 17 },
  { id: 's18', name: 'Creative Problem Solving', category: 'core', level: 'Advanced', icon: 'Lightbulb', status: 'published', display_order: 18 },
];

export const initialCertificates: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Vista Equity Partners - AI in Action Job Simulation',
    issuer: 'Forage / Vista Equity Partners',
    issue_date: '2026',
    credential_id: 'VEP-AI-2026',
    credential_url: 'https://www.theforage.com',
    status: 'published',
    display_order: 1,
  },
  {
    id: 'cert-2',
    title: 'Create Your First Gemini Enterprise Application',
    issuer: 'Google Cloud & DeepMind',
    issue_date: '2026',
    credential_id: 'GCP-GEMINI-ENT-01',
    credential_url: 'https://cloud.google.com',
    status: 'published',
    display_order: 2,
  },
  {
    id: 'cert-3',
    title: 'Claude Code in Action',
    issuer: 'Anthropic',
    issue_date: '2026',
    credential_id: 'ANTH-CLAUDE-ACT-01',
    credential_url: 'https://anthropic.com',
    status: 'published',
    display_order: 3,
  },
  {
    id: 'cert-4',
    title: 'Implement Cloud Security Fundamentals on Google Cloud',
    issuer: 'Google Cloud Skills Boost',
    issue_date: '2025',
    credential_id: 'GCP-SEC-FUND-2025',
    credential_url: 'https://www.cloudskillsboost.google',
    status: 'published',
    display_order: 4,
  },
  {
    id: 'cert-5',
    title: 'MongoDB Basics for Students',
    issuer: 'MongoDB University',
    issue_date: '2025',
    credential_id: 'MDB-STU-BASICS',
    credential_url: 'https://learn.mongodb.com',
    status: 'published',
    display_order: 5,
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Fintech Ecosystem Advocacy',
    category: 'Brand Ambassador Recognition',
    organization: 'PurnaFinX',
    date: '2025 - 2026',
    description:
      'Promoted financial literacy and modern fintech products across college campuses in Maharashtra, onboarding hundreds of students to financial education tracks.',
    link_url: 'https://www.linkedin.com/in/soham-gitte-609470306',
    status: 'published',
    display_order: 1,
  },
  {
    id: 'ach-2',
    title: 'Student Career & Tech Ambassador',
    category: 'Campus Ambassador',
    organization: 'Naukri Campus',
    date: '2026',
    description:
      'Empowering undergraduate engineering students with resume building strategies and corporate recruitment readiness.',
    link_url: 'https://www.linkedin.com/in/soham-gitte-609470306',
    status: 'published',
    display_order: 2,
  },
  {
    id: 'ach-3',
    title: 'Full-Stack Home Services Deployment',
    category: 'Technical Milestone',
    organization: 'Just Logic Software',
    date: '2025',
    description:
      'Independently developed Quick-Fix Home Services end-to-end as an intern project with full CRUD capabilities and PostgreSQL integration.',
    link_url: 'https://sohamgitte.in',
    status: 'published',
    display_order: 3,
  },
];
