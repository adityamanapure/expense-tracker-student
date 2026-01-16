import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/auth` 
  : 'http://localhost:5000/api/auth';

// Register user
const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  
  // Extract user data from the new API response format
  const user = response.data.data || response.data;
  
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  return user;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  
  // Extract user data from the new API response format
  const user = response.data.data || response.data;
  
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  return user;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser
};

export default authService;
