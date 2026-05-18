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
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password }),
    }),

  // Menu Items
  getMenuItems: (query='') =>
    fetchJSON(`${API_URL}/menu${query}`, {
      headers: authHeaders(),
    }),
  
  getMenuItemByName: itemName =>
    fetchJSON(`${API_URL}/menu/${itemName}`, {
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
  getUsers: (query = '') =>
    fetchJSON(`${API_URL}/user${query}`, {
      headers: authHeaders(),
    }),

  getCustomers: () =>
    fetchJSON(`${API_URL}/user?type=customer`, {
      headers: authHeaders(),
    }),

  getStaff: () =>
    fetchJSON(`${API_URL}/user?type=staff`, {
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
  createOrder: orderData =>
    fetchJSON(`${API_URL}/orders`, {
    method: 'POST', 
    headers: {'Content-Type': 'application/json', ...authHeaders()},
    body: JSON.stringify(orderData),
  }),
  getOrders: (query = '') => 
    fetchJSON(`${API_URL}/orders${query}`, {
      headers: authHeaders(),
    }),
  
  getOrder: id =>
  fetchJSON(`${API_URL}/orders/${id}`, {
    headers: authHeaders(),
  }),
  updateOrder: (id, updates) =>
    fetchJSON(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updates),
  }),
  deleteOrder: id =>
    fetchJSON(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
  }),
};