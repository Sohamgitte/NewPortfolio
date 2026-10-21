import React from 'react';
import { FileText, Download, ExternalLink, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Resume: React.FC = () => {
  const { profile } = usePortfolio();
  const resumeUrl = profile.resume_url || '/Soham_Gitte_Resume.pdf';

  return (
    <section className="py-20 md:py-28 relative bg-neutral-50/60" id="resume">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-neutral-500 tracking-widest uppercase font-mono">08 / Curriculum Vitae</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Resume & <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">Documentation</span>
            </h2>
            <p className="text-neutral-600 text-sm mt-2 max-w-xl">
              Verified resume summary containing academic milestones, internships, ambassadorships, and technical proficiencies.
            </p>
          </div>
        </div>

        {/* Resume Preview Banner Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-white border border-neutral-200/90 relative overflow-hidden shadow-sm">
          {/* Subtle accent corner gradient */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-neutral-100/60 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold font-mono">
                <FileText className="w-3.5 h-3.5 text-neutral-900" />
                <span>PDF Document (Verified ATS-Friendly Format)</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight font-heading">
                {profile.full_name} — Professional Resume
              </h3>

              <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl font-sans">
                Looking for internship opportunities, high-growth startup engineering roles, or tech collaborations.
                Download the complete resume for in-depth course breakdowns, project links, and direct references.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-700 font-medium font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>B.Tech CSE @ JNEC (MGM University)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-700 font-medium font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Full-Stack Web Intern (Just Logic)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-700 font-medium font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>MIT Diploma (Distinction)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-700 font-medium font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Ambassador @ Naukri Campus, PurnaFinX</span>
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <a
                href={resumeUrl}
                download="Soham_Gitte_Resume.pdf"
                className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm font-sans"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume (PDF)</span>
              </a>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 font-sans shadow-xs"
              >
                <ExternalLink className="w-4 h-4 text-neutral-500" />
                <span>Preview in Browser</span>
              </a>

              <p className="text-[11px] text-center text-neutral-400 font-mono mt-1">
                Updated directly via SohamLabs CMS
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
