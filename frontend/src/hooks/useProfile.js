import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/api';
import { ROUTES, HTTP_STATUS } from '../constants';

export const useProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await profileService.getProfile();

      if (response.status === HTTP_STATUS.NOT_FOUND) {
        const errorMsg = response.message || 'Please login to view profile';
        setError(errorMsg);
        // Don't navigate immediately, let user see the error
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 2000);
        return;
      }

      if (response.status === 200) {
        setProfile({
          username: response.username || 'N/A',
          email: response.email || response.mail || 'N/A',
          createdOn: response.created || 'N/A',
        });
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Profile load failed:', err);
      const errorMsg = err.message || err.response?.data?.message || 'Failed to load profile';
      setError(errorMsg);
      
      // Only navigate if it's a session/auth error
      if (errorMsg.includes('session') || errorMsg.includes('login') || errorMsg.includes('Session')) {
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    refetch: loadProfile,
  };
};
