import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Skill, SkillSchema, SkillCategory } from '../../types';

export const AdminSkills: React.FC = () => {
  const { skills, saveSkill, deleteSkill } = usePortfolio();
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories: { key: SkillCategory; label: string }[] = [
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'database', label: 'Database' },
    { key: 'tools_design', label: 'Tools & Design' },
    { key: 'core', label: 'Core / Soft' },
  ];

  const handleOpenCreate = () => {
    setEditingSkill({
      name: '',
      category: 'frontend',
      level: 'Advanced',
      icon: 'Code',
      status: 'published',
      display_order: skills.length + 1,
    });
    setFormError(null);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    setFormError(null);

    const validation = SkillSchema.safeParse(editingSkill);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Please check form fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveSkill(editingSkill as any);
      setEditingSkill(null);
    } catch (err) {
      setFormError((err as Error).message || 'Failed to save skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this skill?')) {
      await deleteSkill(id);
    }
  };

  const filtered = activeTab === 'all' ? skills : skills.filter((s) => s.category === activeTab);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-heading">Technical Stack & Skills</h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Manage programming languages, frameworks, databases, and proficiency tags.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'all' ? 'bg-neutral-900 text-white shadow-xs' : 'bg-white text-neutral-600 border border-neutral-200 hover:text-neutral-900'
          }`}
        >
          All ({skills.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveTab(c.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === c.key ? 'bg-neutral-900 text-white shadow-xs' : 'bg-white text-neutral-600 border border-neutral-200 hover:text-neutral-900'
            }`}
          >
            {c.label} ({skills.filter((s) => s.category === c.key).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((skill) => (
          <div
            key={skill.id}
            className="p-3.5 rounded-xl bg-white border border-neutral-200/90 hover:border-neutral-300 shadow-xs flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-900 truncate font-heading">{skill.name}</p>
              <p className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">{skill.category.replace('_', ' ')}</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenEdit(skill)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-900"
                title="Edit Skill"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-1 rounded text-neutral-400 hover:text-red-600"
                title="Delete Skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900 font-heading">
                {editingSkill.id ? 'Edit Skill' : 'New Skill'}
              </h3>
              <button onClick={() => setEditingSkill(null)} className="text-neutral-400 hover:text-neutral-700">
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
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js"
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Category *</label>
                <select
                  value={editingSkill.category || 'frontend'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-sans"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Proficiency Level</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced / Intermediate"
                  value={editingSkill.level || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Status</label>
                  <select
                    value={editingSkill.status || 'published'}
                    onChange={(e) => setEditingSkill({ ...editingSkill, status: e.target.value as any })}
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
                    value={editingSkill.display_order ?? 1}
                    onChange={(e) => setEditingSkill({ ...editingSkill, display_order: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 shadow-sm"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
