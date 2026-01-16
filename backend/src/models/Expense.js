const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
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
    ]
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Card', 'Net Banking'],
    default: 'UPI'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ user: 1 }); // Add index for user queries

module.exports = mongoose.model('Expense', expenseSchema);
