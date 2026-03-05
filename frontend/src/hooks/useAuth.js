import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { ROUTES, MESSAGES } from '../constants';

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const response = await authService.login(credentials);
      
      if (response.status === 404) {
        setError(response.message || MESSAGES.LOGIN_ERROR);
        return { success: false, message: response.message || MESSAGES.LOGIN_ERROR };
      }

      // Store sessionId if provided
      if (response.sessionId) {
        localStorage.setItem('sessionId', response.sessionId);
      }

      setMessage(MESSAGES.LOGIN_SUCCESS);
      navigate(ROUTES.VERIFICATION);
      return { success: true, message: MESSAGES.LOGIN_SUCCESS, sessionId: response.sessionId };
    } catch (err) {
      const errorMessage = err.response?.data?.message || MESSAGES.LOGIN_ERROR;
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const response = await authService.signup(formData);
      
      if (response.status === 404) {
        setError(response.message || MESSAGES.SIGNUP_ERROR);
        return { success: false, message: response.message || MESSAGES.SIGNUP_ERROR };
      }

      setMessage(MESSAGES.SIGNUP_SUCCESS);
      navigate(ROUTES.LOGIN);
      return { success: true, message: MESSAGES.SIGNUP_SUCCESS };
    } catch (err) {
      const errorMessage = err.response?.data?.message || MESSAGES.SIGNUP_ERROR;
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    loading,
    error,
    message,
  };
};
