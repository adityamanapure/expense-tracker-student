import React from 'react';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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

  return (
    <div className="expense-list-container">
      <h2>Recent Transactions</h2>
      {expenses && expenses.length > 0 ? (
        <div className="expense-list">
          {expenses.map((expense) => (
            <div key={expense._id} className="expense-item">
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
              <button 
                className="btn-delete"
                onClick={() => onDelete(expense._id)}
                title="Delete expense"
              >
                🗑️
              </button>
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
