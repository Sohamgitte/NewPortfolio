import React from 'react';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Education: React.FC = () => {
  const { educations } = usePortfolio();

  const publishedEducations = educations
    .filter((e) => e.status === 'published')
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="py-20 md:py-28 relative bg-white" id="education">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-neutral-500 tracking-widest uppercase font-mono">05 / Academics</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Education & <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">Foundation</span>
            </h2>
            <p className="text-neutral-600 text-sm mt-2 max-w-xl">
              Academic credentials and computer engineering curricula shaping my technical discipline.
            </p>
          </div>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedEducations.map((edu) => (
            <div
              key={edu.id}
              className="p-8 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-lg transition-all shadow-sm flex flex-col justify-between group"
            >
              <div>
                {/* Year Badge & Distinction */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200/80 font-mono">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>{edu.start_year} — {edu.end_year || 'Present'}</span>
                  </span>

                  {edu.grade && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-800 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200">
                      <Award className="w-3.5 h-3.5 text-neutral-900" />
                      <span>{edu.grade}</span>
                    </span>
                  )}
                </div>

                {/* Degree & Field */}
                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors mb-1.5 font-heading">
                  {edu.degree}
                </h3>
                <p className="text-sm font-semibold text-neutral-600 mb-4 font-sans">
                  {edu.field_of_study}
                </p>

                {/* Institution & Location */}
                <div className="flex flex-col gap-1.5 text-xs text-neutral-500 mb-6 font-sans">
                  <div className="flex items-center gap-2 text-neutral-800">
                    <GraduationCap className="w-4 h-4 text-neutral-900 flex-shrink-0" />
                    <span className="font-bold">{edu.institution}</span>
                  </div>
                  {edu.location && (
                    <div className="flex items-center gap-2 pl-6 text-neutral-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="text-sm text-neutral-600 leading-relaxed pt-4 border-t border-neutral-100">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
