import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center">
            <h1 className="display-1">Oops!</h1>
            <h2>Something went wrong</h2>
            <p className="text-muted">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <Link to="/" className="btn btn-primary mt-3">
              Go to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
