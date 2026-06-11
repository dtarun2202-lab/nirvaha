import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import BACKEND_CONFIG from "../config/backend";

export const useEnrollment = () => {
  const { user, syncUserFromServer } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEnrolled = useCallback((courseId: string) => {
    if (!user || !user.enrolledCourses) return false;
    return user.enrolledCourses.some(e => e.courseId === courseId);
  }, [user]);

  const enroll = useCallback(async (courseId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User must be logged in to enroll");
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/enrollments/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to enroll in the course");
      }

      // Sync the updated user payload (which includes enrolledCourses) from the server
      await syncUserFromServer();

      return true;
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [syncUserFromServer]);

  return {
    enroll,
    isEnrolled,
    loading,
    error,
  };
};
