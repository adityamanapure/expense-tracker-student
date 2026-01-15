import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import Suggestions from './components/Suggestions';
import { expenseService } from './services/expenseService';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesData, statsData, suggestionsData] = await Promise.all([
        expenseService.getExpenses(selectedMonth, selectedYear),
        expenseService.getStats(selectedMonth, selectedYear),
        expenseService.getSuggestions(selectedMonth, selectedYear)
      ]);

      setExpenses(expensesData);
      setStats(statsData);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Make sure the backend server is running.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleExpenseAdded = async (expenseData) => {
    try {
      await expenseService.createExpense(expenseData);
      fetchData();
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const handleExpenseDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await expenseService.downloadPDF(selectedMonth, selectedYear);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF report');
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>💰 Student Expense Tracker</h1>
            <p>Smart money management for Indian college students</p>
          </div>
          <div className="month-selector">
            <label>Select Month:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="app-main">
        {loading && <div className="loading-overlay">Loading...</div>}
        
        <ExpenseForm onExpenseAdded={handleExpenseAdded} />
        
        <Dashboard 
          stats={stats}
          expenses={expenses}
          onDownloadPDF={handleDownloadPDF}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />

        <Suggestions 
          suggestions={suggestions.suggestions}
          totalExpenses={suggestions.totalExpenses}
          recommendedBudget={suggestions.recommendedBudget}
        />

        <ExpenseList 
          expenses={expenses}
          onDelete={handleExpenseDelete}
        />
      </main>

      <footer className="app-footer">
        <p>Made with ❤️ for Indian College Students</p>
        <p className="footer-tip">💡 Tip: Track daily, save monthly, succeed financially!</p>
      </footer>
    </div>
  );
}

export default App;
