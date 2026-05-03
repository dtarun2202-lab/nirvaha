import BACKEND_CONFIG from "@/config/backend";

type ApiError = {
  message?: string;
  error?: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || BACKEND_CONFIG.API_BASE_URL || "http://localhost:5001";

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

export type CompanionApplicationPayload = {
  fullName: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  experience: string;
  location: string;
  languages: string;
  specialties: string;
  certifications?: string;
  hourlyRate: string | number;
  callRate: string | number;
  availability: string;
  profileImage?: string;
  coverImage?: string;
  website?: string;
  socialLinks?: string;
  whyJoin: string;
};

export type CompanionApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  experience: string;
  location: string;
  languages: string;
  specialties: string;
  certifications?: string;
  hourlyRate: number;
  callRate: number;
  availability: string;
  profileImage?: string;
  coverImage?: string;
  website?: string;
  socialLinks?: string;
  whyJoin?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CompanionAdminItem = {
  id: string;
  name: string;
  email: string;
  expertise: string;
  specialties: string[];
  languages: string[];
  rating: number;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  location?: string;
  pricing: {
    chat: number;
    video: number;
  };
  availability: string[];
};

export type CompanionPublicItem = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  coverImage: string;
  availability: string;
  rating: number;
  reviews: number;
  sessions: number;
  location: string;
  bio: string;
  specialties: string[];
  hourlyRate: number;
  callRate: number;
};

export async function getCompanionApplications(
  status?: "all" | "pending" | "approved" | "rejected"
): Promise<CompanionAdminItem[]> {
  const query = status && status !== "all" ? `?status=${status}` : "";
  return requestJson<CompanionAdminItem[]>(`/api/companion/applications${query}`);
}

export async function getCompanionApplication(
  id: string
): Promise<CompanionApplication> {
  return requestJson<CompanionApplication>(`/api/companion/applications/${id}`);
}

export async function createCompanionApplication(
  payload: CompanionApplicationPayload
): Promise<{ id: string; status: string; submittedAt?: string }>
{
  return requestJson<{ id: string; status: string; submittedAt?: string }>(
    "/api/companion/applications",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function updateCompanionApplication(
  id: string,
  payload: Record<string, unknown>
): Promise<CompanionAdminItem> {
  return requestJson<CompanionAdminItem>(`/api/companion/applications/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function updateCompanionStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<CompanionAdminItem> {
  return requestJson<CompanionAdminItem>(`/api/companion/applications/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

export async function deleteCompanionApplication(id: string): Promise<void> {
  await requestJson<void>(`/api/companion/applications/${id}`, { method: "DELETE" });
}

export async function getApprovedCompanions(): Promise<CompanionPublicItem[]> {
  const response = await requestJson<{ success: boolean; data: CompanionPublicItem[] }>(
    "/api/companion"
  );
  return response.data || [];
}
