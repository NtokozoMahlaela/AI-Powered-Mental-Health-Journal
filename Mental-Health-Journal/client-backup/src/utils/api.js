const API_URL = 'http://localhost:5000/api';

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // If the status is 401 (Unauthorized), clear the token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }
  return data;
};

// Set up headers with auth token
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });
    localStorage.removeItem('token');
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Journal API
export const journalAPI = {
  // We'll implement these methods later
  getEntries: async () => {
    const response = await fetch(`${API_URL}/journal/entries`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  createEntry: async (entryData) => {
    const response = await fetch(`${API_URL}/journal/entries`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(entryData),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // Add more journal-related API calls as needed
};
