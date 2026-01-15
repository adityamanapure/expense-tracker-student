const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// GET routes
router.get('/', expenseController.getAllExpenses);
router.get('/stats', expenseController.getStatistics);
router.get('/suggestions', expenseController.getSuggestions);
router.get('/report/pdf', expenseController.generatePDFReport);

// POST routes
router.post('/', expenseController.createExpense);

// PUT routes
router.put('/:id', expenseController.updateExpense);

// DELETE routes
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
