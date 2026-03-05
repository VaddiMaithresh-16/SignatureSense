import { useProfile } from '../hooks/useProfile';
import LoadingSpinner from './LoadingSpinner';
import Nav3 from './nav3';

function Profile() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <>
        <Nav3 />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav3 />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="card" style={{ width: '48rem' }}>
            <div className="card-header bg-danger text-white">Error</div>
            <div className="card-body">
              <p className="card-text">{error}</p>
              <button 
                className="btn btn-primary" 
                onClick={() => window.location.href = '/login'}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Nav3 />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="card" style={{ width: '48rem' }}>
            <div className="card-header">Profile</div>
            <div className="card-body">
              <p className="card-text">No profile data available.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav3 />
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card" style={{ width: '48rem' }}>
          <div className="card-header">Profile Details</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>User Name:</strong> {profile.username || 'N/A'}
            </li>
            <li className="list-group-item">
              <strong>E-mail:</strong> {profile.email || 'N/A'}
            </li>
            <li className="list-group-item">
              <strong>Created on:</strong> {profile.createdOn || 'N/A'}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Profile;
