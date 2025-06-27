import React, { useState, useRef, useEffect } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FiSearch, FiVideo, FiUsers, FiPlusCircle, FiBell, FiSettings, FiHelpCircle, FiMoon, FiLogOut, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { BsMessenger, BsPeople } from 'react-icons/bs';
import { HiOutlineHome } from 'react-icons/hi';
import { CgMenuGridR } from 'react-icons/cg';
import { MdFeedback, MdKeyboard } from 'react-icons/md';
import authService from '../../services/authService';

export default function Header() {
  const [showPopup, setShowPopup] = useState(false);
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
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAvatarClick = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="relative">
      <header className="flex justify-between items-center px-4 py-2 bg-white shadow-sm sticky top-0 z-50">
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
          <HiOutlineHome className="text-gray-500 text-2xl cursor-pointer hover:text-blue-600" />
          <FiVideo className="text-gray-500 text-2xl cursor-pointer hover:text-blue-600" />
          <FiUsers className="text-gray-500 text-2xl cursor-pointer hover:text-blue-600" />
          <FiPlusCircle className="text-gray-500 text-2xl cursor-pointer hover:text-blue-600" />
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
      {showPopup && (
        <div 
          ref={popupRef}
          className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2"
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

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer">
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
    </div>
  );
}