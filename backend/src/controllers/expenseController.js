const expenseService = require('../services/expenseService');
const suggestionService = require('../services/suggestionService');
const pdfService = require('../services/pdfService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

class ExpenseController {
  // Get all expenses
  getAllExpenses = asyncHandler(async (req, res) => {
    const { month, year, category } = req.query;
    const expenses = await expenseService.getExpenses({ month, year, category, userId: req.user.id });
    
    res.status(200).json(
      new ApiResponse(200, expenses, 'Expenses retrieved successfully')
    );
  });

  // Get expense statistics
  getStatistics = asyncHandler(async (req, res) => {
    const { month, year } = req.query;
    const stats = await expenseService.getStatistics(month, year, req.user.id);
    
    res.status(200).json(
      new ApiResponse(200, stats, 'Statistics retrieved successfully')
    );
  });

  // Get spending suggestions
  getSuggestions = asyncHandler(async (req, res) => {
    const { month, year } = req.query;
    const suggestions = await suggestionService.getSuggestions(month, year, req.user.id);
    
    res.status(200).json(
      new ApiResponse(200, suggestions, 'Suggestions retrieved successfully')
    );
  });

  // Generate PDF report
  generatePDFReport = asyncHandler(async (req, res) => {
    const { month, year } = req.query;
    await pdfService.generateMonthlyReport(month, year, req.user.id, res);
  });

  // Create new expense
  createExpense = asyncHandler(async (req, res) => {
    const newExpense = await expenseService.createExpense({ ...req.body, user: req.user.id });
    
    res.status(201).json(
      new ApiResponse(201, newExpense, 'Expense created successfully')
    );
  });

  // Update expense
  updateExpense = asyncHandler(async (req, res) => {
    const updatedExpense = await expenseService.updateExpense(req.params.id, req.body, req.user.id);
    
    if (!updatedExpense) {
      throw new ApiError(404, 'Expense not found');
    }
    
    res.status(200).json(
      new ApiResponse(200, updatedExpense, 'Expense updated successfully')
    );
  });

  // Delete expense
  deleteExpense = asyncHandler(async (req, res) => {
    const result = await expenseService.deleteExpense(req.params.id, req.user.id);
    
    if (!result) {
      throw new ApiError(404, 'Expense not found');
    }
    
    res.status(200).json(
      new ApiResponse(200, result, 'Expense deleted successfully')
    );
  });
}

module.exports = new ExpenseController();
