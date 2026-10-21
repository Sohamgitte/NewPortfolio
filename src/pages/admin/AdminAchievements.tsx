import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Achievement } from '../../types';

export const AdminAchievements: React.FC = () => {
  const { achievements, saveAchievement, deleteAchievement } = usePortfolio();
  const [editingAch, setEditingAch] = useState<Partial<Achievement> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingAch({
      title: '',
      category: 'Milestone',
      organization: '',
      date: '2026',
      description: '',
      link_url: '',
      status: 'published',
      display_order: achievements.length + 1,
    });
    setFormError(null);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingAch({ ...ach });
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch?.title || !editingAch?.description) {
      setFormError('Title and description are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveAchievement(editingAch as any);
      setEditingAch(null);
    } catch (err) {
      setFormError((err as Error).message || 'Failed to save achievement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this achievement?')) {
      await deleteAchievement(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-heading">Achievements & Honors</h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Manage entrepreneurial milestones, ambassador awards, and competition rankings.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-6 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                  {ach.category}
                </span>

                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(ach)} className="p-1 rounded text-neutral-400 hover:text-neutral-900" title="Edit">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(ach.id)} className="p-1 rounded text-neutral-400 hover:text-red-600" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-neutral-900 mb-1.5 font-heading">{ach.title}</h3>
              {ach.organization && (
                <p className="text-xs text-neutral-600 font-sans mb-2">{ach.organization}</p>
              )}
              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 font-sans">{ach.description}</p>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>{ach.date || 'Record'}</span>
              {ach.link_url && (
                <a href={ach.link_url} target="_blank" rel="noopener noreferrer" className="text-neutral-900 font-semibold hover:underline">
                  Link &rarr;
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900 font-heading">
                {editingAch.id ? 'Edit Achievement' : 'New Achievement'}
              </h3>
              <button onClick={() => setEditingAch(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Title *</label>
                <input
                  type="text"
                  required
                  value={editingAch.title || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Category</label>
                  <input
                    type="text"
                    value={editingAch.category || ''}
                    onChange={(e) => setEditingAch({ ...editingAch, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Date</label>
                  <input
                    type="text"
                    value={editingAch.date || ''}
                    onChange={(e) => setEditingAch({ ...editingAch, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Organization</label>
                <input
                  type="text"
                  value={editingAch.organization || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingAch.description || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Reference URL</label>
                <input
                  type="url"
                  value={editingAch.link_url || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, link_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAch(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 shadow-sm font-sans"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
