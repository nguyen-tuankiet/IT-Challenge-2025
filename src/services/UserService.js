import api from './api.js';

class UserService {
    async getUserById(id) {
        const response = await api.get(`/user/${id}`);
        console.log("API response:", response.data);
        return response.data;
    }

    
}
export default new UserService();