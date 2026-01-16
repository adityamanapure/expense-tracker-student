import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses';

// Get auth token from localStorage
const getAuthHeader = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return {};
  }
  
  const user = JSON.parse(userStr);
  
  if (!user?.token) {
    return {};
  }
  
  return { Authorization: `Bearer ${user.token}` };
};

export const expenseService = {
  // Get all expenses
  getExpenses: async (month, year, category) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    if (category) params.append('category', category);
    
    const response = await axios.get(`${API_URL}?${params.toString()}`, {
      headers: getAuthHeader()
    });
    return response.data.data || response.data;
  },

  // Get statistics
  getStats: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const response = await axios.get(`${API_URL}/stats?${params.toString()}`, {
      headers: getAuthHeader()
    });
    return response.data.data || response.data;
  },

  // Get suggestions
  getSuggestions: async (month, year) => {
    const params = new URLSearchParams();
    params.append('month', month);
    params.append('year', year);
    
    const response = await axios.get(`${API_URL}/suggestions?${params.toString()}`, {
      headers: getAuthHeader()
    });
    return response.data.data || response.data;
  },

  // Download PDF report
  downloadPDF: async (month, year) => {
    const params = new URLSearchParams();
    params.append('month', month);
    params.append('year', year);
    
    const response = await axios.get(`${API_URL}/report/pdf?${params.toString()}`, {
      responseType: 'blob',
      headers: getAuthHeader()
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expense-report-${month}-${year}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Create expense
  createExpense: async (expenseData) => {
    const response = await axios.post(API_URL, expenseData, {
      headers: getAuthHeader()
    });
    return response.data.data || response.data;
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    const response = await axios.put(`${API_URL}/${id}`, expenseData, {
      headers: getAuthHeader()
    });
    return response.data.data || response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data.data || response.data;
  }
};
