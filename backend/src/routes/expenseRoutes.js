// src/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const {
  createExpenseValidator,
  updateExpenseValidator,
  deleteExpenseValidator,
  getExpensesValidator,
  getStatsValidator
} = require('../validators/expenseValidators');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses for authenticated user
 * @access  Private
 */
router.get('/', getExpensesValidator, validate, expenseController.getAllExpenses);

/**
 * @route   GET /api/expenses/stats
 * @desc    Get expense statistics
 * @access  Private
 */
router.get('/stats', getStatsValidator, validate, expenseController.getStatistics);

/**
 * @route   GET /api/expenses/suggestions
 * @desc    Get spending suggestions
 * @access  Private
 */
router.get('/suggestions', getStatsValidator, validate, expenseController.getSuggestions);

/**
 * @route   GET /api/expenses/report/pdf
 * @desc    Generate PDF report
 * @access  Private
 */
router.get('/report/pdf', getStatsValidator, validate, expenseController.generatePDFReport);

/**
 * @route   POST /api/expenses
 * @desc    Create new expense
 * @access  Private
 */
router.post('/', createExpenseValidator, validate, expenseController.createExpense);

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update expense
 * @access  Private
 */
router.put('/:id', updateExpenseValidator, validate, expenseController.updateExpense);

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense
 * @access  Private
 */
router.delete('/:id', deleteExpenseValidator, validate, expenseController.deleteExpense);

module.exports = router;
