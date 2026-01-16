import React, { useState } from 'react';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateForInput = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: formatDateForInput(expense.date),
      paymentMode: expense.paymentMode,
      notes: expense.notes || ''
    });
  };

  const handleSave = async (id) => {
    await onUpdate(id, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Food & Snacks': '🍽️',
      'Transport': '🚗',
      'Study Materials': '📚',
      'Entertainment': '🎮',
      'Shopping': '🛍️',
      'Recharge & Internet': '📱',
      'Hostel/Rent': '🏠',
      'Medical': '💊',
      'Grooming': '💇',
      'Others': '📦'
    };
    return emojis[category] || '📦';
  };

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

  return (
    <div className="expense-list-container">
      <h2>Recent Transactions</h2>
      {expenses && expenses.length > 0 ? (
        <div className="expense-list">
          {expenses.map((expense) => (
            <div key={expense._id} className="expense-item">
              {editingId === expense._id ? (
                // Edit mode
                <div className="expense-edit-form">
                  <div className="edit-row">
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleChange}
                      placeholder="Description"
                      className="edit-input"
                    />
                    <input
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleChange}
                      placeholder="Amount"
                      className="edit-input small"
                      step="0.01"
                    />
                  </div>
                  <div className="edit-row">
                    <select
                      name="category"
                      value={editData.category}
                      onChange={handleChange}
                      className="edit-input"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleChange}
                      className="edit-input small"
                    />
                  </div>
                  <div className="edit-row">
                    <select
                      name="paymentMode"
                      value={editData.paymentMode}
                      onChange={handleChange}
                      className="edit-input small"
                    >
                      {paymentModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="notes"
                      value={editData.notes}
                      onChange={handleChange}
                      placeholder="Notes (optional)"
                      className="edit-input"
                    />
                  </div>
                  <div className="edit-actions">
                    <button onClick={() => handleSave(expense._id)} className="btn-save">
                      ✓ Save
                    </button>
                    <button onClick={handleCancel} className="btn-cancel">
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div className="expense-icon">
                    {getCategoryEmoji(expense.category)}
                  </div>
                  <div className="expense-details">
                    <div className="expense-main">
                      <span className="expense-description">{expense.description}</span>
                      <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
                    </div>
                    <div className="expense-meta">
                      <span className="expense-category">{expense.category}</span>
                      <span className="expense-separator">•</span>
                      <span className="expense-date">{formatDate(expense.date)}</span>
                      <span className="expense-separator">•</span>
                      <span className="expense-payment">{expense.paymentMode}</span>
                    </div>
                    {expense.notes && (
                      <div className="expense-notes">
                        <small>{expense.notes}</small>
                      </div>
                    )}
                  </div>
                  <div className="expense-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(expense)}
                      title="Edit expense"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => onDelete(expense._id)}
                      title="Delete expense"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-expenses">
          <span className="empty-icon">📊</span>
          <p>No expenses recorded yet.</p>
          <p className="empty-subtitle">Start adding your expenses above!</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
