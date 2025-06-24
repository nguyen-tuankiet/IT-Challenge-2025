import React, { useState } from 'react';
import { FaRegNewspaper, FaUserFriends, FaChalkboardTeacher, FaBriefcase, FaGamepad, FaMobileAlt } from 'react-icons/fa';

const BlueTechLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleMicrosoftLogin = () => {
    console.log('Microsoft login clicked');
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
              onClick={() => setIsLogin(!isLogin)}
              className="px-5 py-2 border border-blue-600 text-blue-600 rounded-full font-medium bg-white hover:bg-blue-50 transition-colors"
            >
              {isLogin ? 'Tham gia ngay' : 'Đăng nhập'}
            </button>
            <button
              className="px-5 py-2 border border-blue-600 text-white bg-blue-600 rounded-full font-medium hover:bg-blue-700 hover:text-white transition-colors"
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
            <div className="flex flex-col space-y-4 mt-8">
              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-400 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium"
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
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-400 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium"
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
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Tên"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Họ"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full border border-blue-600 text-blue-600 bg-white py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors text-base"
                >
                  {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                </button>
              </form>
              {isLogin && (
                <div className="text-center">
                  <a href="#" className="text-blue-600 hover:underline text-sm font-medium">
                    Quên mật khẩu?
                  </a>
                </div>
              )}
              <div className="text-center text-sm text-gray-600">
                {isLogin ? (
                  <p>
                    Bạn mới sử dụng BlueTech?{' '}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Tham gia ngay
                    </button>
                  </p>
                ) : (
                  <p>
                    Đã có tài khoản?{' '}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-blue-600 hover:underline font-semibold"
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
