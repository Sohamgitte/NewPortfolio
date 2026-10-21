import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Hero } from '../components/public/Hero';
import { About } from '../components/public/About';
import { Projects } from '../components/public/Projects';
import { Skills } from '../components/public/Skills';
import { PortfolioProvider } from '../context/PortfolioContext';
import { AuthProvider } from '../context/AuthContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      <PortfolioProvider>
        {component}
      </PortfolioProvider>
    </AuthProvider>
  );
};

describe('Public Portfolio Component Suite', () => {
  it('renders Hero section with authentic Soham Gitte name and CTAs', () => {
    renderWithProviders(<Hero />);

    // Name check (appears in hero heading and photo floating badge)
    const nameElements = screen.getAllByText('Soham Gitte');
    expect(nameElements.length).toBeGreaterThanOrEqual(1);
    expect(nameElements[0]).toBeInTheDocument();

    // CTA check
    expect(screen.getByText('Explore Projects')).toBeInTheDocument();
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
  });

  it('renders About section with JNEC and MIT academic milestones', () => {
    renderWithProviders(<About />);

    expect(screen.getByText('About')).toBeInTheDocument();
    const jnecElements = screen.getAllByText(/Jawaharlal Nehru Engineering College/i);
    expect(jnecElements.length).toBeGreaterThanOrEqual(1);

    const mitElements = screen.getAllByText(/Marathwada Institute of Technology/i);
    expect(mitElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Projects section with authentic projects', () => {
    renderWithProviders(<Projects />);

    expect(screen.getByText('Quick-Fix Home Services')).toBeInTheDocument();
    expect(screen.getByText('SohamLabs Portfolio CMS')).toBeInTheDocument();
  });

  it('renders Skills section with categorized tech stack', () => {
    renderWithProviders(<Skills />);

    expect(screen.getByText('HTML5 & CSS3')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('React.js')).toBeInTheDocument();
  });
});
