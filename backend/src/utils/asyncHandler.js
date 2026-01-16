// src/utils/asyncHandler.js
/**
 * Wrapper for async route handlers to catch errors
 * Eliminates the need for try-catch blocks in controllers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
