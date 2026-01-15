const PDFDocument = require('pdfkit');
const Expense = require('../models/Expense');

class PDFService {
  async generateMonthlyReport(month, year, res) {
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
  }
}

module.exports = new PDFService();
