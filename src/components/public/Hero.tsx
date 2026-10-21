import React from 'react';
import { ArrowDown, Github, Linkedin, Mail, Phone, ExternalLink, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Hero: React.FC = () => {
  const { profile } = usePortfolio();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-neutral-50/90 via-white to-white" id="hero">
      {/* Subtle architectural dot grid background */}
      <div
        className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle radial ambient highlight */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-200/30 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Availability status badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-semibold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{profile.availability_status}</span>
            </div>

            {/* Name Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 mb-4 leading-tight font-heading">
              Hi, I'm <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">{profile.full_name}</span>.
            </h1>

            {/* Subheading / Tagline */}
            <p className="text-lg sm:text-xl font-medium text-neutral-700 mb-4 leading-relaxed font-sans">
              {profile.tagline}
            </p>

            {/* Short Bio */}
            <p className="text-base text-neutral-600 mb-8 max-w-2xl leading-relaxed">
              {profile.bio_short}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <a
                href={profile.hero_cta_primary_link || '#projects'}
                className="px-6 py-3.5 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-all active:scale-95 shadow-sm hover:shadow flex items-center gap-2"
              >
                <span>{profile.hero_cta_primary_text || 'Explore Projects'}</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href={profile.resume_url || '/Soham_Gitte_Resume.pdf'}
                download="Soham_Gitte_Resume.pdf"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 hover:border-neutral-400 font-semibold text-sm transition-all active:scale-95 shadow-xs flex items-center gap-2"
              >
                <span>{profile.hero_cta_secondary_text || 'Download Resume'}</span>
                <ExternalLink className="w-4 h-4 text-neutral-500" />
              </a>

              <a
                href="#contact"
                className="px-5 py-3.5 rounded-xl text-neutral-600 hover:text-neutral-900 font-semibold text-sm transition-colors"
              >
                Contact Me &rarr;
              </a>
            </div>

            {/* Social Proof & Quick Direct Links */}
            <div className="flex items-center gap-3 text-neutral-500">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">Connect:</span>
              
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 shadow-xs transition-all"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 shadow-xs transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 shadow-xs transition-all"
                  aria-label="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}

              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                  className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 shadow-xs transition-all"
                  aria-label="Call Mobile"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Profile Picture & Studio Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group max-w-sm w-full">
              {/* Outer clean shadow backdrop */}
              <div className="absolute -inset-1.5 bg-neutral-200/60 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative rounded-2xl bg-white border border-neutral-200/90 overflow-hidden shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08)] p-3">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100">
                  <img
                    src={profile.avatar_url || '/soham-photo.jpg'}
                    alt={profile.full_name}
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating card tag at bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-900 font-heading">{profile.full_name}</p>
                      <p className="text-[11px] text-neutral-600 font-medium font-sans">B.Tech CSE @ JNEC'29</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
