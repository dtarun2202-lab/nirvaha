import BACKEND_CONFIG from "@/config/backend";

type ContentStatus = "Active" | "Draft";

type ApiError = {
  message?: string;
  error?: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || BACKEND_CONFIG.API_BASE_URL || "http://localhost:5000";

const jsonHeaders = {
  "Content-Type": "application/json",
};

async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...jsonHeaders,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T | ApiError) : ({} as T | ApiError);

  if (!response.ok) {
    const message =
      (data as ApiError).message ||
      (data as ApiError).error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export type MeditationItem = {
  id: string;
  title: string;
  duration: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  description: string;
  status: ContentStatus;
  thumbnailUrl?: string;
  bannerUrl?: string;
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SoundItem = {
  id: string;
  title: string;
  artist: string;
  frequency: string;
  mood: string[];
  duration: number;
  category: string;
  description: string;
  status: ContentStatus;
  thumbnailUrl?: string;
  bannerUrl?: string;
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type MeditationPayload = Omit<MeditationItem, "id" | "createdAt" | "updatedAt">;
export type SoundPayload = Omit<SoundItem, "id" | "createdAt" | "updatedAt">;

export async function getMeditations(): Promise<MeditationItem[]> {
  return requestJson<MeditationItem[]>("/api/meditations", { method: "GET" });
}

export async function createMeditation(payload: MeditationPayload): Promise<MeditationItem> {
  return requestJson<MeditationItem>("/api/meditations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMeditation(
  id: string,
  payload: MeditationPayload
): Promise<MeditationItem> {
  return requestJson<MeditationItem>(`/api/meditations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteMeditation(id: string): Promise<void> {
  await requestJson<void>(`/api/meditations/${id}`, { method: "DELETE" });
}

export async function getSounds(): Promise<SoundItem[]> {
  return requestJson<SoundItem[]>("/api/sounds", { method: "GET" });
}

export async function createSound(payload: SoundPayload): Promise<SoundItem> {
  return requestJson<SoundItem>("/api/sounds", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateSound(id: string, payload: SoundPayload): Promise<SoundItem> {
  return requestJson<SoundItem>(`/api/sounds/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteSound(id: string): Promise<void> {
  await requestJson<void>(`/api/sounds/${id}`, { method: "DELETE" });
}
