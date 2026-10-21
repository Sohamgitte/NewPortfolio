import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Achievements: React.FC = () => {
  const { achievements } = usePortfolio();

  const publishedAchievements = achievements
    .filter((a) => a.status === 'published')
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="py-20 md:py-28 relative bg-white" id="achievements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-neutral-500 tracking-widest uppercase font-mono">07 / Honors & Milestones</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Key <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">Achievements</span>
            </h2>
            <p className="text-neutral-600 text-sm mt-2 max-w-xl">
              Competitive recognitions, ambassador honors, and noteworthy project deliveries.
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedAchievements.map((ach) => (
            <div
              key={ach.id}
              className="p-6 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-lg transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200 font-mono">
                    {ach.category}
                  </span>

                  {ach.date && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 font-mono">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>{ach.date}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors mb-2 font-heading">
                  {ach.title}
                </h3>

                {ach.organization && (
                  <p className="text-xs font-medium text-neutral-500 mb-3">
                    Org: <span className="text-neutral-800 font-bold">{ach.organization}</span>
                  </p>
                )}

                <p className="text-sm text-neutral-600 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {ach.link_url && (
                <div className="pt-4 mt-4 border-t border-neutral-100">
                  <a
                    href={ach.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 transition-colors font-mono"
                  >
                    <span>View Reference</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
