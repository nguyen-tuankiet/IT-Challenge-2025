import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFacebook } from 'react-icons/fa';
import { FiSearch, FiVideo, FiUsers, FiPlusCircle, FiBell, FiSettings, FiHelpCircle, FiMoon, FiLogOut, FiChevronRight, FiChevronDown, FiArrowLeft } from 'react-icons/fi';
import { BsMessenger, BsPeople } from 'react-icons/bs';
import { HiOutlineHome } from 'react-icons/hi';
import { CgMenuGridR } from 'react-icons/cg';
import { MdFeedback, MdKeyboard } from 'react-icons/md';
import authService from '../../services/authService';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [darkMode, setDarkMode] = useState('auto'); // 'off', 'on', 'auto'
  const [user, setUser] = useState(null);
  const popupRef = useRef(null);
  const avatarRef = useRef(null);

  // Lấy thông tin user khi Header mount
  useEffect(() => {
    async function fetchUser() {
      const userInfo = await authService.getCurrentUserID();
      setUser(userInfo);
    }
    fetchUser();
  }, []);

  // Đóng popup khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target) && 
          avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowPopup(false);
        setShowDisplaySettings(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAvatarClick = () => {
    setShowPopup(!showPopup);
    setShowDisplaySettings(false);
  };

  const handleDisplaySettingsClick = () => {
    setShowDisplaySettings(true);
  };

  const handleBackClick = () => {
    setShowDisplaySettings(false);
  };

  const handleDarkModeChange = (mode) => {
    setDarkMode(mode);
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleFriendsClick = () => {
    navigate('/friends');
  };

  return (
    <div className="relative">
      <header className="flex justify-between items-center px-4 py-2 bg-white shadow-sm fixed top-0 left-0 w-full z-50">
        {/* Logo + Search */} 
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 rounded-full p-2">
            <FaFacebook className="text-white text-2xl" />
          </div>
          <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
            <FiSearch className="text-gray-500 text-lg" />
            <span className="text-gray-600 text-sm">Tìm kiếm trên Facebook</span>
          </div>
        </div>

        {/* Middle nav */}
        <div className="flex gap-16">
          <div className="flex flex-col items-center cursor-pointer" onClick={handleHomeClick}>
            <HiOutlineHome 
              className={`text-2xl ${location.pathname === '/home' ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
            />
            {location.pathname === '/home' && <div className="h-1 w-8 bg-blue-600 rounded-t-lg mt-1" />}
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <FiVideo className={`text-2xl ${location.pathname === '/videos' ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`} />
            {location.pathname === '/videos' && <div className="h-1 w-8 bg-blue-600 rounded-t-lg mt-1" />}
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={handleFriendsClick}>
            <FiUsers 
              className={`text-2xl ${location.pathname === '/friends' ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
            />
            {location.pathname === '/friends' && <div className="h-1 w-8 bg-blue-600 rounded-t-lg mt-1" />}
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <FiPlusCircle className={`text-2xl ${location.pathname === '/create' ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`} />
            {location.pathname === '/create' && <div className="h-1 w-8 bg-blue-600 rounded-t-lg mt-1" />}
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-3">
          <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
            <CgMenuGridR className="text-black" />
          </button>
          <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
            <BsMessenger className="text-black" />
          </button>
          <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
            <FiBell className="text-black" />
          </button>
          <button 
            ref={avatarRef}
            onClick={handleAvatarClick}
            className="focus:outline-none relative"
          >
            <img
              src={user?.avatarUrl || "https://th.bing.com/th/id/R.22dbc0f5e5f5648613f0d1de3ea7ae0a?rik=k6HQ45uVGe81rw&pid=ImgRaw&r=0"}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-white cursor-pointer hover:opacity-80"
            />
            <span className="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5 border border-gray-300">
              <FiChevronDown className="text-gray-700 text-xs" />
            </span>
          </button>
        </div>
      </header>

      {/* Avatar Popup Menu */}
      {showPopup && !showDisplaySettings && (
        <div 
          ref={popupRef}
          className="absolute right-4 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2"
        >
          {/* User Profile Section */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <img
                src={user?.avatarUrl || "https://th.bing.com/th/id/R.22dbc0f5e5f5648613f0d1de3ea7ae0a?rik=k6HQ45uVGe81rw&pid=ImgRaw&r=0"}
                alt="avatar"
                className="w-9 h-9 rounded-full"
              />
              <span className="font-bold text-black">{user?.userName || "Username"}</span>
            </div>
            
            <button className="w-full mt-2 bg-gray-100 text-black font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
              <BsPeople className="text-lg text-black" />
              <span className="text-sm font-semibold">Xem tất cả trang cá nhân</span>
            </button>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-gray-200 p-2 rounded-full">
                <FiSettings className="text-lg text-black" />
              </div>
              <div className="flex-1">
                <span className="text-black font-semibold">Cài đặt và quyền riêng tư</span>
              </div>
              <FiChevronRight className="text-black" />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-gray-200 p-2 rounded-full">
                <FiHelpCircle className="text-lg text-black" />
              </div>
              <div className="flex-1">
                <span className="text-black font-semibold">Trợ giúp và hỗ trợ</span>
              </div>
              <FiChevronRight className="text-black" />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={handleDisplaySettingsClick}>
              <div className="bg-gray-200 p-2 rounded-full">
                <FiMoon className="text-lg text-black" />
              </div>
              <div className="flex-1">
                <span className="text-black font-semibold">Màn hình & trợ năng</span>
              </div>
              <FiChevronRight className="text-black" />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-gray-200 p-2 rounded-full">
                <MdFeedback className="text-lg text-black" />
              </div>
              <div className="flex-1">
                <span className="text-black font-semibold">Đóng góp ý kiến</span>
                <div className="text-xs text-gray-500">CTRL B</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={authService.logout}>
              <div className="bg-gray-200 p-2 rounded-full">
                <FiLogOut className="text-lg text-black" />
              </div>
              <div className="flex-1">
                <span className="text-black font-semibold">Đăng xuất</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-x-1">
              <span>Quyền riêng tư</span>
              <span>•</span>
              <span>Điều khoản</span>
              <span>•</span>
              <span>Quảng cáo</span>
              <span>•</span>
              <span>Lựa chọn quảng cáo</span>
              <span>•</span>
              <span>Cookie</span>
              <span>•</span>
              <span>Xem thêm</span>
              <span>•</span>
              <span>Meta © 2025</span>
            </div>
          </div>
        </div>
      )}

      {/* Display Settings Popup */}
      {showPopup && showDisplaySettings && (
        <div 
          ref={popupRef}
          className="absolute right-4 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
            <button onClick={handleBackClick} className="p-1 hover:bg-gray-100 rounded-full">
              <FiArrowLeft className="text-lg text-black" />
            </button>
            <span className="text-lg font-bold text-black">Màn hình & trợ năng</span>
          </div>

          {/* Dark Mode Section */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gray-800 p-2 rounded-full">
                <FiMoon className="text-lg text-white" />
              </div>
              <div>
                <div className="text-black font-semibold">Chế độ tối</div>
                <div className="text-sm text-gray-500">
                  Điều chỉnh giao diện của Facebook để giảm độ chói và cho đôi mắt được nghỉ ngơi.
                </div>
              </div>
            </div>

            {/* Dark Mode Options */}
            <div className="space-y-2 ml-11">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-black font-medium">Tắt</span>
                <input
                  type="radio"
                  name="darkMode"
                  value="off"
                  checked={darkMode === 'off'}
                  onChange={() => handleDarkModeChange('off')}
                  className="w-5 h-5 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-black font-medium">Bật</span>
                <input
                  type="radio"
                  name="darkMode"
                  value="on"
                  checked={darkMode === 'on'}
                  onChange={() => handleDarkModeChange('on')}
                  className="w-5 h-5 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-black font-medium">Tự động</div>
                  <div className="text-sm text-gray-500">
                    Chúng tôi sẽ tự động điều chỉnh màn hình theo cài đặt hệ thống trên thiết bị của bạn.
                  </div>
                </div>
                <input
                  type="radio"
                  name="darkMode"
                  value="auto"
                  checked={darkMode === 'auto'}
                  onChange={() => handleDarkModeChange('auto')}
                  className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}