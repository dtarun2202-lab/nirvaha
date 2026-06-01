export type ThemeMode = 'light' | 'dark' | 'system';
export type AppLanguage = 'en' | 'hi' | 'te' | 'kn';
export type ChatbotPersona = 'Supportive' | 'Emotional' | 'Deep';

export interface NotificationTypes {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  types: NotificationTypes;
  communityPosts: boolean;
  likesComments: boolean;
  mentorReplies: boolean;
  dailyWellness: boolean;
  soundVibration: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  dataExportable: boolean;
  allowSearch: boolean;
  privateProfile: boolean;
  hideActivityStatus: boolean;
  blockedUsers: string[];
}

export interface MusicSettings {
  enabled: boolean;
  volume: number;
}

export interface UserSettings {
  _id?: string;
  userId?: string;
  theme: ThemeMode;
  language: AppLanguage;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  music: MusicSettings;
  chatbotPersona: ChatbotPersona | 'default';
  realtimeSync: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SettingsUpdate = Partial<
  Pick<UserSettings, 'theme' | 'language' | 'notifications' | 'privacy' | 'music' | 'chatbotPersona' | 'realtimeSync'>
>;

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'en',
  notifications: {
    enabled: true,
    types: { email: true, push: true, sms: false },
    communityPosts: true,
    likesComments: true,
    mentorReplies: true,
    dailyWellness: true,
    soundVibration: true,
  },
  privacy: {
    profileVisible: true,
    dataExportable: true,
    allowSearch: true,
    privateProfile: false,
    hideActivityStatus: false,
    blockedUsers: [],
  },
  music: { enabled: false, volume: 50 },
  chatbotPersona: 'Supportive',
  realtimeSync: true,
};
