import React, { createContext, useContext, useEffect, useState } from "react";
import BACKEND_CONFIG from "../config/backend";

interface UserProfile {
  mobile: string;
  age: string;
  gender: string;
  address: string;
  education: string;
  healthCondition: string;
  additionalInfo?: string;
}

interface UserStats {
  sessionsPlayed: number;
  streak: number;
  totalMinutes: number;
  posts: number;
  followers: number;
  following: number;
  wellnessScore: number;
  weeklyMinutes: number[];
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  location?: string;
  followers?: number;
  following?: number;
  posts?: number;
  profile?: UserProfile;
  stats?: UserStats;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
  updateStats: (stats: Partial<UserStats>) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  refreshProfile: async () => {},
  updateStats: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/user`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            // Token might be invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/logout`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (e) {
      console.error("Logout error:", e);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Redirect to login page on logout
  };

  const updateProfile = (profile: UserProfile) => {
    if (!user) return;
    const updated = { ...user, profile };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const refreshProfile = async () => {
    if (!user?.id) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const updated = { ...user, bio: data.bio, location: data.location, stats: data.stats };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Failed to refresh profile:", e);
    }
  };

  const updateStats = (stats: Partial<UserStats>) => {
    if (!user) return;
    const updated = { ...user, stats: { ...user.stats, ...stats } as UserStats };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile, refreshProfile, updateStats }}>
      {children}
    </AuthContext.Provider>
  );
}; 
