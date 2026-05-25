import BACKEND_CONFIG from '../config/backend';
import type { SettingsUpdate, UserSettings } from '../types/settings';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function fetchUserSettings(): Promise<UserSettings> {
  const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/users/settings`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch settings');
  }
  return response.json();
}

export async function updateUserSettings(update: SettingsUpdate): Promise<UserSettings> {
  const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/users/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(update),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update settings');
  }
  return response.json();
}

export async function deleteUserAccount(): Promise<void> {
  const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/users/account`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete account');
  }
}
