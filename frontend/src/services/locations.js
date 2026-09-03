import { apiRequest } from './api';

export function fetchCountries(signal) {
  return apiRequest('/api/v1/auth/countries/', { signal });
}

export function fetchCities(country, signal) {
  return apiRequest(`/api/v1/auth/cities/?country=${encodeURIComponent(country)}`, { signal });
}