// src/middleware/security.js
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('../config/env');

/**
 * Custom middleware for sanitizing MongoDB queries
 * Compatible with Express 5.x
 */
const sanitizeMongoQueries = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        // Remove keys starting with $
        if (key.startsWith('$')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      });
    }
    return obj;
  };

  if (req.body) {
    sanitize(req.body);
  }
  if (req.params) {
    sanitize(req.params);
  }
  // Note: req.query is read-only in Express 5, so we skip it
  // Query parameters are validated by express-validator instead

  next();
};

/**
 * Security middleware configuration
 */
const securityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet({
    contentSecurityPolicy: config.nodeEnv === 'production',
    crossOriginEmbedderPolicy: config.nodeEnv === 'production',
  }));
  
  // Enable CORS
  app.use(cors(config.cors));
  
  // Data sanitization against NoSQL query injection
  app.use(sanitizeMongoQueries);
  
  // Prevent HTTP Parameter Pollution
  app.use(hpp({
    whitelist: ['category', 'month', 'year'] // Allow duplicate query params for these fields
  }));
  
  // Rate limiting for all routes
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);
  
  // Stricter rate limiting for auth routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/signup', authLimiter);
};

module.exports = securityMiddleware;
