import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from './AuthContext';
import { fetchUserSettings, updateUserSettings, deleteUserAccount } from '../lib/settingsApi';
import {
  cacheSettings,
  clearSettingsCache,
  loadCachedSettings,
  mergeSettingsFromApi,
  readLegacyChatbotPrefs,
  syncLegacyChatbotKeys,
} from '../lib/settingsMapper';
import { applyLanguage } from '../i18n';
import type {
  AppLanguage,
  ChatbotPersona,
  SettingsUpdate,
  ThemeMode,
  UserSettings,
} from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

type SettingsContextValue = {
  settings: UserSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateSettings: (patch: SettingsUpdate, options?: { persist?: boolean }) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setLanguage: (language: AppLanguage) => Promise<void>;
  setNotificationToggle: (
    key:
      | 'enabled'
      | 'communityPosts'
      | 'likesComments'
      | 'mentorReplies'
      | 'dailyWellness'
      | 'soundVibration',
    value: boolean
  ) => Promise<void>;
  setPrivacyToggle: (key: keyof UserSettings['privacy'], value: boolean) => Promise<void>;
  setMusicEnabled: (enabled: boolean) => Promise<void>;
  setChatbotPersona: (persona: ChatbotPersona) => Promise<void>;
  refreshSettings: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearChatHistory: (userId?: string) => void;
  blockedUsersCount: number;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { setTheme: setNextTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>(() => {
    const cached = loadCachedSettings();
    const legacy = readLegacyChatbotPrefs();
    return mergeSettingsFromApi({
      ...(cached ?? DEFAULT_SETTINGS),
      music: legacy.music,
      chatbotPersona: legacy.chatbotPersona,
    });
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const applyThemeLocally = useCallback(
    (theme: ThemeMode) => {
      setNextTheme(theme === 'system' ? 'system' : theme);
      localStorage.setItem('nirvaha_theme', theme);
    },
    [setNextTheme]
  );

  const applySettingsLocally = useCallback(
    (next: UserSettings) => {
      setSettings(next);
      cacheSettings(next);
      syncLegacyChatbotKeys(next);
      applyThemeLocally(next.theme);
      applyLanguage(next.language);
      window.dispatchEvent(new CustomEvent('nirvaha:settings-changed', { detail: next }));
    },
    [applyThemeLocally]
  );

  const persistToServer = useCallback(
    async (patch: SettingsUpdate) => {
      if (!user || !localStorage.getItem('token')) return null;
      setIsSaving(true);
      setError(null);
      try {
        const updated = await updateUserSettings(patch);
        const merged = mergeSettingsFromApi({ ...settingsRef.current, ...updated });
        applySettingsLocally(merged);
        return merged;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save settings';
        setError(message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [user, applySettingsLocally]
  );

  const updateSettings = useCallback(
    async (patch: SettingsUpdate, options?: { persist?: boolean }) => {
      const merged = mergeSettingsFromApi({ ...settingsRef.current, ...patch });
      applySettingsLocally(merged);
      const shouldPersist = options?.persist !== false && !!user && !!localStorage.getItem('token');
      if (shouldPersist) {
        await persistToServer(patch);
      }
    },
    [user, applySettingsLocally, persistToServer]
  );

  const refreshSettings = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      const cached = loadCachedSettings();
      if (cached) applySettingsLocally(mergeSettingsFromApi(cached));
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const remote = await fetchUserSettings();
      applySettingsLocally(mergeSettingsFromApi(remote));
    } catch (err) {
      const cached = loadCachedSettings();
      if (cached) applySettingsLocally(mergeSettingsFromApi(cached));
      const message = err instanceof Error ? err.message : 'Failed to load settings';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user, applySettingsLocally]);

  useEffect(() => {
    refreshSettings();
  }, [user?.id, refreshSettings]);

  useEffect(() => {
    const cachedTheme = (localStorage.getItem('nirvaha_theme') as ThemeMode) || settings.theme;
    applyThemeLocally(cachedTheme);
    applyLanguage(settings.language);
  }, []);

  const setTheme = useCallback(
    async (theme: ThemeMode) => updateSettings({ theme }),
    [updateSettings]
  );

  const setLanguage = useCallback(
    async (language: AppLanguage) => updateSettings({ language }),
    [updateSettings]
  );

  const setNotificationToggle = useCallback(
    async (
      key:
        | 'enabled'
        | 'communityPosts'
        | 'likesComments'
        | 'mentorReplies'
        | 'dailyWellness'
        | 'soundVibration',
      value: boolean
    ) => {
      await updateSettings({
        notifications: { ...settingsRef.current.notifications, [key]: value },
      });
    },
    [updateSettings]
  );

  const setPrivacyToggle = useCallback(
    async (key: keyof UserSettings['privacy'], value: boolean) => {
      const privacy = { ...settingsRef.current.privacy, [key]: value };
      if (key === 'privateProfile') {
        privacy.profileVisible = !value;
      }
      await updateSettings({ privacy });
    },
    [updateSettings]
  );

  const setMusicEnabled = useCallback(
    async (enabled: boolean) => {
      await updateSettings({ music: { ...settingsRef.current.music, enabled } });
    },
    [updateSettings]
  );

  const setChatbotPersona = useCallback(
    async (persona: ChatbotPersona) => {
      await updateSettings({ chatbotPersona: persona });
    },
    [updateSettings]
  );

  const deleteAccount = useCallback(async () => {
    await deleteUserAccount();
    clearSettingsCache();
    logout();
    window.location.href = '/login';
  }, [logout]);

  const clearChatHistory = useCallback((userId?: string) => {
    const key = userId ? `nirvaha_chat_v2_${userId}` : 'nirvaha_chat_v2_anonymous';
    localStorage.removeItem(key);
    localStorage.removeItem('nirvaha_chatbot_history');
    localStorage.removeItem('chatbot_messages');
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      isLoading,
      isSaving,
      error,
      updateSettings,
      setTheme,
      setLanguage,
      setNotificationToggle,
      setPrivacyToggle,
      setMusicEnabled,
      setChatbotPersona,
      refreshSettings,
      deleteAccount,
      clearChatHistory,
      blockedUsersCount: settings.privacy.blockedUsers?.length ?? 0,
    }),
    [
      settings,
      isLoading,
      isSaving,
      error,
      updateSettings,
      setTheme,
      setLanguage,
      setNotificationToggle,
      setPrivacyToggle,
      setMusicEnabled,
      setChatbotPersona,
      refreshSettings,
      deleteAccount,
      clearChatHistory,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
