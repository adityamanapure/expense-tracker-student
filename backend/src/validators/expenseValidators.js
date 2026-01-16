// src/validators/expenseValidators.js
const { body, query, param } = require('express-validator');

const categories = [
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

const paymentModes = ['Cash', 'UPI', 'Card', 'Net Banking'];

exports.createExpenseValidator = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Description must be between 3 and 200 characters'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(categories)
    .withMessage('Invalid category'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('paymentMode')
    .optional()
    .isIn(paymentModes)
    .withMessage('Invalid payment mode'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
];

exports.updateExpenseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Description must be between 3 and 200 characters'),
  
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  
  body('category')
    .optional()
    .isIn(categories)
    .withMessage('Invalid category'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('paymentMode')
    .optional()
    .isIn(paymentModes)
    .withMessage('Invalid payment mode'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
];

exports.deleteExpenseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID'),
];

exports.getExpensesValidator = [
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100'),
  
  query('category')
    .optional()
    .isIn(categories)
    .withMessage('Invalid category'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

exports.getStatsValidator = [
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100'),
];
