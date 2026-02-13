const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const request = async (path, payload) => {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.message || 'Request failed';
      throw new Error(message);
    }

    return data;
  } catch (error) {
    // If it's a fetch error (network/connection issue), provide helpful message
    if (error instanceof TypeError || error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running on ' + API_BASE);
    }
    throw error;
  }
};

export const loginUser = async (payload) => {
  return await request('/api/auth/login', payload);
};

export const registerUser = async (payload) => {
  return await request('/api/auth/register', payload);
};
