import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { ROUTES } from './constants';
import 'bootstrap/dist/css/bootstrap.min.css';

// Lazy load components for code splitting
const Home = lazy(() => import('./components/home.jsx'));
const Login = lazy(() => import('./components/login.jsx'));
const Signup = lazy(() => import('./components/signup.jsx'));
const Verify = lazy(() => import('./components/verification.jsx'));
const Profile = lazy(() => import('./components/profile.jsx'));
const About = lazy(() => import('./components/about.jsx'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.VERIFICATION} element={<Verify />} />
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
