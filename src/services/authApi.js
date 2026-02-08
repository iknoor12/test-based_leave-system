const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const LOCAL_USERS_KEY = 'localAuthUsers';
const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || '';

const normalizeEmail = (email) => email?.trim().toLowerCase();

const loadLocalUsers = () => {
  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const createLocalToken = () =>
  `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const request = async (path, payload) => {
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
};

const isNetworkError = (error) => {
  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('network')
  );
};

const registerLocalUser = ({ name, email, password, role, passkey }) => {
  if (!name || !email || !password) {
    throw new Error('Missing required fields.');
  }

  if (role === 'admin' && (!passkey || passkey !== ADMIN_PASSKEY)) {
    throw new Error('Invalid admin passkey.');
  }

  const normalizedEmail = normalizeEmail(email);
  const users = loadLocalUsers();
  const existingUser = users.find((user) => user.email === normalizedEmail);
  if (existingUser) {
    throw new Error('Email is already registered.');
  }

  const newUser = {
    id: `local-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: role || 'student',
  };

  users.unshift(newUser);
  saveLocalUsers(users);

  return {
    token: createLocalToken(),
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  };
};

const loginLocalUser = ({ email, password, passkey, role }) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const normalizedEmail = normalizeEmail(email);
  const users = loadLocalUsers();
  const user = users.find((storedUser) => storedUser.email === normalizedEmail);
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials.');
  }

  if ((role === 'admin' || user.role === 'admin') && passkey !== ADMIN_PASSKEY) {
    throw new Error('Invalid admin passkey.');
  }

  return {
    token: createLocalToken(),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

export const loginUser = async (payload) => {
  try {
    return await request('/api/auth/login', payload);
  } catch (error) {
    if (isNetworkError(error)) {
      return loginLocalUser(payload);
    }
    throw error;
  }
};

export const registerUser = async (payload) => {
  try {
    return await request('/api/auth/register', payload);
  } catch (error) {
    if (isNetworkError(error)) {
      return registerLocalUser(payload);
    }
    throw error;
  }
};
