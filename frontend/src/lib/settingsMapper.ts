import type { ChatbotPersona, UserSettings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

const SETTINGS_CACHE_KEY = 'nirvaha_settings_cache';

export function normalizePersona(value?: string | null): ChatbotPersona {
  if (value === 'Emotional' || value === 'Deep' || value === 'Supportive') return value;
  return 'Supportive';
}

export function mergeSettingsFromApi(raw: Partial<UserSettings> | null): UserSettings {
  if (!raw) return { ...DEFAULT_SETTINGS };

  return {
    theme: raw.theme ?? DEFAULT_SETTINGS.theme,
    language: raw.language ?? DEFAULT_SETTINGS.language,
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...raw.notifications,
      types: {
        ...DEFAULT_SETTINGS.notifications.types,
        ...(raw.notifications?.types ?? {}),
      },
    },
    privacy: {
      ...DEFAULT_SETTINGS.privacy,
      ...raw.privacy,
      blockedUsers: raw.privacy?.blockedUsers ?? [],
    },
    music: {
      ...DEFAULT_SETTINGS.music,
      ...raw.music,
    },
    chatbotPersona: normalizePersona(raw.chatbotPersona),
    realtimeSync: raw.realtimeSync ?? DEFAULT_SETTINGS.realtimeSync,
    _id: raw._id,
    userId: raw.userId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export function loadCachedSettings(): UserSettings | null {
  try {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!cached) return null;
    return mergeSettingsFromApi(JSON.parse(cached));
  } catch {
    return null;
  }
}

export function cacheSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
}

export function clearSettingsCache(): void {
  localStorage.removeItem(SETTINGS_CACHE_KEY);
}

/** Sync legacy chatbot localStorage keys for offline/guest fallback */
export function syncLegacyChatbotKeys(settings: UserSettings): void {
  localStorage.setItem('nirvaha_bgmusic', String(settings.music.enabled));
  localStorage.setItem('nirvaha_persona', settings.chatbotPersona);
}

export function readLegacyChatbotPrefs(): Pick<UserSettings, 'music' | 'chatbotPersona'> {
  const bg = localStorage.getItem('nirvaha_bgmusic') === 'true';
  const persona = normalizePersona(localStorage.getItem('nirvaha_persona'));
  return {
    music: { enabled: bg, volume: 50 },
    chatbotPersona: persona,
  };
}

export { SETTINGS_CACHE_KEY };
