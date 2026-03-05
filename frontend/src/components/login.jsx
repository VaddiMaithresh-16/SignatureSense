import { Link } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import Nav1 from './nav1';
import { ROUTES } from '../constants';
import '../css/login.css';

function Login() {
  const { values, handleChange } = useForm({
    email: '',
    password: '',
  });

  const { login, loading, error, message } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(values);
  };

  return (
    <>
      <Nav1 />
      <div className="logdiv">
        <div className="container">
          <div className="row align-items-center justify-content-center vh-100">
            <section className="col-12 col-md-6" data-bs-theme="light">
              <div className="card shadow text-center p-3">
                <h1>Login</h1>
                <p>
                  Access your account to manage and view your signature verifications.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group text-left">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      onChange={handleChange}
                      value={values.email}
                      placeholder="Email Address"
                      required
                      disabled={loading}
                    />
                  </div>
                  <br />
                  <div className="form-group text-left">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                      placeholder="Password"
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary m-2 text-center"
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Sign in'}
                  </button>
                  <Link to={ROUTES.SIGNUP}>
                    <p>
                      <span>Don't have an account?</span> Create Account
                    </p>
                  </Link>
                </form>
                {(error || message) && (
                  <p style={{ color: error ? 'red' : 'green' }}>
                    {error || message}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;