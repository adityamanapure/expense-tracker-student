const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const PDFDocument = require('pdfkit');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const { month, year, category } = req.query;
    let query = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get expense statistics
router.get('/stats', async (req, res) => {
  try {
    const { month, year } = req.query;
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

    res.json({
      categoryStats: stats,
      totalAmount: totalExpenses[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get spending suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { month, year } = req.query;
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
      'Hostel/Rent': { percentage: 0, max: 0 }, // Usually fixed
      'Medical': { percentage: 5, max: 500 },
      'Grooming': { percentage: 7, max: 700 },
      'Others': { percentage: 5, max: 500 }
    };

    stats.forEach(stat => {
      const category = stat._id;
      const spent = stat.total;
      const percentage = (spent / totalExpenses) * 100;
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

    // Specific suggestions for Indian college students
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

    // Overall suggestions
    if (totalExpenses > 10000) {
      suggestions.push({
        category: 'Overall',
        type: 'alert',
        message: `⚠️ Your total spending is ₹${totalExpenses.toFixed(0)}. For a college student, aim for ₹7000-8000/month (excluding rent).`,
        priority: 'high'
      });
    }

    res.json({
      suggestions: suggestions.sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
      }),
      totalExpenses,
      recommendedBudget: 8000
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate PDF report
router.get('/report/pdf', async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    const stats = await Expense.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const totalExpenses = stats.reduce((sum, cat) => sum + cat.total, 0);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=expense-report-${month}-${year}.pdf`);
    
    doc.pipe(res);

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('Expense Report', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text(`Month: ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });
    doc.moveDown();

    // Summary
    doc.fontSize(16).font('Helvetica-Bold').text('Summary');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`);
    doc.text(`Total Transactions: ${expenses.length}`);
    doc.moveDown();

    // Category-wise breakdown
    doc.fontSize(16).font('Helvetica-Bold').text('Category-wise Spending');
    doc.moveDown(0.5);
    
    stats.forEach(stat => {
      const percentage = ((stat.total / totalExpenses) * 100).toFixed(1);
      doc.fontSize(11).font('Helvetica');
      doc.text(`${stat._id}: ₹${stat.total.toFixed(2)} (${percentage}%) - ${stat.count} transactions`);
    });
    doc.moveDown();

    // Detailed transactions
    doc.fontSize(16).font('Helvetica-Bold').text('Detailed Transactions');
    doc.moveDown(0.5);
    
    expenses.forEach((expense, index) => {
      if (index > 0 && index % 10 === 0) {
        doc.addPage();
      }
      doc.fontSize(10).font('Helvetica');
      const date = new Date(expense.date).toLocaleDateString('en-IN');
      doc.text(`${date} - ${expense.category}: ₹${expense.amount.toFixed(2)} - ${expense.description}`);
    });

    // Suggestions
    doc.addPage();
    doc.fontSize(16).font('Helvetica-Bold').text('💡 Savings Suggestions for College Students');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    
    const suggestions = [
      '• Try to limit Food & Snacks to ₹3000-4000/month by using mess or cooking',
      '• Use college bus or shared transport to keep Transport under ₹1500/month',
      '• Take advantage of student discounts on subscriptions and entertainment',
      '• Use college WiFi and student mobile plans (₹200-300/month)',
      '• Buy second-hand textbooks or use library resources',
      '• Cook in groups with hostel mates to split costs',
      '• Set a daily spending limit (₹250-300) and stick to it',
      '• Avoid impulse purchases, wait 24 hours before buying non-essentials'
    ];

    suggestions.forEach(suggestion => {
      doc.text(suggestion);
      doc.moveDown(0.3);
    });

    doc.moveDown();
    doc.fontSize(11).font('Helvetica-Bold').text(`Recommended Monthly Budget: ₹7000-8000 (excluding rent)`, { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    Object.assign(expense, req.body);
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
