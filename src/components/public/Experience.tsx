import React from 'react';
import { Calendar, MapPin, CheckCircle, Building } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Experience: React.FC = () => {
  const { experiences } = usePortfolio();

  const publishedExperiences = experiences
    .filter((e) => e.status === 'published')
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="py-20 md:py-28 relative bg-neutral-50/60" id="experience">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-neutral-500 tracking-widest uppercase font-mono">04 / Journey</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Experience & <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">Leadership</span>
            </h2>
            <p className="text-neutral-600 text-sm mt-2 max-w-xl">
              Hands-on engineering internships, community ambassadorships, and startup advocacy.
            </p>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="relative border-l border-neutral-200 ml-4 md:ml-6 space-y-12">
          {publishedExperiences.map((exp) => (
            <div key={exp.id} className="relative pl-6 md:pl-10 group">
              
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                  exp.is_current
                    ? 'bg-neutral-900 border-white ring-4 ring-neutral-200'
                    : 'bg-neutral-300 border-white group-hover:bg-neutral-900'
                }`}
              />

              <div className="p-6 md:p-8 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-lg transition-all shadow-sm">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors font-heading">
                        {exp.position}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 font-semibold">
                        {exp.employment_type}
                      </span>
                      {exp.is_current && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold font-mono">
                          Active Role
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap font-medium">
                      <span className="flex items-center gap-1.5 text-neutral-800 font-bold">
                        <Building className="w-3.5 h-3.5 text-neutral-900" />
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1 text-neutral-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200 self-start sm:self-auto font-mono">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>
                      {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date || 'Completed'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {exp.description}
                </p>

                {/* Key Highlights */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {exp.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed">
                        <CheckCircle className="w-3.5 h-3.5 text-neutral-900 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/70 text-[11px] font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
