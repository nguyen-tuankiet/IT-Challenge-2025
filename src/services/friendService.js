import api from './api';

class FriendService {
    // Get all friends with mutual info
    async getFriendsWithMutualInfo(userId) {
        try {
            const response = await api.get(`/user/${userId}/friends`);
            return response.data;
        } catch (error) {
            console.error('Error fetching friends:', error);
            throw error;
        }
    }

    // Get pending friend invites
    async getPendingInvites(userId) {
        try {
            const response = await api.get(`/user/${userId}/invite/pending`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pending invites:', error);
            throw error;
        }
    }

    // Get mutual friends between two users
    async getMutualFriends(userId1, userId2) {
        try {
            const response = await api.get(`/user/${userId1}/mutual-friends/${userId2}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching mutual friends:', error);
            throw error;
        }
    }

    // Add friend
    async addFriend(user1, user2) {
        try {
            const response = await api.post('/friend/add', null, {
                params: { user1, user2 }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding friend:', error);
            throw error;
        }
    }

    // Delete friend
    async deleteFriend(user1, user2) {
        try {
            const response = await api.delete('/friend/delete', {
                params: { user1, user2 }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting friend:', error);
            throw error;
        }
    }


    // Accept friend invite
    async acceptInvite(userId, inviteId) {
        try {
            const response = await api.post(`/user/${userId}/invite/${inviteId}/accept`);
            return response.data;
        } catch (error) {
            console.error('Error accepting invite:', error);
            throw error;
        }
    }

    // Decline friend invite
    async declineInvite(userId, inviteId) {
        try {
            const response = await api.post(`/user/${userId}/invite/${inviteId}/decline`);
            return response.data;
        } catch (error) {
            console.error('Error declining invite:', error);
            throw error;
        }
    }

}

// Export singleton instance
const friendService = new FriendService();
export default friendService;