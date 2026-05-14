import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SessionData {
  duration: number;
  sessionType: 'meditation' | 'sound';
  title: string;
  category?: string;
}

interface ProfileUpdate {
  meditationMinutes?: number;
  soundMinutes?: number;
  totalSessions?: number;
  streak?: number;
  todayMinutes?: number;
  weeklyMinutes?: number[];
  consistency?: number;
  emotionalLandscape?: {
    calm?: number;
    relaxed?: number;
    peaceful?: number;
    focused?: number;
    energized?: number;
  };
}

// Safe profile sync hook with all stability requirements
export const useProfileSync = () => {
  const { user, updateStats, refreshProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get current weekday index (0 = Monday, 6 = Sunday)
  const getCurrentWeekdayIndex = useCallback(() => {
    const today = new Date();
    return today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert Sunday=0 to Saturday=6
  }, []);

  // Update profile stats safely with all fallbacks
  const updateProfileStats = useCallback(async (sessionData: SessionData) => {
    if (!user?.id || isUpdating) return;

    setIsUpdating(true);
    
    try {
      // Safe current stats with fallbacks
      const currentStats = user.stats || {
        sessionsPlayed: 0,
        streak: 0,
        totalMinutes: 0,
        posts: 0,
        followers: 0,
        following: 0,
        wellnessScore: 0,
        weeklyMinutes: [0, 0, 0, 0, 0, 0]
      };

      // Calculate safe updates
      const updates: ProfileUpdate = {};
      
      // Session mapping based on type
      if (sessionData.sessionType === 'sound' && sessionData.title.includes('Deep Ocean Healing')) {
        // Sound healing session
        updates.soundMinutes = (currentStats.totalMinutes || 0) + sessionData.duration;
        updates.totalSessions = (currentStats.sessionsPlayed || 0) + 1;
      } else {
        // Meditation session
        updates.meditationMinutes = (currentStats.totalMinutes || 0) + sessionData.duration;
        updates.totalSessions = (currentStats.sessionsPlayed || 0) + 1;
      }

      // Update emotional landscape based on session category
      const emotionalUpdates: ProfileUpdate['emotionalLandscape'] = {};
      
      if (sessionData.category) {
        switch (sessionData.category.toLowerCase()) {
          case 'nature sounds':
            emotionalUpdates.calm = 35;
            emotionalUpdates.peaceful = 40;
            emotionalUpdates.relaxed = 25;
            break;
          case 'sacred healing':
            emotionalUpdates.calm = 25;
            emotionalUpdates.peaceful = 30;
            emotionalUpdates.relaxed = 45;
            break;
          case 'bowl therapy':
            emotionalUpdates.calm = 20;
            emotionalUpdates.peaceful = 25;
            emotionalUpdates.relaxed = 55;
            break;
          case 'focus boost':
            emotionalUpdates.calm = 15;
            emotionalUpdates.focused = 45;
            emotionalUpdates.peaceful = 20;
            emotionalUpdates.energized = 20;
            break;
          case 'deep frequencies':
            emotionalUpdates.calm = 20;
            emotionalUpdates.peaceful = 20;
            emotionalUpdates.relaxed = 20;
            emotionalUpdates.energized = 40;
            break;
        }
        
        if (Object.keys(emotionalUpdates).length > 0) {
          updates.emotionalLandscape = emotionalUpdates;
        }
      }

      // Update streak logic
      const today = new Date().toDateString();
      const lastSessionDate = localStorage.getItem(`lastSession_${user.id}`);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (lastSessionDate !== today) {
        if (lastSessionDate === yesterday) {
          // Consecutive day - increase streak
          updates.streak = (currentStats.streak || 0) + 1;
        } else {
          // New streak
          updates.streak = 1;
        }
        localStorage.setItem(`lastSession_${user.id}`, today);
      }

      // Update today's practice time
      const todayMinutesKey = `todayMinutes_${user.id}`;
      const currentTodayMinutes = parseInt(localStorage.getItem(todayMinutesKey) || '0', 10);
      const newTodayMinutes = currentTodayMinutes + sessionData.duration;
      localStorage.setItem(todayMinutesKey, newTodayMinutes.toString());
      updates.todayMinutes = newTodayMinutes;

      // Update weekly chart data
      const weeklyMinutes = [...(currentStats.weeklyMinutes || [0, 0, 0, 0, 0, 0])];
      const weekdayIndex = getCurrentWeekdayIndex();
      weeklyMinutes[weekdayIndex] = (weeklyMinutes[weekdayIndex] || 0) + sessionData.duration;
      updates.weeklyMinutes = weeklyMinutes;

      // Update consistency percentage (gradual increase)
      const currentConsistency = currentStats.wellnessScore || 0;
      updates.consistency = Math.min(100, currentConsistency + (sessionData.duration >= 10 ? 2 : 1));

      // Apply updates safely
      updateStats(updates);

      // Refresh profile from backend to ensure persistence
      setTimeout(() => {
        refreshProfile();
      }, 100);

    } catch (error) {
      console.error('Profile sync error:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [user, updateStats, refreshProfile, isUpdating, getCurrentWeekdayIndex]);

  // Get today's minutes from localStorage
  const getTodayMinutes = useCallback(() => {
    if (!user?.id) return 0;
    return parseInt(localStorage.getItem(`todayMinutes_${user.id}`) || '0', 10);
  }, [user?.id]);

  // Get weekly data for insights
  const getWeeklyData = useCallback(() => {
    if (!user?.stats?.weeklyMinutes) {
      return { totalWeeklyMinutes: 0, mostActiveDay: 'No activity yet', weeklyMinutes: [0, 0, 0, 0, 0, 0, 0] };
    }

    const weeklyMinutes = user.stats.weeklyMinutes;
    const totalWeeklyMinutes = weeklyMinutes.reduce((sum, minutes) => sum + (minutes || 0), 0);
    
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const mostActiveDayIndex = weeklyMinutes.reduce((maxIndex, minutes, index) => 
      (minutes || 0) > (weeklyMinutes[maxIndex] || 0) ? index : maxIndex, 0);
    
    return {
      totalWeeklyMinutes,
      mostActiveDay: weeklyMinutes[mostActiveDayIndex] > 0 ? dayNames[mostActiveDayIndex] : 'No activity yet',
      weeklyMinutes
    };
  }, [user?.stats?.weeklyMinutes]);

  return {
    updateProfileStats,
    getTodayMinutes,
    getWeeklyData,
    isUpdating
  };
};
