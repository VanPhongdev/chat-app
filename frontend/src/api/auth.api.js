import api from './axiosInstance';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: (token) => api.post('/auth/logout', { token }),
  refreshToken: (token) => api.post('/auth/refresh-token', { token }),
};
