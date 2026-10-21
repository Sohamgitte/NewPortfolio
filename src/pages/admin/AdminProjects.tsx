import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Star,
  Camera,
  X,
  AlertCircle,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, ProjectSchema } from '../../types';
import { uploadAsset } from '../../lib/storage';

export const AdminProjects: React.FC = () => {
  const { projects, saveProject, deleteProject } = usePortfolio();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.display_order - b.display_order);

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      slug: '',
      summary: '',
      description: '',
      image_url: '/soham-photo.jpg',
      technologies: ['React', 'TypeScript'],
      demo_url: '',
      github_url: '',
      is_featured: false,
      status: 'published',
      display_order: projects.length + 1,
    });
    setTechInput('');
    setFormError(null);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setTechInput('');
    setFormError(null);
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !editingProject) return;
    const current = editingProject.technologies || [];
    if (!current.includes(techInput.trim())) {
      setEditingProject({
        ...editingProject,
        technologies: [...current, techInput.trim()],
      });
    }
    setTechInput('');
  };

  const handleRemoveTech = (tag: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: (editingProject.technologies || []).filter((t) => t !== tag),
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    try {
      setUploadProgress(10);
      const res = await uploadAsset(file, {
        folder: 'projects',
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxSizeBytes: 8 * 1024 * 1024,
        onProgress: (p) => setUploadProgress(p),
      });

      setEditingProject({
        ...editingProject,
        image_url: res.url,
      });
    } catch (err) {
      alert(`Image upload failed: ${(err as Error).message}`);
    } finally {
      setUploadProgress(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setFormError(null);
    setIsSubmitting(true);

    // Auto-generate slug if blank
    const autoSlug =
      editingProject.slug?.trim() ||
      editingProject.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      'project';

    const candidate = {
      ...editingProject,
      slug: autoSlug,
      display_order: Number(editingProject.display_order) || 1,
      technologies: editingProject.technologies || [],
    };

    const parsed = ProjectSchema.safeParse(candidate);
    if (!parsed.success) {
      setIsSubmitting(false);
      setFormError(parsed.error.issues[0]?.message || 'Validation error');
      return;
    }

    try {
      await saveProject({
        ...parsed.data,
        id: editingProject.id,
      } as any);
      setEditingProject(null);
    } catch (err) {
      setFormError((err as Error).message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setDeleteConfirmId(null);
    } catch (err) {
      alert(`Delete failed: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-heading">Project Management</h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Create, update, order, and publish portfolio projects.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-white border border-neutral-200/90 flex flex-col justify-between hover:border-neutral-300 hover:shadow-md transition-all shadow-sm group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      project.status === 'published'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                    }`}
                  >
                    {project.status}
                  </span>

                  {project.is_featured && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="w-3 h-3 fill-current text-amber-500" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-colors shadow-xs"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors shadow-xs"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-neutral-900 mb-1.5 font-heading">
                {project.title}
              </h3>

              <p className="text-xs text-neutral-600 line-clamp-2 mb-4 font-sans leading-relaxed">
                {project.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200/80 text-[11px] font-semibold font-sans"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Order: #{project.display_order}</span>

              <div className="flex items-center gap-2">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-900"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-900"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-sm w-full p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 font-heading">Confirm Permanent Deletion</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Are you sure you want to permanently delete this project? This action will remove it from the live portfolio immediately.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-700 hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-sm"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <h3 className="text-lg font-bold text-neutral-900 font-heading">
                {editingProject.id ? 'Edit Project' : 'New Project'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Slug (URL friendly)</label>
                  <input
                    type="text"
                    value={editingProject.slug || ''}
                    placeholder="e.g. quick-fix-services"
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.summary || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Full Technical Description</label>
                <textarea
                  rows={4}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Phone Camera / File Picker Upload */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5 font-sans">
                  Project Screenshot / Mockup Image
                </label>
                
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0 shadow-xs">
                    {editingProject.image_url ? (
                      <img src={editingProject.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">None</div>
                    )}
                  </div>

                  <label className="flex-1 cursor-pointer py-2.5 px-4 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors shadow-xs">
                    <Camera className="w-4 h-4 text-neutral-700" />
                    <span>Upload Image (Android Camera / Gallery)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                  </label>
                </div>

                {uploadProgress !== null && (
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-neutral-900 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>

              {/* Technologies Tag Input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Technologies & Tools</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Node.js, PostgreSQL"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 shadow-xs"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(editingProject.technologies || []).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={editingProject.github_url || ''}
                    placeholder="https://github.com/..."
                    onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Live Demo URL</label>
                  <input
                    type="url"
                    value={editingProject.demo_url || ''}
                    placeholder="https://..."
                    onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                </div>
              </div>

              {/* Status and Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Publish Status</label>
                  <select
                    value={editingProject.status || 'published'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Private)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editingProject.display_order ?? 1}
                    onChange={(e) => setEditingProject({ ...editingProject, display_order: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700 font-sans">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProject.is_featured)}
                      onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                      className="rounded bg-white border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <span>Featured on Home</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-semibold font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 disabled:opacity-50 font-sans shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
