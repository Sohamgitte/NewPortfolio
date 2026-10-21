import React, { useState } from 'react';
import {
  Code,
  FileCode,
  FileCode2,
  Atom,
  Palette,
  Layout,
  Smartphone,
  Server,
  Layers,
  Database,
  Network,
  Figma,
  GitBranch,
  Sparkles,
  TrendingUp,
  Briefcase,
  Lightbulb,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SkillCategory } from '../../types';

export const Skills: React.FC = () => {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const publishedSkills = skills
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.display_order - b.display_order);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Technologies' },
    { key: 'frontend', label: 'Frontend & UI' },
    { key: 'backend', label: 'Backend & APIs' },
    { key: 'database', label: 'Databases' },
    { key: 'tools_design', label: 'Tools & Design' },
    { key: 'core', label: 'Core Competencies' },
  ];

  const filteredSkills =
    selectedCategory === 'all'
      ? publishedSkills
      : publishedSkills.filter((s) => s.category === selectedCategory);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'FileCode':
      case 'FileCode2':
        return <FileCode className="w-5 h-5" />;
      case 'Atom':
        return <Atom className="w-5 h-5" />;
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      case 'Layout':
        return <Layout className="w-5 h-5" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'Server':
        return <Server className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Database':
        return <Database className="w-5 h-5" />;
      case 'Network':
        return <Network className="w-5 h-5" />;
      case 'Figma':
        return <Figma className="w-5 h-5" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  const getCategoryBadge = (category: SkillCategory) => {
    switch (category) {
      case 'frontend':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'backend':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'database':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'tools_design':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'core':
        return 'text-neutral-700 bg-neutral-100 border-neutral-200';
      default:
        return 'text-neutral-600 bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <section className="py-20 md:py-28 relative bg-neutral-50/60" id="skills">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-neutral-500 tracking-widest uppercase font-mono">02 / Technical Stack</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Skills & <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">Expertise</span>
            </h2>
            <p className="text-neutral-600 text-sm mt-2 max-w-xl">
              Technologies, frameworks, databases, and architectural tools I leverage to build scalable software products.
            </p>
          </div>

          <div className="text-xs text-neutral-500 font-semibold font-mono bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-xs">
            {publishedSkills.length} Verified Technologies
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat.key}
              role="tab"
              aria-selected={selectedCategory === cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                selectedCategory === cat.key
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200/90 hover:text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 rounded-xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all shadow-xs">
                {getIcon(skill.icon)}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-neutral-900 truncate group-hover:text-neutral-700 transition-colors font-heading">
                  {skill.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${getCategoryBadge(skill.category)}`}>
                    {skill.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium font-sans">
                    {skill.level}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
