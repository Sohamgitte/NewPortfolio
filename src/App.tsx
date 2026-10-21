import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminExperience } from './pages/admin/AdminExperience';
import { AdminEducation } from './pages/admin/AdminEducation';
import { AdminSkills } from './pages/admin/AdminSkills';
import { AdminCertificates } from './pages/admin/AdminCertificates';
import { AdminAchievements } from './pages/admin/AdminAchievements';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminPreview } from './pages/admin/AdminPreview';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<Home />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin CMS Dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="education" element={<AdminEducation />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="preview" element={<AdminPreview />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
};

export default App;
