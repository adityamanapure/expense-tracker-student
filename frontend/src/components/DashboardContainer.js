import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Dashboard from './Dashboard';
import Suggestions from './Suggestions';
import './Dashboard.css';

const DashboardContainer = () => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ categoryStats: [], totalAmount: 0 });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, expenses, suggestions

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesData, statsData] = await Promise.all([
        expenseService.getExpenses(selectedMonth, selectedYear),
        expenseService.getStats(selectedMonth, selectedYear)
      ]);
      
      setExpenses(expensesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const data = await expenseService.getSuggestions(selectedMonth, selectedYear);
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      console.log('Submitting expense data:', expenseData);
      const result = await expenseService.createExpense(expenseData);
      console.log('Expense created:', result);
      await fetchData();
    } catch (error) {
      console.error('Error adding expense:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      await expenseService.updateExpense(id, expenseData);
      await fetchData();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await expenseService.downloadPDF(selectedMonth, selectedYear);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-controls">
        <div className="month-selector">
          <label>Month:</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          
          <label>Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <div className="tab-buttons">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={activeTab === 'expenses' ? 'active' : ''} 
            onClick={() => setActiveTab('expenses')}
          >
            💰 Expenses
          </button>
          <button 
            className={activeTab === 'suggestions' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('suggestions');
              if (!suggestions) fetchSuggestions();
            }}
          >
            💡 Suggestions
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            expenses={expenses}
            onDownloadPDF={handleDownloadPDF}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        )}

        {activeTab === 'expenses' && (
          <div>
            <ExpenseForm onExpenseAdded={handleAddExpense} />
            <ExpenseList
              expenses={expenses}
              onDelete={handleDeleteExpense}
              onUpdate={handleUpdateExpense}
            />
          </div>
        )}

        {activeTab === 'suggestions' && (
          <Suggestions
            suggestions={suggestions?.suggestions || []}
            totalExpenses={suggestions?.totalExpenses || 0}
            recommendedBudget={suggestions?.recommendedBudget || 8000}
            loading={!suggestions}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardContainer;
