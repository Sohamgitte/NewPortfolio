import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Briefcase,
  Sparkles,
  Mail,
  Plus,
  FileText,
  User,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { profile, projects, experiences, skills, messages, markMessageRead, saveProject } =
    usePortfolio();
  const { isConfigured } = useAuth();

  const publishedProjects = projects.filter((p) => p.status === 'published').length;
  const unreadMessages = messages.filter((m) => !m.is_read);

  const toggleProjectPublish = async (project: (typeof projects)[0]) => {
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    await saveProject({
      ...project,
      status: nextStatus,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>Live CMS Engine</span>
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                {isConfigured ? 'Supabase Realtime Synced' : 'Local Offline Engine'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Welcome back, <span className="underline decoration-neutral-300 underline-offset-4">{profile.full_name}</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl font-sans">
              Manage projects, update bio, handle inquiries, and publish changes straight to your live site from any device.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/projects"
              className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm font-sans"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Link>

            <Link
              to="/admin/preview"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 border border-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs font-sans"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
              <span>Preview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects KPI */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">Projects</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-neutral-900 font-heading">{projects.length}</div>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
              <span className="text-emerald-700 font-bold">{publishedProjects}</span> published live
            </p>
          </div>
        </div>

        {/* Experience KPI */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">Experience</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-sky-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-neutral-900 font-heading">{experiences.length}</div>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Internships & Roles</p>
          </div>
        </div>

        {/* Tech Stack KPI */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">Skills</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-neutral-900 font-heading">{skills.length}</div>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Across 5 domains</p>
          </div>
        </div>

        {/* Inquiries KPI */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-amber-700 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-neutral-900 font-heading">{messages.length}</div>
            <p className="text-[11px] font-mono mt-0.5">
              {unreadMessages.length > 0 ? (
                <span className="text-emerald-700 font-bold">{unreadMessages.length} unread</span>
              ) : (
                <span className="text-neutral-500">All caught up</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Content Actions & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Quick Publishing Management */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-neutral-900 font-heading">
                Instant Project Publishing
              </h2>
              <Link to="/admin/projects" className="text-xs text-neutral-900 hover:underline font-mono font-semibold">
                Manage All &rarr;
              </Link>
            </div>

            <div className="divide-y divide-neutral-100">
              {projects.map((proj) => (
                <div key={proj.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-neutral-900 truncate font-heading">{proj.title}</p>
                    <p className="text-[11px] text-neutral-500 font-sans truncate">
                      {proj.technologies.slice(0, 3).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleProjectPublish(proj)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        proj.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:text-neutral-900'
                      }`}
                    >
                      {proj.status === 'published' ? '● Published' : '○ Draft'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link
              to="/admin/profile"
              className="p-4 rounded-xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md text-left transition-all group shadow-xs"
            >
              <User className="w-5 h-5 text-neutral-900 mb-2 group-hover:scale-105 transition-transform" />
              <p className="text-xs font-bold text-neutral-900 font-heading">Edit Bio & Info</p>
              <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Avatar, Contact, SEO</p>
            </Link>

            <Link
              to="/admin/experience"
              className="p-4 rounded-xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md text-left transition-all group shadow-xs"
            >
              <Briefcase className="w-5 h-5 text-neutral-900 mb-2 group-hover:scale-105 transition-transform" />
              <p className="text-xs font-bold text-neutral-900 font-heading">Add Experience</p>
              <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Roles & Internships</p>
            </Link>

            <Link
              to="/admin/certificates"
              className="p-4 rounded-xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md text-left transition-all group shadow-xs"
            >
              <FileText className="w-5 h-5 text-neutral-900 mb-2 group-hover:scale-105 transition-transform" />
              <p className="text-xs font-bold text-neutral-900 font-heading">Upload Certificate</p>
              <p className="text-[10px] text-neutral-500 font-sans mt-0.5">PDF or Image assets</p>
            </Link>
          </div>
        </div>

        {/* Right Column: Inquiries Inbox */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-900" />
                <h2 className="text-sm font-bold text-neutral-900 font-heading">
                  Inquiries Inbox
                </h2>
              </div>
              <Link to="/admin/messages" className="text-xs text-neutral-900 hover:underline font-mono font-semibold">
                View All &rarr;
              </Link>
            </div>

            {messages.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-500">
                <p className="text-xs font-sans">No contact messages received yet.</p>
                <p className="text-[11px] text-neutral-400 mt-1">Inbound messages from the public portfolio appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 4).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      msg.is_read
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-600'
                        : 'bg-white border-neutral-300 text-neutral-900 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-neutral-900 truncate font-heading">{msg.name}</span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(msg.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 mb-2 font-sans">{msg.message}</p>

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <a href={`mailto:${msg.email}`} className="text-neutral-900 font-semibold hover:underline truncate">
                        {msg.email}
                      </a>

                      {!msg.is_read && (
                        <button
                          onClick={() => markMessageRead(msg.id, true)}
                          className="text-neutral-500 hover:text-neutral-900 font-semibold"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
