const mongoose = require('mongoose');

// Session Schema for storing active user sessions
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    signatureImage: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Session expires after 24 hours
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
sessionSchema.index({ userId: 1 });
sessionSchema.index({ expiresAt: 1 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
