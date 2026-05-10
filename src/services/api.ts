const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json();

  if (response.status === 401 && !path.includes('/auth/')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getMe: () => request<{ user: any }>('/auth/me'),
  },
  trips: {
    getAll: () => request<any[]>('/trips'),
    create: (tripData: any) => request('/trips', { method: 'POST', body: JSON.stringify(tripData) }),
  }
};
