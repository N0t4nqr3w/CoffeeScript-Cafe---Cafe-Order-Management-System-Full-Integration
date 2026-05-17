const API_URL = 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

const fetchJSON = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = response.status !== 204 ? await response.json() : null;

  if (!response.ok) {

    if (Array.isArray(data?.errors)) {
      throw new Error(data.errors.join(' '));
    }

    throw new Error(data?.error || 'Request failed');

  }

  return data;
};

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});


export const api = {
  // Authentication
  register: userData =>
    fetchJSON(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }),

  login: (email, password) =>
    fetchJSON(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  // Menu Items
  getMenuItems: () =>
    fetchJSON(`${API_URL}/menu`, {
      headers: authHeaders(),
    }),

  createMenuItem: itemData =>
    fetchJSON(`${API_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(itemData),
    }),

  updateMenuItem: (id, updates) =>
    fetchJSON(`${API_URL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(updates),
    }),

  deleteMenuItem: id =>
    fetchJSON(`${API_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }),

    // Users
  getUsers: () =>
    fetchJSON(`${API_URL}/user`, {
      headers: authHeaders(),
    }),

  getCustomers: () =>
    fetch(`${API_URL}/user?type=customer`, {
      headers: authHeaders(),
    }),

  getStaff: () =>
    fetch(`${API_URL}/user?type=staff`, {
      headers: authHeaders(),
    }),

  updateUser: (id, updates) =>
    fetchJSON(`${API_URL}/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(updates),
    }),

  deleteUser: id =>
    fetchJSON(`${API_URL}/user/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }),

  // Orders
  createOrder: id => fetchJSON(`${API_URL}/orders`, {
    method: 'POST', 
    headers: {'Content-Type': 'application/json', ...authHeaders()},
  })
};
