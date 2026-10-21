import React, { useState } from 'react';
import { ExternalLink, Github, Star, X, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';

export const Projects: React.FC = () => {
  const { projects } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const publishedProjects = projects
    .filter((p) => p.status === 'published')
    .sort((a, b) => {
      // Featured first, then display_order
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return a.display_order - b.display_order;
    });

  return (
    <section className="py-20 md:py-28 relative bg-white" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-neutral-500 tracking-widest uppercase font-mono">03 / Engineering Work</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Featured <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">Projects</span>
            </h2>
            <p className="text-neutral-600 text-sm mt-2 max-w-xl">
              Production web applications, full-stack database architectures, and open-source tooling.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-xl transition-all flex flex-col overflow-hidden group shadow-sm"
            >
              {/* Project Card Header / Preview Area */}
              <div className="relative aspect-video bg-neutral-100 overflow-hidden border-b border-neutral-200">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm font-medium">
                    No Preview Available
                  </div>
                )}

                {/* Featured Badge */}
                {project.is_featured && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 text-white text-[11px] font-bold shadow-sm font-mono">
                    <Star className="w-3 h-3 fill-current text-amber-300" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Project Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors mb-2 font-heading">
                    {project.title}
                  </h3>

                  <p className="text-sm text-neutral-600 line-clamp-3 mb-6 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/70 text-xs font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 transition-colors font-mono"
                  >
                    <span>View Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 hover:bg-white transition-colors shadow-xs"
                        aria-label={`View ${project.title} source code on GitHub`}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}

                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 hover:bg-white transition-colors shadow-xs"
                        aria-label={`Open ${project.title} live preview`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for In-Depth Project Details */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="relative w-full max-w-2xl bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                <div>
                  <h3 id="modal-title" className="text-xl font-bold text-neutral-900 font-heading">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5 font-mono">
                    {selectedProject.is_featured ? 'Featured Architecture' : 'Production Build'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
                  aria-label="Close project modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
                    Executive Overview
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {selectedProject.summary}
                  </p>
                </div>

                {selectedProject.description && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
                      Deep Dive & Technical Details
                    </h4>
                    <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 font-mono">
                    Tech Stack & Ecosystem
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end gap-3">
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-white border border-neutral-300 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </a>
                )}

                {selectedProject.demo_url && (
                  <a
                    href={selectedProject.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Live App</span>
                  </a>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
