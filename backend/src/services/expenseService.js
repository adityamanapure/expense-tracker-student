const Expense = require('../models/Expense');

class ExpenseService {
  // Get expenses with filters
  async getExpenses(filters = {}) {
    const { month, year, category } = filters;
    let query = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (category) {
      query.category = category;
    }

    return await Expense.find(query).sort({ date: -1 });
  }

  // Get statistics
  async getStatistics(month, year) {
    let matchQuery = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      matchQuery.date = { $gte: startDate, $lte: endDate };
    }

    const stats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const totalExpenses = await Expense.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return {
      categoryStats: stats,
      totalAmount: totalExpenses[0]?.total || 0
    };
  }

  // Create expense
  async createExpense(expenseData) {
    const expense = new Expense(expenseData);
    return await expense.save();
  }

  // Update expense
  async updateExpense(id, expenseData) {
    const expense = await Expense.findById(id);
    if (!expense) {
      throw new Error('Expense not found');
    }

    Object.assign(expense, expenseData);
    return await expense.save();
  }

  // Delete expense
  async deleteExpense(id) {
    const expense = await Expense.findById(id);
    if (!expense) {
      throw new Error('Expense not found');
    }

    await expense.deleteOne();
    return { message: 'Expense deleted' };
  }
}

module.exports = new ExpenseService();
