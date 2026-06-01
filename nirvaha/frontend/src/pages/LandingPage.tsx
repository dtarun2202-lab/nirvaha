import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_CONFIG from '@/config/backend';
import CommunityHero from '../components/landing/CommunityHero';
import TrustedStats from '../components/landing/TrustedStats';
import LibraryCarousel from '../components/landing/LibraryCarousel';
import GoldenShowcase from '../components/landing/GoldenShowcase';
import WhatIsNirvaha from '../components/landing/WhatIsNirvaha';
import AncientWisdomSection from '../components/landing/AncientWisdomSection';
import LeadershipHeroSection from '../components/landing/LeadershipHeroSection';
import DifferentPathsSection from '../components/landing/DifferentPathsSection';
import CollaboratorsSection from '../components/landing/CollaboratorsSection';
import CertificationCoursesSection from '../components/landing/CertificationCoursesSection';
import Contact from '../components/landing/Contact';
import ClosingSection from '../components/landing/ClosingSection';
import Header from '../components/landing/Header';
import SEOHead from '../components/common/SEOHead';

// Component Map to dynamically render string IDs to React Components
const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  CommunityHero,
  TrustedStats,
  GoldenShowcase,
  WhatIsNirvaha,
  LibraryCarousel,
  AncientWisdomSection,
  LeadershipHeroSection,
  DifferentPathsSection,
  CertificationCoursesSection,
  CollaboratorsSection,
  Contact,
  ClosingSection
};

const DEFAULT_SECTIONS = [
  { id: 'CommunityHero', visible: true },
  { id: 'TrustedStats', visible: true },
  { id: 'GoldenShowcase', visible: true },
  { id: 'WhatIsNirvaha', visible: true },
  { id: 'LibraryCarousel', visible: true },
  { id: 'AncientWisdomSection', visible: true },
  { id: 'LeadershipHeroSection', visible: true },
  { id: 'DifferentPathsSection', visible: true },
  { id: 'CertificationCoursesSection', visible: true },
  { id: 'CollaboratorsSection', visible: true },
  { id: 'Contact', visible: true },
  { id: 'ClosingSection', visible: true }
];

const LandingPage: React.FC = () => {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force scroll to top on refresh
    window.scrollTo(0, 0);

    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${BACKEND_CONFIG.API_BASE_URL}/api/content/landing_page_config`);
        if (response.data && response.data.value && Array.isArray(response.data.value)) {
          setSections(response.data.value);
        }
      } catch (error) {
        console.warn("Could not fetch landing page layout, using defaults.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, []);

  // Set up intersection observer whenever loading finishes (or sections change)
  useEffect(() => {
    if (loading) return;

    const elements = document.querySelectorAll<HTMLElement>('.fade-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, sections]);

  if (loading) {
    // Minimal fallback while configuration loads to avoid jarring layout shifts
    return (
      <div className="min-h-screen relative bg-[#0a0f0c]">
        <Header />
      </div>
    );
  }

  // Helper to separate main sections from footer sections
  const mainSections = sections.filter(s => s.id !== 'Contact' && s.id !== 'ClosingSection');
  const footerSections = sections.filter(s => s.id === 'Contact' || s.id === 'ClosingSection');

  return (
    <div className="min-h-screen relative">
      <SEOHead
        title="Nirvaha"
        description="Transform your mental wellness with Nirvaha's AI-powered emotional healing platform. Combining ancient spiritual wisdom with modern therapy, meditation, and professional counseling services for complete holistic healing."
        keywords="mental wellness, AI therapy, meditation, holistic healing, emotional support, spiritual wellness, Bhagavad Gita, modern therapy, mindfulness, stress relief, anxiety treatment, depression help, corporate wellness, mental health app"
        canonical="https://nirvaha.org"
      />
      <Header />
      
      <main>
        {mainSections.map((section) => {
          if (!section.visible) return null;
          const Component = SECTION_COMPONENTS[section.id];
          return Component ? <Component key={section.id} /> : null;
        })}
      </main>
      
      {footerSections.map((section) => {
        if (!section.visible) return null;
        const Component = SECTION_COMPONENTS[section.id];
        return Component ? <Component key={section.id} /> : null;
      })}
    </div>
  );
};

export default LandingPage;
