import api from './api.js';

class CommentService {
    // Lấy comment theo ID
    async getById(id) {
        const response = await api.get(`/comment/${id}`);
        return response.data;
    }

    // Thêm comment mới
    async add(comment) {
        const response = await api.post('/comment', comment);
        return response.data;
    }

    // Lấy tất cả comment
    async getAll() {
        const response = await api.get('/comment/all');
        return response.data;
    }

    // Cập nhật comment
    async update(id, comment) {
        const response = await api.put(`/comment/${id}/update`, comment);
        return response.data;
    }

    // Xóa comment
    async delete(id) {
        const response = await api.delete(`/comment/${id}/delete`);
        return response.data;
    }

    // Lấy comment theo postId
    async getByPost(postId) {
        const response = await api.get(`/comment/post/${postId}`);
        return response.data;
    }

    // Thêm reply cho comment
    async addReply(reply) {
        // reply cần có parentId là id của comment cha
        const response = await api.post('/comment', reply);
        return response.data;
    }

    // React to comment
    async reactToComment(commentId, reactionType, userId) {
        const response = await api.post(`/comments/${commentId}/reactions`, null, {
            params: {
                type: reactionType,
                userId: userId
            }
        });
        return response.data;
    }

    // Get reaction counts for a comment
    async getCommentReactionCounts(commentId) {
        const response = await api.get(`/comments/${commentId}/reactions/counts`);
        return response.data;
    }

    // Get user's reaction for a comment
    async getUserCommentReaction(commentId, userId) {
        const response = await api.get(`/comments/${commentId}/reactions/user/${userId}`);
        return response.data;
    }
}

export default new CommentService(); 