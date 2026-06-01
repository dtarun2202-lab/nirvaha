import React, { createContext, useContext, useState, useEffect } from 'react';
import { wellnessSessions as staticSessions, WellnessSession } from '../data/wellnessSessions';
import BACKEND_CONFIG from '../config/backend';

interface WellnessOTTContextType {
  sessions: WellnessSession[];
  loading: boolean;
  refreshSessions: () => Promise<void>;
}

const WellnessOTTContext = createContext<WellnessOTTContextType | undefined>(undefined);

export const WellnessOTTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<WellnessSession[]>(staticSessions);
  const [loading, setLoading] = useState(true);

  const refreshSessions = async () => {
    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/wellness-sessions`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.sessions) {
          setSessions(data.sessions);
        }
      }
    } catch (err) {
      console.error("Failed to fetch wellness sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  return (
    <WellnessOTTContext.Provider value={{ sessions, loading, refreshSessions }}>
      {children}
    </WellnessOTTContext.Provider>
  );
};

export const useWellnessOTT = () => {
  const context = useContext(WellnessOTTContext);
  if (!context) {
    throw new Error('useWellnessOTT must be used within a WellnessOTTProvider');
  }
  return context;
};
