import React from 'react';
import { ArrowUp, ShieldCheck, Github, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200/90 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-neutral-900 flex items-center justify-center shadow-xs">
                <span className="font-mono font-bold text-xs text-white">SG</span>
              </div>
              <span className="font-bold text-sm tracking-tight text-neutral-900 font-heading">
                SG <span className="text-neutral-500 font-medium font-sans">SohamGitte</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Designed & Engineered by <span className="text-neutral-800 font-semibold">{profile.full_name}</span>. Built with React, Tailwind & Supabase.
            </p>
          </div>

          {/* Social and back to top */}
          <div className="flex items-center gap-4">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-2"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-2"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-2"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-all flex items-center gap-1.5 text-xs font-mono shadow-xs"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>

        </div>

        {/* Bottom subtle bar */}
        <div className="mt-8 pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 gap-3">
          <p>&copy; {new Date().getFullYear()} {profile.full_name}. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime CMS Active</span>
            </span>

            <a
              href="/admin"
              className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-neutral-500" />
              <span>CMS Portal</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
