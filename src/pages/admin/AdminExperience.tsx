import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Experience, ExperienceSchema } from '../../types';

export const AdminExperience: React.FC = () => {
  const { experiences, saveExperience, deleteExperience } = usePortfolio();
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');
  const [techInput, setTechInput] = useState('');

  const handleOpenCreate = () => {
    setEditingExp({
      company: '',
      position: '',
      employment_type: 'Internship',
      location: 'Maharashtra, India',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      highlights: [],
      technologies: [],
      status: 'published',
      display_order: experiences.length + 1,
    });
    setHighlightInput('');
    setTechInput('');
    setFormError(null);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setHighlightInput('');
    setTechInput('');
    setFormError(null);
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim() || !editingExp) return;
    setEditingExp({
      ...editingExp,
      highlights: [...(editingExp.highlights || []), highlightInput.trim()],
    });
    setHighlightInput('');
  };

  const handleRemoveHighlight = (idx: number) => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      highlights: (editingExp.highlights || []).filter((_, i) => i !== idx),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setFormError(null);

    const validation = ExperienceSchema.safeParse(editingExp);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Please check form fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveExperience(editingExp as any);
      setEditingExp(null);
    } catch (err) {
      setFormError((err as Error).message || 'Failed to save experience');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this experience entry permanently?')) {
      await deleteExperience(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-heading">Experience & Roles</h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Manage internships, ambassadorships, and industry experiences.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Add Role</span>
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-6 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    exp.status === 'published' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {exp.status}
                </span>
                <span className="text-xs font-mono text-neutral-500">Order #{exp.display_order}</span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900 font-heading">{exp.position}</h3>
              <p className="text-xs text-neutral-600 font-sans flex items-center gap-2 flex-wrap">
                <span className="text-neutral-900 font-bold">{exp.company}</span>
                <span>&bull;</span>
                <span>{exp.employment_type}</span>
                <span>&bull;</span>
                <span className="font-mono">{exp.start_date} — {exp.is_current ? 'Present' : exp.end_date || 'End'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => handleOpenEdit(exp)}
                className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 transition-colors shadow-xs"
                title="Edit Role"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors shadow-xs"
                title="Delete Role"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <h3 className="text-lg font-bold text-neutral-900 font-heading">
                {editingExp.id ? 'Edit Experience' : 'New Experience'}
              </h3>
              <button onClick={() => setEditingExp(null)} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700">
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
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Role / Position *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.position || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, position: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Employment Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Internship / Ambassador"
                    value={editingExp.employment_type || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, employment_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Chhatrapati Sambhajinagar"
                    value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Start Date *</label>
                  <input
                    type="text"
                    placeholder="e.g. June 2025"
                    value={editingExp.start_date || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, start_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">End Date</label>
                  <input
                    type="text"
                    disabled={editingExp.is_current}
                    placeholder="e.g. September 2025"
                    value={editingExp.end_date || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, end_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono disabled:opacity-40"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700 font-sans">
                    <input
                      type="checkbox"
                      checked={Boolean(editingExp.is_current)}
                      onChange={(e) => setEditingExp({ ...editingExp, is_current: e.target.checked })}
                      className="rounded bg-white border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <span>Active / Present Role</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Role Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingExp.description || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Bullet Achievements / Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Architected responsive frontend with Node backend"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 shadow-xs font-sans"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(editingExp.highlights || []).map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 font-sans">
                      <span>&bull; {h}</span>
                      <button type="button" onClick={() => handleRemoveHighlight(i)} className="text-neutral-400 hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Order */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Status</label>
                  <select
                    value={editingExp.status || 'published'}
                    onChange={(e) => setEditingExp({ ...editingExp, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-sans"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editingExp.display_order ?? 1}
                    onChange={(e) => setEditingExp({ ...editingExp, display_order: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-semibold font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 shadow-sm font-sans"
                >
                  {isSubmitting ? 'Saving...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
