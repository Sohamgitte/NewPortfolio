import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  Trophy,
  Mail,
  Smartphone,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { PwaInstallPrompt } from '../../components/public/PwaInstallPrompt';

export const AdminLayout: React.FC = () => {
  const { user, logout, isConfigured } = useAuth();
  const { messages } = usePortfolio();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Profile & Settings', path: '/admin/profile', icon: User },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Experience', path: '/admin/experience', icon: Briefcase },
    { label: 'Education', path: '/admin/education', icon: GraduationCap },
    { label: 'Skills', path: '/admin/skills', icon: Sparkles },
    { label: 'Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Achievements', path: '/admin/achievements', icon: Trophy },
    { label: 'Inbox', path: '/admin/messages', icon: Mail, badge: unreadCount > 0 ? unreadCount : undefined },
    { label: 'Mobile Preview', path: '/admin/preview', icon: Smartphone },
  ];

  // Primary 5 tabs for Mobile Bottom Bar (Thumb ergonomics)
  const mobileBottomTabs = [
    { label: 'Home', path: '/admin', icon: LayoutDashboard },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Profile', path: '/admin/profile', icon: User },
    { label: 'Inbox', path: '/admin/messages', icon: Mail, badge: unreadCount > 0 ? unreadCount : undefined },
    { label: 'More', path: '#menu', icon: Menu, isAction: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-900 flex flex-col md:flex-row font-sans">
      
      {/* Desktop Sidebar (visible on md screens and up) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200/90 p-4 justify-between flex-shrink-0">
        <div>
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 px-3 py-3 mb-6 border-b border-neutral-200/80">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center shadow-xs">
              <span className="font-mono font-bold text-sm text-white">SG</span>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-neutral-900 font-heading">
                SG <span className="text-neutral-500 font-medium font-sans">CMS</span>
              </span>
              <p className="text-[10px] text-neutral-500 font-mono">Realtime Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-white border border-neutral-700">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="pt-4 border-t border-neutral-200/80 space-y-3">
          <div className="px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-semibold text-neutral-500">Active Admin</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-neutral-900 font-semibold font-mono truncate mt-0.5" title={user?.email || 'sohamgitte125@gmail.com'}>
              {user?.email || 'sohamgitte125@gmail.com'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 border border-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
              <span>Live Site</span>
            </a>

            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-lg bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 border border-neutral-200 text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white/90 border-b border-neutral-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                <span>SG</span>
              </div>
              <span className="font-bold text-sm tracking-tight text-neutral-900 font-heading">
                SG <span className="text-neutral-500 font-medium font-sans">CMS</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-500">
              <span className="text-neutral-900 font-bold">/admin</span>
              <span>&bull;</span>
              <span>Autonomous Portfolio CMS</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {!isConfigured && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 text-[11px] font-mono">
                <Database className="w-3 h-3 text-emerald-600" />
                <span>Local CMS Engine</span>
              </span>
            )}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 border border-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">Preview</span>
              <span>Live Site</span>
            </a>

            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:text-red-600 border border-neutral-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer (When 'More' tab is tapped) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-t border-neutral-200 rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto pb-safe shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-sm font-bold text-neutral-900 font-heading">
                CMS Navigation Menu
              </span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold border transition-all ${
                        isActive
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
              <span className="truncate font-mono">{user?.email || 'sohamgitte125@gmail.com'}</span>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleLogout();
                }}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-neutral-200/90 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around pb-safe shadow-lg"
        aria-label="Mobile Bottom Navigation"
      >
        {mobileBottomTabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isAction) {
            return (
              <button
                key={tab.label}
                onClick={() => setMobileDrawerOpen(true)}
                className="flex flex-col items-center justify-center p-2 rounded-xl text-neutral-500 hover:text-neutral-900 text-[10px] font-semibold"
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/admin'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-semibold relative transition-colors ${
                  isActive ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-800'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Admin PWA prompt (only for admin, not public visitors) */}
      <PwaInstallPrompt />
    </div>
  );
};
