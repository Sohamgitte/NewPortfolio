import React from 'react';
import { Navbar } from '../components/public/Navbar';
import { Hero } from '../components/public/Hero';
import { About } from '../components/public/About';
import { Skills } from '../components/public/Skills';
import { Projects } from '../components/public/Projects';
import { Experience } from '../components/public/Experience';
import { Education } from '../components/public/Education';
import { Certificates } from '../components/public/Certificates';
import { Achievements } from '../components/public/Achievements';
import { Resume } from '../components/public/Resume';
import { Contact } from '../components/public/Contact';
import { Footer } from '../components/public/Footer';
import { usePortfolio } from '../context/PortfolioContext';

export const Home: React.FC = () => {
  const { profile, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-neutral-900">
        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 shadow-md">
          <span className="font-mono font-bold text-white text-sm">SG</span>
        </div>
        <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-neutral-500 mt-4">Loading Soham's Portfolio...</p>
      </div>
    );
  }

  const { sections_config } = profile;

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Hero />
        {sections_config.about !== false && <About />}
        {sections_config.skills !== false && <Skills />}
        {sections_config.projects !== false && <Projects />}
        {sections_config.experience !== false && <Experience />}
        {sections_config.education !== false && <Education />}
        {sections_config.certificates !== false && <Certificates />}
        {sections_config.achievements !== false && <Achievements />}
        {sections_config.resume !== false && <Resume />}
        {sections_config.contact !== false && <Contact />}
      </main>

      <Footer />
    </div>
  );
};
