const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function getApiBaseUrl() {
  if (API_BASE) return API_BASE;
  if (import.meta.env.DEV) return '';
  return '';
}

export async function apiRequest(path, options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = localStorage.getItem('joblifyr_access_token');
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.error || data.detail)) ||
      (typeof data === 'string' ? data : 'Request failed');
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
