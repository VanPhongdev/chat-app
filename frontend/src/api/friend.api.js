import api from './axiosInstance';

export const friendApi = {
  search: (query) => api.get(`/friends/search?q=${encodeURIComponent(query)}`),
  sendRequest: (receiverId) => api.post('/friends/request', { receiverId }),
  getReceivedRequests: () => api.get('/friends/requests'),
  acceptRequest: (requestId) => api.put(`/friends/requests/${requestId}/accept`),
  rejectRequest: (requestId) => api.put(`/friends/requests/${requestId}/reject`),
  getOnlineFriends: () => api.get('/friends/online'),
  getAllFriends: () => api.get('/friends/list'),
};
