import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { 
  PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [date, setDate] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const paymentMethods = ['Cash', 'UPI', 'Card', 'Net Banking'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching from:', `${API_URL}/expenses`);
      
      const response = await axios.get(`${API_URL}/expenses`, {
        timeout: 30000
      });
      
      console.log('Raw Response:', response);
      console.log('Response Data:', response.data);
      
      // Handle different response formats
      let expensesData = [];
      if (Array.isArray(response.data)) {
        expensesData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        expensesData = response.data.data;
      } else if (response.data.expenses && Array.isArray(response.data.expenses)) {
        expensesData = response.data.expenses;
      }
      
      console.log('Processed Expenses:', expensesData);
      setExpenses(expensesData);
      
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      alert('Please fill all fields');
      return;
    }

    try {
      const newExpense = {
        amount: parseFloat(amount),
        category,
        description,
        paymentMethod,
        date: date || new Date().toISOString()
      };

      console.log('Adding expense:', newExpense);
      const response = await axios.post(`${API_URL}/expenses`, newExpense);
      console.log('Added expense response:', response.data);
      
      // Handle response format
      const addedExpense = response.data.data || response.data;
      setExpenses([...expenses, addedExpense]);
      
      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      setPaymentMethod('Cash');
      setDate('');
      
      alert('Expense added successfully! 💰');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert(error.response?.data?.message || 'Failed to add expense');
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
      alert('Expense deleted! 🗑️');
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/report/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expense-report-${new Date().toLocaleDateString()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF report');
    }
  };

  const getSuggestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/suggestions`);
      console.log('Suggestions response:', response.data);
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      alert('Failed to get suggestions');
    }
  };

  // Calculate statistics
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const categoryData = categories.map(cat => ({
    name: cat,
    value: expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0)
  })).filter(item => item.value > 0);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'];

  if (loading) {
    return (
      <div className="App" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '20px',
        flexDirection: 'column'
      }}>
        <div className="spinner" style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #4CAF50',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <div>Loading your expenses... 💰</div>
        <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          First load may take 20-30 seconds
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <div style={{
          background: '#ff4444',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2>⚠️ Connection Error</h2>
          <p>{error}</p>
          <p><strong>API URL:</strong> {API_URL}</p>
          <button 
            onClick={fetchExpenses}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'white',
              color: '#ff4444',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Try Again 🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1>💰 Student Expense Tracker</h1>
        <p className="tagline">Smart Money Management for Indian College Students</p>
      </header>

      <div className="container">
        {/* Add Expense Form */}
        <div className="card">
          <h2>📝 Add New Expense</h2>
          <form onSubmit={addExpense} className="expense-form">
            <div className="form-row">
              <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
                min="0"
                step="0.01"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="select"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
            <button type="submit" className="btn btn-primary">Add Expense</button>
          </form>
        </div>

        {/* Statistics */}
        <div className="card">
          <h2>📊 Monthly Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Spent</h3>
              <p className="stat-value">₹{totalSpent.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Transactions</h3>
              <p className="stat-value">{expenses.length}</p>
            </div>
            <div className="stat-card">
              <h3>Avg per Day</h3>
              <p className="stat-value">₹{(totalSpent / 30).toFixed(2)}</p>
            </div>
          </div>
          <div className="button-group">
            <button onClick={downloadPDF} className="btn btn-success">
              📄 Download PDF Report
            </button>
            <button onClick={getSuggestions} className="btn btn-info">
              💡 Get Smart Suggestions
            </button>
          </div>
        </div>

        {/* Charts */}
        {categoryData.length > 0 && (
          <div className="charts-container">
            <div className="card">
              <h2>🥧 Spending by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2>📊 Category Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && suggestions && (
          <div className="card suggestions-card">
            <h2>💡 Smart Spending Suggestions</h2>
            <button 
              onClick={() => setShowSuggestions(false)} 
              className="close-btn"
            >
              ✕
            </button>
            
            <div className="suggestion-section">
              <h3>📈 Overall Analysis</h3>
              <p><strong>Total Monthly Spending:</strong> ₹{suggestions.totalSpending?.toFixed(2)}</p>
              <p><strong>Status:</strong> {suggestions.overallStatus}</p>
              {suggestions.savingPotential > 0 && (
                <p className="highlight">💰 You can save up to ₹{suggestions.savingPotential.toFixed(2)} per month!</p>
              )}
            </div>

            {suggestions.categoryAdvice && suggestions.categoryAdvice.length > 0 && (
              <div className="suggestion-section">
                <h3>📋 Category-wise Advice</h3>
                {suggestions.categoryAdvice.map((advice, index) => (
                  <div key={index} className="advice-item">
                    <h4>{advice.category}</h4>
                    <p><strong>Spent:</strong> ₹{advice.spent.toFixed(2)} | <strong>Recommended:</strong> ₹{advice.recommended.toFixed(2)}</p>
                    <p className={advice.status === 'Over Budget' ? 'warning' : 'success'}>{advice.status}</p>
                    <p className="advice-text">{advice.advice}</p>
                  </div>
                ))}
              </div>
            )}

            {suggestions.generalTips && suggestions.generalTips.length > 0 && (
              <div className="suggestion-section">
                <h3>💡 Money-Saving Tips for Students</h3>
                <ul className="tips-list">
                  {suggestions.generalTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Expense List */}
        <div className="card">
          <h2>📜 Recent Transactions</h2>
          {expenses.length === 0 ? (
            <p className="no-expenses">No expenses yet. Start adding your expenses above! 🚀</p>
          ) : (
            <div className="expense-list">
              {expenses.map((expense) => (
                <div key={expense._id} className="expense-item">
                  <div className="expense-details">
                    <h3>{expense.description}</h3>
                    <p className="expense-meta">
                      {expense.category} • {expense.paymentMethod} • 
                      {new Date(expense.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="expense-amount">
                    <span className="amount">₹{expense.amount.toFixed(2)}</span>
                    <button 
                      onClick={() => deleteExpense(expense._id)} 
                      className="btn-delete"
                      title="Delete expense"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
