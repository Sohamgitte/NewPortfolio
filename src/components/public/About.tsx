import React from 'react';
import { Code2, Compass, GraduationCap, Languages, MapPin, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const About: React.FC = () => {
  const { profile } = usePortfolio();

  const languageProficiencies = [
    { lang: 'Marathi', level: 'Full Professional' },
    { lang: 'English', level: 'Professional Working' },
    { lang: 'Hindi', level: 'Full Professional' },
    { lang: 'German', level: 'Elementary' },
  ];

  const pillars = [
    {
      title: 'Full-Stack Development',
      desc: 'Building responsive web platforms with modern frontend frameworks and structured SQL database backends.',
      icon: Code2,
    },
    {
      title: 'UI/UX Engineering',
      desc: 'Obsessed with micro-interactions, clean typography, whitespace, and intuitive mobile ergonomics.',
      icon: Sparkles,
    },
    {
      title: 'Entrepreneurial Mindset',
      desc: 'Approaching software from a product perspective — competitive analysis, market needs, and real-world utility.',
      icon: Compass,
    },
  ];

  return (
    <section className="py-20 md:py-28 relative bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-neutral-500 tracking-widest uppercase font-mono">01 / Profile</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-8 font-heading">
          About <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">Me</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Story & Bio */}
          <div className="lg:col-span-7 space-y-6 text-neutral-700 leading-relaxed text-base">
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 shadow-xs space-y-4">
              <p>
                {profile.bio_full.split('\n\n')[0] || profile.bio_short}
              </p>
              {profile.bio_full.split('\n\n').slice(1).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="p-5 rounded-xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center mb-3 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 mb-1.5 font-heading">{p.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info & Languages Sidebar */}
          <div className="lg:col-span-5 space-y-5">
            {/* Academic Snapshot Card */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2 font-mono">
                <GraduationCap className="w-4 h-4 text-neutral-900" />
                <span>Academic Trajectory</span>
              </h3>

              <div className="space-y-4">
                <div className="border-l-2 border-neutral-900 pl-3.5 py-1">
                  <p className="text-xs font-semibold text-neutral-500 font-mono">2026 — 2029 (Expected)</p>
                  <p className="text-sm font-bold text-neutral-900 font-heading">B.Tech in Computer Science & Engineering</p>
                  <p className="text-xs text-neutral-600">Jawaharlal Nehru Engineering College (JNEC), MGM University</p>
                </div>

                <div className="border-l-2 border-neutral-300 pl-3.5 py-1">
                  <p className="text-xs font-semibold text-neutral-500 font-mono">2023 — 2026</p>
                  <p className="text-sm font-bold text-neutral-900 font-heading">Diploma in Computer Engineering</p>
                  <p className="text-xs text-neutral-600">Marathwada Institute of Technology (MIT), MSBTE</p>
                  <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200">
                    Graduated with Distinction
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Languages Card */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-neutral-700">
                <MapPin className="w-4 h-4 text-neutral-900" />
                <span className="text-sm font-semibold">{profile.location}</span>
              </div>

              <div className="pt-3 border-t border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5 font-mono">
                  <Languages className="w-3.5 h-3.5 text-neutral-900" />
                  <span>Languages</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {languageProficiencies.map((item) => (
                    <div key={item.lang} className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80">
                      <p className="text-xs font-bold text-neutral-900">{item.lang}</p>
                      <p className="text-[11px] text-neutral-500 font-medium">{item.level}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
