const expenseService = require('../services/expenseService');
const suggestionService = require('../services/suggestionService');
const pdfService = require('../services/pdfService');

class ExpenseController {
  // Get all expenses
  async getAllExpenses(req, res) {
    try {
      const { month, year, category } = req.query;
      const expenses = await expenseService.getExpenses({ month, year, category });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get expense statistics
  async getStatistics(req, res) {
    try {
      const { month, year } = req.query;
      const stats = await expenseService.getStatistics(month, year);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get spending suggestions
  async getSuggestions(req, res) {
    try {
      const { month, year } = req.query;
      const suggestions = await suggestionService.getSuggestions(month, year);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Generate PDF report
  async generatePDFReport(req, res) {
    try {
      const { month, year } = req.query;
      await pdfService.generateMonthlyReport(month, year, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create new expense
  async createExpense(req, res) {
    try {
      const newExpense = await expenseService.createExpense(req.body);
      res.status(201).json(newExpense);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update expense
  async updateExpense(req, res) {
    try {
      const updatedExpense = await expenseService.updateExpense(req.params.id, req.body);
      res.json(updatedExpense);
    } catch (error) {
      if (error.message === 'Expense not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }

  // Delete expense
  async deleteExpense(req, res) {
    try {
      const result = await expenseService.deleteExpense(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Expense not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ExpenseController();
