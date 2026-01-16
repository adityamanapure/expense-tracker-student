import React, { useState, useEffect } from 'react';
import './Suggestions.css';

const Suggestions = ({ suggestions, totalExpenses, recommendedBudget }) => {
  const [customBudget, setCustomBudget] = useState(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  useEffect(() => {
    // Load custom budget from localStorage
    const saved = localStorage.getItem('customMonthlyBudget');
    if (saved) {
      setCustomBudget(Number(saved));
    }
  }, []);

  const activeBudget = customBudget || recommendedBudget;

  const handleSetBudget = () => {
    const budget = Number(budgetInput);
    if (budget > 0) {
      setCustomBudget(budget);
      localStorage.setItem('customMonthlyBudget', budget);
      setIsEditingBudget(false);
      setBudgetInput('');
    }
  };

  const handleResetBudget = () => {
    setCustomBudget(null);
    localStorage.removeItem('customMonthlyBudget');
    setIsEditingBudget(false);
    setBudgetInput('');
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '💡';
    }
  };

  const getTypeEmoji = (type) => {
    switch(type) {
      case 'warning': return '⚠️';
      case 'tip': return '💡';
      case 'alert': return '🚨';
      default: return '📊';
    }
  };

  return (
    <div className="suggestions-container">
      <div className="suggestions-header">
        <h2>💰 Smart Spending Suggestions</h2>
        <p className="subtitle">Tailored for Indian College Students</p>
      </div>

      <div className="budget-overview">
        <div className="budget-stat">
          <span className="label">Your Total Spending</span>
          <span className="value current">₹{totalExpenses?.toFixed(2) || 0}</span>
        </div>
        <div className="budget-separator">vs</div>
        <div className="budget-stat">
          <span className="label">
            {customBudget ? 'Your Budget' : 'Recommended Budget'}
            {customBudget && <span className="custom-badge">Custom</span>}
          </span>
          <span className="value recommended">₹{activeBudget}</span>
        </div>
      </div>

      <div className="budget-controls">
        {!isEditingBudget ? (
          <div className="budget-actions">
            <button 
              className="btn-set-budget" 
              onClick={() => {
                setIsEditingBudget(true);
                setBudgetInput(customBudget || recommendedBudget);
              }}
            >
              {customBudget ? '✏️ Edit Budget' : '🎯 Set Custom Budget'}
            </button>
            {customBudget && (
              <button className="btn-reset-budget" onClick={handleResetBudget}>
                🔄 Reset to Default
              </button>
            )}
          </div>
        ) : (
          <div className="budget-editor">
            <input
              type="number"
              className="budget-input"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Enter monthly budget"
              min="1000"
              step="100"
            />
            <button className="btn-save-budget" onClick={handleSetBudget}>
              ✓ Save
            </button>
            <button className="btn-cancel-budget" onClick={() => setIsEditingBudget(false)}>
              ✕ Cancel
            </button>
          </div>
        )}
      </div>

      {totalExpenses > activeBudget && (
        <div className="alert-box">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <strong>Budget Exceeded!</strong>
            <p>You've spent ₹{(totalExpenses - activeBudget).toFixed(2)} more than your budget. Check the suggestions below to save money.</p>
          </div>
        </div>
      )}

      {totalExpenses <= activeBudget && totalExpenses > 0 && (
        <div className="success-box">
          <span className="success-icon">✓</span>
          <div className="success-content">
            <strong>Great Job!</strong>
            <p>You're within your budget! You have ₹{(activeBudget - totalExpenses).toFixed(2)} remaining this month.</p>
          </div>
        </div>
      )}

      {suggestions && suggestions.length > 0 ? (
        <div className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className={`suggestion-card priority-${suggestion.priority}`}
              style={{ borderLeft: `4px solid ${getPriorityColor(suggestion.priority)}` }}
            >
              <div className="suggestion-header">
                <span className="suggestion-icon">{getTypeEmoji(suggestion.type)}</span>
                <span className="suggestion-category">{suggestion.category}</span>
                <span 
                  className="suggestion-badge"
                  style={{ backgroundColor: getPriorityColor(suggestion.priority) }}
                >
                  {getPriorityIcon(suggestion.priority)} {suggestion.priority}
                </span>
              </div>
              <p className="suggestion-message">{suggestion.message}</p>
              {suggestion.savings && (
                <div className="suggestion-savings">
                  <span className="savings-label">Potential Savings:</span>
                  <span className="savings-amount">₹{suggestion.savings.toFixed(2)}/month</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-suggestions">
          <span className="emoji">🎉</span>
          <h3>Great Job!</h3>
          <p>Your spending looks good. Keep tracking your expenses!</p>
        </div>
      )}

      <div className="general-tips">
        <h3>💡 General Money-Saving Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">🍽️</span>
            <h4>Food</h4>
            <p>Use mess/tiffin services. Cook with friends to split costs.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🚌</span>
            <h4>Transport</h4>
            <p>Use college bus, cycle, or shared auto to save ₹500-800/month.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📚</span>
            <h4>Study</h4>
            <p>Buy second-hand books or use library. Share resources with classmates.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📱</span>
            <h4>Tech</h4>
            <p>Use student discounts on subscriptions. Share OTT accounts legally.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎮</span>
            <h4>Entertainment</h4>
            <p>Attend free college events. Look for student discounts.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">💳</span>
            <h4>Payments</h4>
            <p>Use UPI cashback offers. Track all digital payments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
