import { useRef } from 'react';
import { useVerification } from '../hooks/useVerification';
import LoadingSpinner from './LoadingSpinner';
import Nav2 from './nav2';
import '../css/verification.css';

function Verify() {
  const fileInputRef = useRef(null);
  const { verify, loading, result, error, progress, showProgress } = useVerification();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      verify(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files[0];
    if (file) {
      await verify(file);
    }
  };

  const displayMessage = result?.message || error;
  const isSuccess = result?.isOriginal;

  return (
    <>
      <Nav2 />
      <section className="verification-section">
        <div className="verification-container">
          <div className="verification-card">
            <form onSubmit={handleSubmit}>
              <div className="upload-section">
                <label htmlFor="file-input" className="upload-label">
                  <h1>Upload Image</h1>
                </label>
                <input
                  ref={fileInputRef}
                  className="file-input"
                  id="file-input"
                  type="file"
                  name="signature"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={loading || !fileInputRef.current?.files[0]}
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Submit'}
              </button>
            </form>

            {/* Show progress bar if verification is in progress */}
            {showProgress && (
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progress === 100 ? (isSuccess ? 'green' : 'red') : 'blue',
                  }}
                ></div>
                <span className="progress-text">{progress}%</span>
              </div>
            )}

            {displayMessage && (
              <p className={`response-message ${isSuccess ? 'success' : 'error'}`}>
                {displayMessage}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Verify;
