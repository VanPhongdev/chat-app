import api from './axiosInstance';

export const messageApi = {
  getMessages: (roomId, params = {}) =>
    api.get(`/messages/${roomId}`, { params }),
  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file); // must match upload.single('image') in backend
    return api.post('/messages/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
