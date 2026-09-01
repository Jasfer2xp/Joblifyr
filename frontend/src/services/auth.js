import { apiRequest, getApiBaseUrl } from './api';

const TOKEN_ACCESS = 'joblifyr_access_token';
const TOKEN_REFRESH = 'joblifyr_refresh_token';
const USER_KEY = 'joblifyr_user';

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_ACCESS);
}

export function persistSession({ user, tokens }) {
  if (tokens?.access) localStorage.setItem(TOKEN_ACCESS, tokens.access);
  if (tokens?.refresh) localStorage.setItem(TOKEN_REFRESH, tokens.refresh);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_ACCESS);
  localStorage.removeItem(TOKEN_REFRESH);
  localStorage.removeItem(USER_KEY);
}

export function startGoogleLogin(returnTo = '/jobs') {
  const base = getApiBaseUrl();
  const returnPath = returnTo.startsWith('/') ? returnTo : `/${returnTo}`;
  window.location.href = `${base}/api/v1/auth/google/login/?return_to=${encodeURIComponent(returnPath)}`;
}

export async function registerUser(payload) {
  return apiRequest('/api/v1/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyRegistration(email, verification_code) {
  const data = await apiRequest('/api/v1/auth/verify-code/', {
    method: 'POST',
    body: JSON.stringify({ email, verification_code }),
  });
  if (data.tokens) {
    persistSession({ user: data.user, tokens: data.tokens });
  }
  return data;
}

export async function loginUser(email, password) {
  const data = await apiRequest('/api/v1/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.tokens) {
    persistSession({ user: data.user, tokens: data.tokens });
  }
  return data;
}

export async function fetchCurrentUser() {
  const data = await apiRequest('/api/v1/auth/me/');
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
  return data.user;
}

export async function logoutUser() {
  clearSession();
}

export function applyOAuthCallbackParams(searchParams) {
  const access = searchParams.get('access');
  const refresh = searchParams.get('refresh');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    return { success: false, error: errorDescription || error };
  }

  if (access && refresh) {
    localStorage.setItem(TOKEN_ACCESS, access);
    localStorage.setItem(TOKEN_REFRESH, refresh);
    return { success: true, returnTo: searchParams.get('return_to') || '/jobs' };
  }

  return { success: false, error: 'Missing authentication tokens.' };
}
