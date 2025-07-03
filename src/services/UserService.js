import api from './api.js';

class UserService {
    async getUserById(id) {
        const response = await api.get(`/user/${id}`);
        console.log("API response:", response.data);
        return response.data;
    }

    async uploadAvatar(id, file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/user/${id}/upload/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
}
export default new UserService();