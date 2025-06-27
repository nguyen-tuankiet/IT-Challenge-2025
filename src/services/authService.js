import api from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      // Kiểm tra response theo cấu trúc API của bạn
      if (response.data.code === 200 && response.data.data) {
        const { token, user } = response.data.data;
        
        // Store token and userID only
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userID', user.id);
        
        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true, data: { token, user } };
      }
      
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleApiError(error);
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.code === 200) {
        return { success: true, data: response.data.data };
      }
      
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleApiError(error);
    }
  }

  // Send verification email
  async sendVerificationEmail(email) {
    try {
      const response = await api.post('/auth/verify-account', null, {
        params: { email }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Send verification error:', error);
      throw this.handleApiError(error);
    }
  }

  // Verify account
  async verifyAccount(token, id) {
    try {
      const response = await api.get('/auth/verify-account/confirmation', {
        params: { token, id }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Verify account error:', error);
      throw this.handleApiError(error);
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.get('/auth/refresh-token');
      
      if (response.data.code === 200 && response.data.data) {
        const newToken = response.data.data;
        localStorage.setItem('accessToken', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        return { success: true, token: newToken };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Refresh token error:', error);
      this.logout(); // Logout if refresh fails
      throw this.handleApiError(error);
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw this.handleApiError(error);
    }
  }

  // Get base URL for OAuth
  getBaseUrl() {
    return api.defaults.baseURL.replace('/feed-service/api', '');
  }

  // Logout user
  logout() {
    // Clear stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userID');
    
    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
    
    // Redirect to login page - chỉ redirect nếu không phải đang ở trang login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Get current user info by userID
  async getCurrentUserID() {
    const userID = localStorage.getItem('userID');
    if (!userID) return null;
    try {
      const response = await api.get(`/user/${userID}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Get current user info error:', error);
      return null;
    }
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAccessToken();
    const userID = this.getCurrentUserID();
    return !!(token && userID);
  }

  // Initialize auth (call this on app startup)
  initializeAuth() {
    const token = this.getAccessToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Handle API errors
  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          this.logout(); // Unauthorized - logout user
          return new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        case 403:
          return new Error('Bạn không có quyền thực hiện hành động này.');
        case 404:
          return new Error('Không tìm thấy tài nguyên yêu cầu.');
        case 409:
          return new Error(data.message || 'Xung đột dữ liệu.');
        case 422:
          return new Error(data.message || 'Dữ liệu không hợp lệ.');
        case 500:
          return new Error('Lỗi server. Vui lòng thử lại sau.');
        default:
          return new Error(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } else if (error.request) {
      // Network error
      return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
    } else {
      // Other error
      return new Error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  }
}

// Create single instance
const authService = new AuthService();

// Setup request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Setup response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await authService.refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Export the single instance
export default authService;