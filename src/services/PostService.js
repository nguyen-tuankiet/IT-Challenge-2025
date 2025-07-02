import api from './api.js';

class PostService {
    // Create a new post
    async createPost(postData) {
        try {
            const response = await api.post('/post', postData);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    // Get feed with pagination
    async getFeed(page = 0, size = 10, orderBy = 'createdAt', direction = 'DESC', userId = null) {
        try {
            const params = {
                page,
                size,
                orderBy,
                direction
            };
            
            if (userId) {
                params.userId = userId;
            }

            const response = await api.get('/post/feed', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching feed:', error);
            throw error;
        }
    }

    // Get specific post by ID
    async getPostById(id, userId = null) {
        try {
            const params = {};
            if (userId) {
                params.userId = userId;
            }

            const response = await api.get(`/post/${id}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    }

    // Update post
    async updatePost(id, postData) {
        try {
            const response = await api.put(`/post/${id}`, postData);
            return response.data;
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    }

    // Delete post
    async deletePost(id) {
        try {
            const response = await api.delete(`/post/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }

    // React to post
    async reactToPost(postId, reactionType, userId) {
        try {
            const response = await api.post(`/posts/${postId}/reactions`, null, {
                params: {
                    type: reactionType,
                    userId: userId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error reacting to post:', error);
            throw error;
        }
    }

    async getPostByOwner(postId, reactionType) {
        try {
            const response = await api.post(`/post/${postId}/reaction`, {
                reactionType
            });
            return response.data;
        } catch (error) {
            console.error('Error reacting to post:', error);
            throw error;
        }
    }

}

export default new PostService();