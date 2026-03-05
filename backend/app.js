require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');
const FormData = require('form-data');

// Import models
const User = require('./models/User');
const Session = require('./models/Session');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/build')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure uploads directory exists
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Helper function to get session from MongoDB
const getSession = async (sessionId) => {
  try {
    const session = await Session.findById(sessionId).populate('userId');
    if (!session || session.expiresAt < new Date()) {
      return null;
    }
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Helper function to create session
const createSession = async (user) => {
  try {
    // Delete any existing sessions for this user
    await Session.deleteMany({ userId: user._id });

    // Create new session
    const session = new Session({
      userId: user._id,
      username: user.username,
      email: user.email,
      signatureImage: user.signatureImage,
    });

    await session.save();
    return session._id.toString();
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 200, message: 'Server is running' });
});

// Profile endpoint - Get user profile from MongoDB session
app.post('/profile', async (req, res) => {
  try {
    // Get session ID from request (you can send it in body or headers)
    const { sessionId } = req.body;

    console.log('Profile request received, sessionId:', sessionId ? 'present' : 'missing');

    if (!sessionId) {
      return res.json({
        status: 404,
        message: 'Please login to view profile',
      });
    }

    const session = await getSession(sessionId);

    if (!session) {
      console.log('Session not found or expired');
      return res.json({
        status: 404,
        message: 'Session expired. Please login again',
      });
    }

    // Get user details
    const user = await User.findById(session.userId);

    if (!user) {
      console.log('User not found for session userId:', session.userId);
      return res.json({
        status: 404,
        message: 'User not found',
      });
    }

    console.log('Profile data retrieved successfully for user:', user.email);

    res.json({
      status: 200,
      username: user.username,
      mail: user.email,
      email: user.email, // Add both for compatibility
      created: user.createdAt.toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.json({
      status: 404,
      message: 'Error fetching profile: ' + error.message,
    });
  }
});

// Login endpoint
app.post('/login-account', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.json({
        status: 404,
        message: 'Please enter all details',
      });
    }

    // Find user in MongoDB by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.json({
        status: 404,
        message: 'Email Not Found',
      });
    }

    // Compare password using bcrypt
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.json({
        status: 404,
        message: 'Incorrect Password',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create session in MongoDB
    const sessionId = await createSession(user);

    res.json({
      status: 200,
      message: 'Login Done Successfully',
      sessionId: sessionId,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.json({
      status: 404,
      message: 'There is an error in submitting form',
    });
  }
});

// Signup endpoint
app.post('/signup-form', upload.single('sigfile'), async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.json({
        status: 404,
        message: 'Please enter all details',
      });
    }

    if (password !== confirmPassword) {
      return res.json({
        status: 404,
        message: 'Password and confirmPassword do not match',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.json({
        status: 404,
        message: existingUser.username === username
          ? 'Username already exists'
          : 'Email already exists',
      });
    }

    // Handle file upload
    let signatureImagePath = null;
    if (req.file) {
      signatureImagePath = path.join(__dirname, 'uploads', req.file.filename);
    }

    // Create new user (password will be hashed automatically by pre-save hook)
    const newUser = new User({
      username,
      email,
      password, // Will be hashed by pre-save hook
      signatureImage: signatureImagePath,
    });

    await newUser.save();

    console.log('✅ User created successfully:', newUser.username);

    res.json({
      status: 200,
      message: 'Signup successful',
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.json({
        status: 404,
        message: `${field} already exists`,
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.json({
        status: 404,
        message: messages.join(', '),
      });
    }

    return res.json({
      status: 404,
      message: error.message || 'Error creating account',
    });
  }
});

// Verify signature endpoint
app.post('/verify', upload.single('signature'), async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Check session
    if (!sessionId) {
      return res.json({
        status: 501,
        message: 'Please login to verify the signature',
      });
    }

    const session = await getSession(sessionId);

    if (!session) {
      return res.json({
        status: 501,
        message: 'Session expired. Please login again',
      });
    }

    if (!req.file) {
      return res.json({
        status: 404,
        message: 'Please upload a signature image',
      });
    }

    if (!session.signatureImage) {
      return res.json({
        status: 404,
        message: 'User signature not found. Please update your profile',
      });
    }

    // Check if signature image file exists
    if (!fs.existsSync(session.signatureImage)) {
      return res.json({
        status: 404,
        message: 'User signature file not found',
      });
    }

    console.log('Uploaded file path:', req.file.path);
    console.log('User signature path:', session.signatureImage);

    // Prepare form data for Flask API
    const formData = new FormData();
    formData.append('image1', fs.createReadStream(req.file.path));
    formData.append('image2', fs.createReadStream(session.signatureImage));

    const flaskApiUrl = process.env.FLASK_API_URL || 'http://localhost:7777';

    // Call Flask API for image comparison
    let response;
    try {
      response = await axios.post(
        `${flaskApiUrl}/compare_images`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000, // 30 second timeout
        }
      );
    } catch (axiosError) {
      console.error('Flask API connection error:', axiosError.code, axiosError.message);
      
      if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ETIMEDOUT') {
        return res.json({
          status: 503,
          message: 'Image comparison service is not available. Please ensure the Flask API server is running on port 7777.',
          error: 'FLASK_SERVER_NOT_RUNNING',
        });
      }

      throw axiosError; // Re-throw other errors
    }

    console.log('Flask response data:', response.data);

    // Check if response has error
    if (response.data.error) {
      console.error('Flask API error:', response.data.error);
      return res.json({
        status: 500,
        message: 'Error in image comparison: ' + response.data.error,
      });
    }

    const similarity = response.data.similarity;
    const { SIMILARITY_THRESHOLD } = require('./config/constants');

    res.json({
      status: 200,
      message: similarity >= SIMILARITY_THRESHOLD ? 'Match' : 'No Match',
      similarity: similarity,
    });
  } catch (error) {
    console.error('Error in /verify:', error);

    if (error.response) {
      return res.json({
        status: 500,
        message: 'Error in image comparison service: ' + (error.response.data?.error || error.message),
      });
    }

    res.json({
      status: 500,
      message: 'Error in verification process: ' + error.message,
    });
  }
});

// Logout endpoint
app.post('/logout', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (sessionId) {
      await Session.findByIdAndDelete(sessionId);
    }

    res.json({
      status: 200,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.json({
      status: 404,
      message: 'Error logging out',
    });
  }
});

// Fallback route for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build', '/index.html'));
});

module.exports = app;
