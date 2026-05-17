// auth.js
import { api } from './api.js';

export const auth = {
  // Check if user is logged in
  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  },

  // Get stored user data
  getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  // Login
  async login(email, password) {
    const data = await api.login(email, password);

    // Store token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  // Register
  async register(userData) {
    return api.register(userData);
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};