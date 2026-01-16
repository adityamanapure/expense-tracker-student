// src/middleware/requestLogger.js
const morgan = require('morgan');
const config = require('../config/env');

/**
 * Request logging middleware
 */
const requestLogger = () => {
  if (config.nodeEnv === 'development') {
    // Detailed logging in development
    return morgan('dev');
  } else {
    // Combined format in production
    return morgan('combined');
  }
};

module.exports = requestLogger;
