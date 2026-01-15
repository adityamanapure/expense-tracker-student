import axios from 'axios';

const API_URL = '/api/expenses';

export const expenseService = {
  // Get all expenses
  getExpenses: async (month, year, category) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    if (category) params.append('category', category);
    
    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
  },

  // Get statistics
  getStats: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const response = await axios.get(`${API_URL}/stats?${params.toString()}`);
    return response.data;
  },

  // Get suggestions
  getSuggestions: async (month, year) => {
    const params = new URLSearchParams();
    params.append('month', month);
    params.append('year', year);
    
    const response = await axios.get(`${API_URL}/suggestions?${params.toString()}`);
    return response.data;
  },

  // Download PDF report
  downloadPDF: async (month, year) => {
    const params = new URLSearchParams();
    params.append('month', month);
    params.append('year', year);
    
    const response = await axios.get(`${API_URL}/report/pdf?${params.toString()}`, {
      responseType: 'blob'
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
    const response = await axios.post(API_URL, expenseData);
    return response.data;
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    const response = await axios.put(`${API_URL}/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};
