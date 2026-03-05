// Application Constants

// Similarity Threshold for Signature Verification
// Values range from 0.0 to 1.0
// Higher values = stricter matching (more similar signatures required)
// Lower values = more lenient matching
// Recommended range: 0.95 - 0.99999
module.exports.SIMILARITY_THRESHOLD = process.env.SIMILARITY_THRESHOLD 
  ? parseFloat(process.env.SIMILARITY_THRESHOLD) 
  : 0.99995;

// Session expiration time (in milliseconds)
// Default: 24 hours
module.exports.SESSION_EXPIRY = process.env.SESSION_EXPIRY 
  ? parseInt(process.env.SESSION_EXPIRY) 
  : 24 * 60 * 60 * 1000;

// Password hashing salt rounds
module.exports.BCRYPT_SALT_ROUNDS = 10;
