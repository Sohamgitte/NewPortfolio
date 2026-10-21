import { describe, it, expect } from 'vitest';
import { ContactMessageSchema, ProjectSchema, ExperienceSchema } from '../types';
import { validateFile } from '../lib/storage';

describe('Security & Input Validation Suite', () => {
  describe('Contact Message Honeypot & Anti-Spam Protection', () => {
    it('accepts valid contact submission with empty honeypot', () => {
      const validPayload = {
        name: 'Soham Gitte',
        email: 'sohamgitte125@gmail.com',
        subject: 'Internship Inquiry',
        message: 'Hello Soham, we have an exciting engineering opening.',
        website: '', // Honeypot empty
      };

      const result = ContactMessageSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('rejects bot submission when honeypot field is filled', () => {
      const botPayload = {
        name: 'Bot Spammer',
        email: 'bot@spam.com',
        subject: 'Buy Crypto',
        message: 'Spam message content here for everyone.',
        website: 'https://spam-site.com', // Filled by automated bot
      };

      const result = ContactMessageSchema.safeParse(botPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Spam detected');
      }
    });

    it('rejects submissions with invalid email format', () => {
      const invalidEmailPayload = {
        name: 'Jane Doe',
        email: 'not-an-email',
        message: 'This is a genuine test message for validation.',
      };

      const result = ContactMessageSchema.safeParse(invalidEmailPayload);
      expect(result.success).toBe(false);
    });

    it('rejects submissions with message under 10 characters', () => {
      const shortPayload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hi', // Too short
      };

      const result = ContactMessageSchema.safeParse(shortPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('Project Schema Validation', () => {
    it('validates correct project structure and slug format', () => {
      const projectPayload = {
        title: 'Quick-Fix Home Services',
        slug: 'quick-fix-home-services',
        summary: 'On-demand home services platform for local mechanics and plumbers.',
        technologies: ['Node.js', 'PostgreSQL'],
        status: 'published' as const,
        display_order: 1,
        is_featured: true,
      };

      const result = ProjectSchema.safeParse(projectPayload);
      expect(result.success).toBe(true);
    });

    it('rejects project with invalid slug containing spaces or uppercase', () => {
      const invalidSlugPayload = {
        title: 'Test Project',
        slug: 'Invalid Slug With Spaces!',
        summary: 'This project has an invalid slug that would break routing.',
        technologies: ['React'],
      };

      const result = ProjectSchema.safeParse(invalidSlugPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('Storage File Validation', () => {
    it('allows valid image types under size limit', () => {
      const file = new File(['mock content'], 'avatar.png', { type: 'image/png' });
      const res = validateFile(file);
      expect(res.valid).toBe(true);
    });

    it('rejects unauthorized executable file types', () => {
      const maliciousFile = new File(['malicious script'], 'payload.exe', { type: 'application/x-msdownload' });
      const res = validateFile(maliciousFile);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('Invalid file format');
    });

    it('rejects files exceeding size limits', () => {
      // 15MB dummy file
      const bigBuffer = new Uint8Array(15 * 1024 * 1024);
      const bigFile = new File([bigBuffer], 'huge.jpg', { type: 'image/jpeg' });
      const res = validateFile(bigFile, undefined, 10 * 1024 * 1024);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('exceeds limit');
    });
  });
});
