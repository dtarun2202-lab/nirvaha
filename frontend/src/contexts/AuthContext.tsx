import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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

export interface User {
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
  sessionHistory?: Array<Record<string, unknown>>;
  pathwayProgress?: Record<string, {
    completedLessons: number[];
    startedAt: string;
    lastAccessedAt: string;
  }>;
  enrolledPathways?: string[];
  isApprovedCompanion?: boolean;
  companionStatus?: string | null;
  companionId?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
  syncUserFromServer: () => Promise<User | null>;
  updateStats: (stats: Partial<UserStats>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  refreshProfile: async () => {},
  syncUserFromServer: async () => null,
  updateStats: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const applyServerUser = useCallback((serverUser: User) => {
    setUser(serverUser);
    localStorage.setItem("user", JSON.stringify(serverUser));
    return serverUser;
  }, []);

  const syncUserFromServer = useCallback(async (): Promise<User | null> => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          const serverUser = data.user as User;
          console.log("[auth] syncUserFromServer:", {
            email: serverUser.email,
            isApprovedCompanion: serverUser.isApprovedCompanion,
            companionStatus: serverUser.companionStatus,
          });
          return applyServerUser(serverUser);
        }
      } else if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to sync user from server:", e);
    }
    return null;
  }, [applyServerUser]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await syncUserFromServer();
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [syncUserFromServer]);

  useEffect(() => {
    const handleCompanionApprovalSync = () => {
      void syncUserFromServer();
    };
    window.addEventListener("nirvaha-user-sync-request", handleCompanionApprovalSync);
    return () => {
      window.removeEventListener("nirvaha-user-sync-request", handleCompanionApprovalSync);
    };
  }, [syncUserFromServer]);

  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    applyServerUser(userData);
    void syncUserFromServer();
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.error("Logout error:", e);
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const updateProfile = (profile: UserProfile) => {
    if (!user) return;
    applyServerUser({ ...user, profile });
  };

  const refreshProfile = async () => {
    await syncUserFromServer();
  };

  const updateStats = (stats: Partial<UserStats>) => {
    if (!user) return;
    applyServerUser({ ...user, stats: { ...user.stats, ...stats } as UserStats });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateProfile,
        refreshProfile,
        syncUserFromServer,
        updateStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
