import React, { useState } from 'react';
import {
  User,
  Upload,
  Camera,
  FileText,
  Check,
  AlertCircle,
  Eye,
  Share2,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProfileSettings } from '../../types';
import { uploadAsset } from '../../lib/storage';

export const AdminProfile: React.FC = () => {
  const { profile, updateProfile } = usePortfolio();
  const [formData, setFormData] = useState<ProfileSettings>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState<number | null>(null);
  const [resumeProgress, setResumeProgress] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionToggle = (sectionKey: string) => {
    setFormData((prev) => ({
      ...prev,
      sections_config: {
        ...prev.sections_config,
        [sectionKey]: !prev.sections_config[sectionKey],
      },
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAvatarProgress(10);
      const res = await uploadAsset(file, {
        folder: 'profile',
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxSizeBytes: 5 * 1024 * 1024,
        onProgress: (p) => setAvatarProgress(p),
      });

      setFormData((prev) => ({ ...prev, avatar_url: res.url }));
      setSaveStatus({ type: 'success', message: 'Profile photo updated! Click "Save Changes" to publish.' });
    } catch (err) {
      setSaveStatus({ type: 'error', message: (err as Error).message || 'Photo upload failed' });
    } finally {
      setAvatarProgress(null);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setResumeProgress(10);
      const res = await uploadAsset(file, {
        folder: 'resumes',
        allowedTypes: ['application/pdf'],
        maxSizeBytes: 10 * 1024 * 1024,
        onProgress: (p) => setResumeProgress(p),
      });

      setFormData((prev) => ({ ...prev, resume_url: res.url }));
      setSaveStatus({ type: 'success', message: 'Resume PDF uploaded! Click "Save Changes" to publish.' });
    } catch (err) {
      setSaveStatus({ type: 'error', message: (err as Error).message || 'Resume upload failed' });
    } finally {
      setResumeProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      await updateProfile(formData);
      setSaveStatus({ type: 'success', message: 'Profile & site settings published live successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSaveStatus({ type: 'error', message: (err as Error).message || 'Failed to update profile settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const sectionKeys = [
    { key: 'about', label: 'About & Academic Trajectory' },
    { key: 'skills', label: 'Technical Stack & Skills' },
    { key: 'projects', label: 'Engineering Projects' },
    { key: 'experience', label: 'Experience & Ambassadorships' },
    { key: 'education', label: 'Education Credentials' },
    { key: 'certificates', label: 'Certificates & Qualifications' },
    { key: 'achievements', label: 'Key Milestones & Honors' },
    { key: 'resume', label: 'Curriculum Vitae / Resume' },
    { key: 'contact', label: 'Inbound Contact Section' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-heading">Profile & Site Settings</h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Configure identity, narrative bio, mobile uploads, contact links, and section visibility.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 font-sans"
        >
          {isSaving ? 'Publishing Changes...' : 'Save & Publish Live'}
        </button>
      </div>

      {saveStatus && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs leading-relaxed ${
            saveStatus.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Profile Photos & Resume Assets Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 font-heading flex items-center gap-2">
            <Camera className="w-4 h-4 text-neutral-900" />
            <span>Visual Assets & Documents</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Avatar Uploader */}
            <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-4">
              <label className="block text-xs font-semibold text-neutral-700 font-sans">
                Profile Avatar Photo
              </label>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-200 overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    src={formData.avatar_url || '/soham-photo.jpg'}
                    alt="Soham Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-300 text-xs font-semibold text-neutral-800 flex items-center justify-center gap-2 transition-colors shadow-xs">
                    <Camera className="w-4 h-4 text-neutral-700" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                  <p className="text-[10px] text-neutral-500 font-sans">
                    Supports Android camera capture, gallery selection (JPG, PNG, WEBP).
                  </p>
                </div>
              </div>

              {avatarProgress !== null && (
                <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-neutral-900 h-full transition-all" style={{ width: `${avatarProgress}%` }} />
                </div>
              )}
            </div>

            {/* Resume PDF Uploader */}
            <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-4">
              <label className="block text-xs font-semibold text-neutral-700 font-sans">
                Resume PDF Document
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 text-xs font-mono shadow-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-neutral-900 flex-shrink-0" />
                    <span className="truncate">{formData.resume_url ? 'Resume Attached' : 'No PDF'}</span>
                  </div>
                  {formData.resume_url && (
                    <a
                      href={formData.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-900 font-bold hover:underline flex items-center gap-1 font-sans"
                    >
                      <span>Preview</span>
                    </a>
                  )}
                </div>

                <label className="cursor-pointer w-full py-2 px-4 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-300 text-xs font-semibold text-neutral-800 flex items-center justify-center gap-2 transition-colors shadow-xs">
                  <Upload className="w-4 h-4 text-neutral-700" />
                  <span>Replace Resume PDF (Max 10MB)</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                </label>
              </div>

              {resumeProgress !== null && (
                <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-neutral-900 h-full transition-all" style={{ width: `${resumeProgress}%` }} />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Identity & Biography Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 font-heading flex items-center gap-2">
            <User className="w-4 h-4 text-neutral-900" />
            <span>Identity & Biography</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Full Legal Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Professional Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Headline Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Short Hero Bio</label>
            <textarea
              rows={2}
              name="bio_short"
              value={formData.bio_short}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Full Narrative Story (About Section)</label>
            <textarea
              rows={6}
              name="bio_full"
              value={formData.bio_full}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 resize-none leading-relaxed font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Availability Status Tag</label>
            <input
              type="text"
              name="availability_status"
              value={formData.availability_status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-sans"
            />
          </div>
        </div>

        {/* Contact & Social Networks Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 font-heading flex items-center gap-2">
            <Share2 className="w-4 h-4 text-neutral-900" />
            <span>Contact Information & Social URLs</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Contact Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Mobile Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">GitHub Profile URL</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">LinkedIn Profile URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section Visibility Toggles Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 font-heading flex items-center gap-2">
            <Eye className="w-4 h-4 text-neutral-900" />
            <span>Public Section Visibility Toggles</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sectionKeys.map((s) => (
              <label
                key={s.key}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  formData.sections_config[s.key] !== false
                    ? 'bg-neutral-50 border-neutral-300 text-neutral-900 font-semibold'
                    : 'bg-white border-neutral-200 text-neutral-400'
                }`}
              >
                <span className="text-xs font-sans">{s.label}</span>
                <input
                  type="checkbox"
                  checked={formData.sections_config[s.key] !== false}
                  onChange={() => handleSectionToggle(s.key)}
                  className="rounded bg-white border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 active:scale-95 transition-all shadow-sm disabled:opacity-50 font-sans"
          >
            {isSaving ? 'Publishing Updates...' : 'Save & Publish Live'}
          </button>
        </div>

      </form>
    </div>
  );
};
