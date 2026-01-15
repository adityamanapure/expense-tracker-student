import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ stats, expenses, onDownloadPDF, selectedMonth, selectedYear }) => {
  const categoryColors = {
    'Food & Snacks': '#FF6384',
    'Transport': '#36A2EB',
    'Study Materials': '#FFCE56',
    'Entertainment': '#4BC0C0',
    'Shopping': '#9966FF',
    'Recharge & Internet': '#FF9F40',
    'Hostel/Rent': '#FF6384',
    'Medical': '#C9CBCF',
    'Grooming': '#4BC0C0',
    'Others': '#FFCE56'
  };

  const pieData = {
    labels: stats.categoryStats?.map(s => s._id) || [],
    datasets: [{
      data: stats.categoryStats?.map(s => s.total) || [],
      backgroundColor: stats.categoryStats?.map(s => categoryColors[s._id]) || [],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const barData = {
    labels: stats.categoryStats?.map(s => s._id) || [],
    datasets: [{
      label: 'Amount Spent (₹)',
      data: stats.categoryStats?.map(s => s.total) || [],
      backgroundColor: stats.categoryStats?.map(s => categoryColors[s._id]) || [],
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Monthly Overview</h2>
        <button onClick={onDownloadPDF} className="btn-download">
          📄 Download PDF Report
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card total">
          <h3>Total Spent</h3>
          <p className="amount">₹{stats.totalAmount?.toFixed(2) || 0}</p>
        </div>
        <div className="stat-card count">
          <h3>Total Transactions</h3>
          <p className="amount">{expenses?.length || 0}</p>
        </div>
        <div className="stat-card average">
          <h3>Average Per Day</h3>
          <p className="amount">₹{(stats.totalAmount / new Date(selectedYear, selectedMonth, 0).getDate()).toFixed(2) || 0}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Category Distribution</h3>
          <div className="chart-wrapper">
            {stats.categoryStats?.length > 0 ? (
              <Pie data={pieData} />
            ) : (
              <p className="no-data">No expenses yet</p>
            )}
          </div>
        </div>

        <div className="chart-box">
          <h3>Spending by Category</h3>
          <div className="chart-wrapper bar-chart">
            {stats.categoryStats?.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <p className="no-data">No expenses yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="category-details">
        <h3>Category Breakdown</h3>
        <div className="category-list">
          {stats.categoryStats?.map(stat => {
            const percentage = ((stat.total / stats.totalAmount) * 100).toFixed(1);
            return (
              <div key={stat._id} className="category-item">
                <div className="category-info">
                  <span className="category-color" style={{ backgroundColor: categoryColors[stat._id] }}></span>
                  <span className="category-name">{stat._id}</span>
                </div>
                <div className="category-stats">
                  <span className="category-amount">₹{stat.total.toFixed(2)}</span>
                  <span className="category-percentage">{percentage}%</span>
                  <span className="category-count">{stat.count} transactions</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
