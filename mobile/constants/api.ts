// API Configuration
export const API_URL = __DEV__
  ? 'http://localhost:3001/api'  // Development
  : 'https://api.booksygo.com/api'; // Production

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_URL}/auth/register`,
    LOGIN: `${API_URL}/auth/login`,
    PROFILE: `${API_URL}/auth/profile`,
    LOGOUT: `${API_URL}/auth/logout`,
  },
  FLIGHTS: {
    SEARCH: `${API_URL}/flights/search`,
  },
  HOTELS: {
    SEARCH: `${API_URL}/hotels/search`,
  },
};

