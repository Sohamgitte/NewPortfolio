import { z } from 'zod';

// =============================================================================
// DATABASE MODEL TYPES
// =============================================================================

export type ContentStatus = 'draft' | 'published';

export interface ProfileSettings {
  id: string;
  full_name: string;
  title: string;
  tagline: string;
  bio_short: string;
  bio_full: string;
  avatar_url: string;
  resume_url: string;
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  twitter_url?: string;
  website_url: string;
  hero_cta_primary_text: string;
  hero_cta_primary_link: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_link: string;
  availability_status: string;
  sections_config: Record<string, boolean>;
  seo_settings: {
    meta_title: string;
    meta_description: string;
    og_image?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  image_url?: string;
  technologies: string[];
  demo_url?: string;
  github_url?: string;
  is_featured: boolean;
  status: ContentStatus;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  employment_type: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  status: ContentStatus;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  location?: string;
  start_year: string;
  end_year?: string;
  grade?: string;
  description?: string;
  status: ContentStatus;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'tools_design' | 'core';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: string;
  icon?: string;
  status: ContentStatus;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  credential_id?: string;
  credential_url?: string;
  file_url?: string;
  status: ContentStatus;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  organization?: string;
  date?: string;
  description: string;
  link_url?: string;
  status: ContentStatus;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  user_agent?: string;
  ip_hash?: string;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at?: string;
}

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

export const ContactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address').max(150),
  subject: z.string().max(200).optional().default('General Inquiry'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000, 'Message cannot exceed 3000 characters'),
  website: z.string().max(0, 'Spam detected').optional(), // Honeypot field: must be empty
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;

export const ProjectSchema = z.object({
  title: z.string().min(2, 'Title is required').max(150),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and dashes'),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(300),
  description: z.string().optional(),
  image_url: z.string().optional(),
  technologies: z.array(z.string()).min(1, 'Add at least one technology'),
  demo_url: z.string().url('Invalid URL').or(z.literal('')).optional(),
  github_url: z.string().url('Invalid URL').or(z.literal('')).optional(),
  is_featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published'),
  display_order: z.number().int().default(0),
});

export const ExperienceSchema = z.object({
  company: z.string().min(2, 'Company is required'),
  position: z.string().min(2, 'Position is required'),
  employment_type: z.string().default('Internship'),
  location: z.string().optional(),
  start_date: z.string().min(2, 'Start date is required'),
  end_date: z.string().nullable().optional(),
  is_current: z.boolean().default(false),
  description: z.string().min(5, 'Description is required'),
  highlights: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('published'),
  display_order: z.number().int().default(0),
});

export const SkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['frontend', 'backend', 'database', 'tools_design', 'core']),
  level: z.string().default('Intermediate'),
  icon: z.string().optional(),
  status: z.enum(['draft', 'published']).default('published'),
  display_order: z.number().int().default(0),
});

export const CertificateSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  issuer: z.string().min(2, 'Issuer is required'),
  issue_date: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().url('Invalid URL').or(z.literal('')).optional(),
  file_url: z.string().optional(),
  status: z.enum(['draft', 'published']).default('published'),
  display_order: z.number().int().default(0),
});

export const EducationSchema = z.object({
  institution: z.string().min(2, 'Institution name is required'),
  degree: z.string().min(2, 'Degree is required'),
  field_of_study: z.string().min(2, 'Field of study is required'),
  location: z.string().optional(),
  start_year: z.string().min(4, 'Start year is required'),
  end_year: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published']).default('published'),
  display_order: z.number().int().default(0),
});

export const ProfileSettingsSchema = z.object({
  full_name: z.string().min(2),
  title: z.string().min(2),
  tagline: z.string().min(2),
  bio_short: z.string().min(10),
  bio_full: z.string().min(20),
  avatar_url: z.string(),
  resume_url: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  github_url: z.string().url().or(z.literal('')),
  linkedin_url: z.string().url().or(z.literal('')),
  twitter_url: z.string().url().or(z.literal('')).optional(),
  website_url: z.string().url().or(z.literal('')),
  hero_cta_primary_text: z.string(),
  hero_cta_primary_link: z.string(),
  hero_cta_secondary_text: z.string(),
  hero_cta_secondary_link: z.string(),
  availability_status: z.string(),
});
