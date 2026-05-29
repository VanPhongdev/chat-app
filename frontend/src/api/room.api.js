import api from './axiosInstance';

export const roomApi = {
  getRooms: () => api.get('/rooms'),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  openDirectRoom: (friendId) => api.post('/rooms/direct', { friendId }),
  joinRoom: (id) => api.post(`/rooms/${id}/join`),
  leaveRoom: (id) => api.post(`/rooms/${id}/leave`),
};
