import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Education, EducationSchema } from '../../types';

export const AdminEducation: React.FC = () => {
  const { educations, saveEducation, deleteEducation } = usePortfolio();
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingEdu({
      institution: '',
      degree: '',
      field_of_study: 'Computer Science and Engineering',
      location: 'Chhatrapati Sambhajinagar, Maharashtra',
      start_year: '2026',
      end_year: '2029',
      grade: 'Pursuing',
      description: '',
      status: 'published',
      display_order: educations.length + 1,
    });
    setFormError(null);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu({ ...edu });
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    setFormError(null);

    const validation = EducationSchema.safeParse(editingEdu);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Please check form fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveEducation(editingEdu as any);
      setEditingEdu(null);
    } catch (err) {
      setFormError((err as Error).message || 'Failed to save education entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this education entry?')) {
      await deleteEducation(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-heading">Education Credentials</h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Manage academic degrees, institutions, and graduation records.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="p-6 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    edu.status === 'published' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {edu.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(edu)}
                    className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:text-neutral-900 shadow-xs"
                    title="Edit Education"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:text-red-600 shadow-xs"
                    title="Delete Education"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-neutral-900 mb-1 font-heading">{edu.degree}</h3>
              <p className="text-xs text-neutral-600 font-sans mb-1">{edu.field_of_study}</p>
              <p className="text-xs text-neutral-800 font-bold font-sans mb-2">{edu.institution}</p>
              <p className="text-xs text-neutral-500 line-clamp-2 font-sans">{edu.description}</p>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>{edu.start_year} — {edu.end_year || 'Present'}</span>
              <span>{edu.grade}</span>
            </div>
          </div>
        ))}
      </div>

      {editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <h3 className="text-lg font-bold text-neutral-900 font-heading">
                {editingEdu.id ? 'Edit Education' : 'New Education'}
              </h3>
              <button onClick={() => setEditingEdu(null)} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700">
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
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Degree Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech in CSE"
                    value={editingEdu.degree || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Field of Study *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.field_of_study || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, field_of_study: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Start Year *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.start_year || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, start_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">End Year</label>
                  <input
                    type="text"
                    value={editingEdu.end_year || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, end_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Grade / Status</label>
                  <input
                    type="text"
                    placeholder="e.g. Distinction"
                    value={editingEdu.grade || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Curriculum Highlights</label>
                <textarea
                  rows={3}
                  value={editingEdu.description || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none font-sans leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-semibold font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 shadow-sm font-sans"
                >
                  {isSubmitting ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
