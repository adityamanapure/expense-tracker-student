// src/constants/index.js

/**
 * Expense categories
 */
exports.EXPENSE_CATEGORIES = [
  'Food & Snacks',
  'Transport',
  'Study Materials',
  'Entertainment',
  'Shopping',
  'Recharge & Internet',
  'Hostel/Rent',
  'Medical',
  'Grooming',
  'Others'
];

/**
 * Payment modes
 */
exports.PAYMENT_MODES = [
  'Cash',
  'UPI',
  'Card',
  'Net Banking'
];

/**
 * HTTP Status Codes
 */
exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * User roles (for future expansion)
 */
exports.USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};
