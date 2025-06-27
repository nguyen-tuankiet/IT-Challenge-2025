import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegNewspaper, FaUserFriends, FaChalkboardTeacher, FaBriefcase, FaGamepad, FaMobileAlt } from 'react-icons/fa';
import authService from '../../services/authService'; // Import auth service

const BlueTechLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if we're on login or register page based on URL
  const isLogin = location.pathname === '/login';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userName: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize auth service on component mount
  useEffect(() => {
    authService.initializeAuth();
    
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      window.location.href = '/dashboard';
    }
  }, []);

  // Clear form when switching between login/register
  useEffect(() => {
    setFormData({
      email: '',
      password: '',
      userName: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  }, [location.pathname]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const { email, password, userName, confirmPassword } = formData;
    
    if (!email || !password) {
      setError('Email và mật khẩu là bắt buộc');
      return false;
    }
    
    if (!isLogin) {
      if (!userName) {
        setError('Tên người dùng là bắt buộc');
        return false;
      }
      if (!confirmPassword) {
        setError('Xác nhận mật khẩu là bắt buộc');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return false;
      }
      if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (isLogin) {
        // Đăng nhập
        const result = await authService.login(formData.email, formData.password);
        if (result.success) {
          setSuccess('Đăng nhập thành công!');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }
      } else {
        // Đăng ký
        const result = await authService.register({
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        if (result.success) {
          setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
          await authService.sendVerificationEmail(formData.email);
          setFormData({
            email: '',
            password: '',
            userName: '',
            confirmPassword: ''
          });
          setTimeout(() => {
            navigate('/login');
            setSuccess('');
          }, 3000);
        }
      }
    } catch (error) {
      setError(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${authService.getBaseUrl()}/oauth2/authorization/google`;
    } catch {
      setError('Đăng nhập Google thất bại');
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      window.location.href = `${authService.getBaseUrl()}/oauth2/authorization/microsoft`;
    } catch {
      setError('Đăng nhập Microsoft thất bại');
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Vui lòng nhập email để đặt lại mật khẩu');
      return;
    }
    try {
      setLoading(true);
      await authService.forgotPassword(formData.email);
      setSuccess('Email đặt lại mật khẩu đã được gửi!');
    } catch {
      setError('Gửi email thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle between login and register
  const toggleAuthMode = () => {
    if (isLogin) {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-8">
            <span className="text-3xl font-bold text-blue-600 tracking-tight">BlueTech</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAuthMode}
              className="px-5 py-2 border border-blue-600 text-blue-600 rounded-full font-medium bg-white hover:bg-blue-50 transition-colors"
              disabled={loading}
            >
              {isLogin ? 'Tham gia ngay' : 'Đăng nhập'}
            </button>
            <button
              className="px-5 py-2 border border-blue-600 text-white bg-blue-600 rounded-full font-medium hover:bg-blue-700 hover:text-white transition-colors"
              disabled={loading}
            >
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-4 py-12">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center">
          <div className="w-full max-w-xl">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight text-center">
              {isLogin ? 'Chào mừng trở lại' : 'Chào mừng đến với cộng đồng chuyên gia của bạn'}
            </h2>
            
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}
            
            <div className="flex flex-col space-y-4 mt-8">
              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-400 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Tiếp tục sử dụng dịch vụ bằng Google
              </button>
              
              {/* Microsoft Login Button */}
              <button
                onClick={handleMicrosoftLogin}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-400 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                  <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                Tiếp tục với Microsoft
              </button>
              
              {/* Divider */}
              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-gray-500 text-sm">hoặc</span>
                <div className="flex-grow border-t border-gray-300" />
              </div>
              
              {/* Email Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <input
                    type="text"
                    name="userName"
                    placeholder="Tên người dùng"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required={!isLogin}
                    disabled={loading}
                  />
                )}
                
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                  disabled={loading}
                />
                
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                  disabled={loading}
                />
                
                {!isLogin && (
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required={!isLogin}
                    disabled={loading}
                  />
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-blue-600 text-blue-600 bg-white py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    <>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</>
                  )}
                </button>
              </form>
              
              {isLogin && (
                <div className="text-center">
                  <button
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:underline text-sm font-medium"
                    disabled={loading}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}
              
              <div className="text-center text-sm text-gray-600">
                {isLogin ? (
                  <p>
                    Bạn mới sử dụng BlueTech?{' '}
                    <button
                      onClick={toggleAuthMode}
                      className="text-blue-600 hover:underline font-semibold"
                      disabled={loading}
                    >
                      Tham gia ngay
                    </button>
                  </p>
                ) : (
                  <p>
                    Đã có tài khoản?{' '}
                    <button
                      onClick={toggleAuthMode}
                      className="text-blue-600 hover:underline font-semibold"
                      disabled={loading}
                    >
                      Đăng nhập
                    </button>
                  </p>
                )}
              </div>
              
              {!isLogin && (
                <div className="text-xs text-gray-500 text-center mt-2">
                  Khi nhấp vào Tiếp tục để tham gia hoặc đăng nhập, bạn đồng ý với{' '}
                  <a href="#" className="text-blue-600 hover:underline">Thỏa thuận người dùng</a>,{' '}
                  <a href="#" className="text-blue-600 hover:underline">Chính sách quyền riêng tư</a> và{' '}
                  <a href="#" className="text-blue-600 hover:underline">Chính sách cookie</a> của BlueTech.
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Illustration Section */}
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center">
          <img
            src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"
            alt="BlueTech Illustration"
            className="w-full max-w-xl h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default BlueTechLogin;