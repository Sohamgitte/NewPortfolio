import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ShieldCheck, FileDown } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Navbar: React.FC = () => {
  const { profile } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about', show: profile.sections_config.about },
    { name: 'Skills', href: '#skills', show: profile.sections_config.skills },
    { name: 'Projects', href: '#projects', show: profile.sections_config.projects },
    { name: 'Experience', href: '#experience', show: profile.sections_config.experience },
    { name: 'Education', href: '#education', show: profile.sections_config.education },
    { name: 'Certificates', href: '#certificates', show: profile.sections_config.certificates },
    { name: 'Contact', href: '#contact', show: profile.sections_config.contact },
  ].filter((l) => l.show !== false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-neutral-900 hover:text-neutral-700 transition-colors group focus-visible:rounded"
            aria-label="SG SohamGitte Home"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center group-hover:bg-neutral-800 transition-all shadow-sm">
              <span className="font-bold text-xs tracking-wider">SG</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-neutral-900 font-heading">
                SG <span className="text-neutral-500 font-medium font-sans">SohamGitte</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100/90 p-1.5 rounded-full border border-neutral-200/70 backdrop-blur-sm" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-white rounded-full transition-all shadow-none hover:shadow-xs"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Quick Actions (Admin Control & Resume) */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 border border-neutral-200 active:scale-95 transition-all shadow-xs"
              title="Admin Control Dashboard"
              aria-label="Admin Control Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
              <span>Admin</span>
            </Link>

            <a
              href={profile.resume_url || '/Soham_Gitte_Resume.pdf'}
              download="Soham_Gitte_Resume.pdf"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95 transition-all shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-neutral-200 backdrop-blur-xl px-4 pt-3 pb-6 animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </a>
            ))}

            <div className="pt-3 border-t border-neutral-200 flex flex-col gap-2">
              <a
                href={profile.resume_url || '/Soham_Gitte_Resume.pdf'}
                download="Soham_Gitte_Resume.pdf"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Resume</span>
              </a>

              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span>Admin Control Dashboard</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
