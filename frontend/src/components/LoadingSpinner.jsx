const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg',
  };

  return (
    <div className={`spinner-border ${sizeClasses[size]} text-primary`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
