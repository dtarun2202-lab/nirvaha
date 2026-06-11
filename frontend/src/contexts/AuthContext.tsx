import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import BACKEND_CONFIG from "../config/backend";
import { auth, googleProvider } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile
} from "firebase/auth";

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
  isApprovedCompanion?: boolean;
  companionStatus?: string | null;
  companionId?: string | null;
  enrolledCourses?: Array<{
    courseId: string;
    enrolledAt: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
  syncUserFromServer: () => Promise<User | null>;
  setCurrentUser: (user: User | null) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  refreshProfile: async () => {},
  syncUserFromServer: async () => null,
  setCurrentUser: () => {},
  updateStats: () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginWithGoogle: async () => {},
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

  const setCurrentUser = useCallback((serverUser: User | null) => {
    if (!serverUser) {
      setUser(null);
      localStorage.removeItem("user");
      return;
    }
    applyServerUser(serverUser);
  }, [applyServerUser]);

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
          console.log('🔍 AuthContext.syncUserFromServer() - User data received:', {
            userId: serverUser.id,
            email: serverUser.email,
            sessionHistoryLength: serverUser.sessionHistory?.length || 0,
            sessionHistory: serverUser.sessionHistory
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

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem("token", token);
    applyServerUser(userData);
    void syncUserFromServer();
  }, [applyServerUser, syncUserFromServer]);

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.error("Firebase logout error:", e);
    }

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (e) {
      console.error("Logout error:", e);
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  // Helper to authenticate user ID token with the backend
  const authenticateWithBackend = async (idToken: string, name?: string) => {
    const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/firebase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, name }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Authentication failed");
    }

    login(data.user, data.token);
    return data;
  };

  // Helper for mock developer login (if Firebase variables are not set or during local development troubleshooting)
  const performMockDeveloperLogin = async (mockEmail: string, mockName: string) => {
    console.warn("🔮 Performing mock developer authentication bypass");
    
    // Safe base64url encoder that supports Unicode and strips trailing '=' padding
    const base64UrlEncode = (str: string) => {
      const base64 = btoa(unescape(encodeURIComponent(str)));
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    };

    const dummyHeader = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const dummyPayload = base64UrlEncode(JSON.stringify({
      uid: "mock-uid-" + Math.random().toString(36).substring(2, 11),
      email: mockEmail,
      name: mockName,
      picture: "https://api.dicebear.com/7.x/adventurer/svg?seed=" + encodeURIComponent(mockName)
    }));
    const mockToken = `${dummyHeader}.${dummyPayload}.dummy-signature`;

    return await authenticateWithBackend(mockToken, mockName);
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
      if (!isFirebaseConfigured) {
        await performMockDeveloperLogin(email, email.split("@")[0]);
        return;
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await authenticateWithBackend(idToken);
    } catch (error: any) {
      console.error("loginWithEmail error:", error);
      
      // Attempt backend direct login fallback
      console.log("Attempting direct backend login fallback...");
      try {
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            console.log("✓ Backend direct login successful");
            login(data.user, data.token);
            return;
          }
        }
      } catch (backendErr) {
        console.error("Backend direct login fallback failed:", backendErr);
      }

      if (error.code === "auth/invalid-api-key" || error.code === "auth/invalid-config") {
        console.warn("Config error caught. Bypassing Firebase for local testing.");
        await performMockDeveloperLogin(email, email.split("@")[0]);
      } else {
        throw error;
      }
    }
  };

  const signupWithEmail = async (name: string, email: string, password: string) => {
    try {
      const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
      if (!isFirebaseConfigured) {
        await performMockDeveloperLogin(email, name);
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      const idToken = await userCredential.user.getIdToken();
      await authenticateWithBackend(idToken, name);
    } catch (error: any) {
      console.error("signupWithEmail error:", error);

      // Attempt backend direct register fallback
      console.log("Attempting direct backend register fallback...");
      try {
        const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            console.log("✓ Backend direct register successful");
            login(data.user, data.token);
            return;
          }
        }
      } catch (backendErr) {
        console.error("Backend direct register fallback failed:", backendErr);
      }

      if (error.code === "auth/invalid-api-key" || error.code === "auth/invalid-config") {
        console.warn("Config error caught. Bypassing Firebase for local testing.");
        await performMockDeveloperLogin(email, name);
      } else {
        throw error;
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
      if (!isFirebaseConfigured) {
        await performMockDeveloperLogin("google.user@example.com", "Google Seeker");
        return;
      }
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await authenticateWithBackend(idToken);
    } catch (error: any) {
      console.error("loginWithGoogle error:", error);
      if (error.code === "auth/invalid-api-key" || error.code === "auth/invalid-config" || error.code === "auth/operation-not-allowed") {
        console.warn("Config error caught. Bypassing Firebase for local testing.");
        await performMockDeveloperLogin("google.user@example.com", "Google Seeker");
      } else {
        throw error;
      }
    }
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
        setCurrentUser,
        updateStats,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
