import { useState, useEffect } from 'react';
import BACKEND_CONFIG from '../config/backend';

export interface LandingData {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    imageUrl: string;
  };
  stats: Array<{ label: string; value: string; icon: string }>;
  academy: {
    title: string;
    subtitle: string;
    courses: Array<{
      id: string;
      title: string;
      description: string;
      feel: string;
      image: string;
      bgColor: string;
    }>;
    exploreButtonText: string;
    isLoginRequired: boolean;
  };
  wisdom: {
    title: string;
    description: string;
    pillars: Array<{ title: string; description: string; icon: string }>;
  };
  library: {
    title: string;
    items: Array<{ title: string; category: string; duration: string; imageUrl: string; link: string }>;
  };
  settings: {
    maintenanceMode: boolean;
    showCollaborators: boolean;
    showContactForm: boolean;
  };
}

export const useLandingData = () => {
  const [data, setData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/landing`);
      if (!response.ok) throw new Error('Failed to fetch landing data');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refresh: fetchData };
};
