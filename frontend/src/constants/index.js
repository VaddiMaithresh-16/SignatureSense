// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/login-account',
  SIGNUP: '/signup-form',
  VERIFY: '/verify',
  PROFILE: '/profile',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  UNAUTHORIZED: 501,
  SERVICE_UNAVAILABLE: 503,
};

// App Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFICATION: '/verification',
  PROFILE: '/profile',
  ABOUT: '/about',
};

// Messages
export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_ERROR: 'There was an error in submitting form',
  EMAIL_NOT_FOUND: 'Email Not Found',
  INCORRECT_PASSWORD: 'Incorrect Password',
  SIGNUP_SUCCESS: 'Account created successfully',
  SIGNUP_ERROR: 'There was an error in creating account',
  VERIFICATION_ORIGINAL: 'ORIGINAL SIGNATURE',
  VERIFICATION_FORGED: 'FORGED SIGNATURE',
  VERIFICATION_ERROR: 'There was an error in the verification process',
  UPLOAD_ERROR: 'There was an error in uploading image',
  PROFILE_ERROR: 'Please login',
};

// Similarity Threshold
export const SIMILARITY_THRESHOLD = 0.99995;
