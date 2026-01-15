const Expense = require('../models/Expense');

class SuggestionService {
  async getSuggestions(month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const stats = await Expense.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalExpenses = stats.reduce((sum, cat) => sum + cat.total, 0);
    const suggestions = [];

    // Budget recommendations for Indian college students (in INR)
    const idealBudget = {
      'Food & Snacks': { percentage: 30, max: 4000 },
      'Transport': { percentage: 15, max: 1500 },
      'Study Materials': { percentage: 10, max: 1000 },
      'Entertainment': { percentage: 10, max: 1000 },
      'Shopping': { percentage: 10, max: 1500 },
      'Recharge & Internet': { percentage: 8, max: 800 },
      'Hostel/Rent': { percentage: 0, max: 0 },
      'Medical': { percentage: 5, max: 500 },
      'Grooming': { percentage: 7, max: 700 },
      'Others': { percentage: 5, max: 500 }
    };

    // Category-specific suggestions
    stats.forEach(stat => {
      const category = stat._id;
      const spent = stat.total;
      const ideal = idealBudget[category];

      if (ideal && spent > ideal.max) {
        suggestions.push({
          category,
          type: 'warning',
          message: `You spent ₹${spent.toFixed(0)} on ${category}. Try to limit it to ₹${ideal.max} per month.`,
          savings: spent - ideal.max,
          priority: spent > ideal.max * 1.5 ? 'high' : 'medium'
        });
      }
    });

    // Specific tips based on spending
    const foodSpent = stats.find(s => s._id === 'Food & Snacks')?.total || 0;
    if (foodSpent > 4000) {
      suggestions.push({
        category: 'Food & Snacks',
        type: 'tip',
        message: '💡 Consider getting a monthly mess subscription or cook simple meals to save ₹1000-2000/month.',
        priority: 'high'
      });
    }

    const transportSpent = stats.find(s => s._id === 'Transport')?.total || 0;
    if (transportSpent > 1500) {
      suggestions.push({
        category: 'Transport',
        type: 'tip',
        message: '💡 Try using college bus, shared auto, or bicycle to save on transport. Potential savings: ₹500-800/month.',
        priority: 'medium'
      });
    }

    const entertainmentSpent = stats.find(s => s._id === 'Entertainment')?.total || 0;
    if (entertainmentSpent > 1000) {
      suggestions.push({
        category: 'Entertainment',
        type: 'tip',
        message: '💡 Use student discounts on OTT platforms, attend free college events, and split subscription costs with friends.',
        priority: 'low'
      });
    }

    const rechargeSpent = stats.find(s => s._id === 'Recharge & Internet')?.total || 0;
    if (rechargeSpent > 800) {
      suggestions.push({
        category: 'Recharge & Internet',
        type: 'tip',
        message: '💡 Switch to student plans from Jio/Airtel (₹200-300/month) and use college WiFi when possible.',
        priority: 'medium'
      });
    }

    // Overall budget check
    if (totalExpenses > 10000) {
      suggestions.push({
        category: 'Overall',
        type: 'alert',
        message: `⚠️ Your total spending is ₹${totalExpenses.toFixed(0)}. For a college student, aim for ₹7000-8000/month (excluding rent).`,
        priority: 'high'
      });
    }

    return {
      suggestions: suggestions.sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
      }),
      totalExpenses,
      recommendedBudget: 8000
    };
  }
}

module.exports = new SuggestionService();
