import BACKEND_CONFIG from "../config/backend";

export const updatePathwayProgress = async (userId: string, pathwayId: string, lessonIndex: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/pathway-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, pathwayId, lessonIndex })
    });

    if (!response.ok) {
      throw new Error('Failed to update pathway progress');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating pathway progress:', error);
    throw error;
  }
};

export const enrollPathway = async (userId: string, pathwayId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/api/profile/enroll-pathway`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, pathwayId })
    });

    if (!response.ok) {
      throw new Error('Failed to enroll in pathway');
    }

    return await response.json();
  } catch (error) {
    console.error('Error enrolling in pathway:', error);
    throw error;
  }
};
