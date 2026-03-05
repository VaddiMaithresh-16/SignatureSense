import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationService } from '../services/api';
import { ROUTES, MESSAGES, SIMILARITY_THRESHOLD, HTTP_STATUS } from '../constants';

export const useVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const verify = async (file) => {
    if (!file) {
      setError('Please select a signature file');
      return { success: false, message: 'Please select a signature file' };
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setShowProgress(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('signature', file);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + 10;
        }
        return prev;
      });
    }, 200);

    try {
      const response = await verificationService.verify(formData);
      clearInterval(progressInterval);
      setProgress(100);

      if (response.status === HTTP_STATUS.NOT_FOUND) {
        setError(response.message || MESSAGES.UPLOAD_ERROR);
        setTimeout(() => setShowProgress(false), 1000);
        return { success: false, message: response.message || MESSAGES.UPLOAD_ERROR };
      }

      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        alert(response.message);
        navigate(ROUTES.LOGIN);
        setError(MESSAGES.PROFILE_ERROR);
        setTimeout(() => setShowProgress(false), 1000);
        return { success: false, message: MESSAGES.PROFILE_ERROR };
      }

      // Handle Flask server not running
      if (response.status === 503 || response.error === 'FLASK_SERVER_NOT_RUNNING') {
        const errorMsg = response.message || 'Image comparison service is not available. Please start the Flask API server.';
        setError(errorMsg);
        setTimeout(() => setShowProgress(false), 1000);
        return { success: false, message: errorMsg };
      }

      const isOriginal = response.similarity > SIMILARITY_THRESHOLD;
      const message = isOriginal ? MESSAGES.VERIFICATION_ORIGINAL : MESSAGES.VERIFICATION_FORGED;
      
      setResult({
        isOriginal,
        message,
        similarity: response.similarity,
      });

      setTimeout(() => setShowProgress(false), 1000);
      return { success: true, isOriginal, message, similarity: response.similarity };
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(100);
      const errorMessage = err.response?.data?.message || MESSAGES.VERIFICATION_ERROR;
      setError(errorMessage);
      setTimeout(() => setShowProgress(false), 1000);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    verify,
    loading,
    result,
    error,
    progress,
    showProgress,
  };
};
