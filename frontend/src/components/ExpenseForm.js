import React, { useState } from 'react';
import './ExpenseForm.css';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food & Snacks',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI',
    notes: ''
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await onExpenseAdded(formData);
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: 'Food & Snacks',
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'UPI',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  return (
    <div className="expense-form-container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Lunch at canteen"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Payment Mode *</label>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              required
            >
              {paymentModes.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Notes (Optional)</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional details"
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
