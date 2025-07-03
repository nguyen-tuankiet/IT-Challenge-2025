import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { FaUserFriends } from 'react-icons/fa';
import { BsBookmark } from 'react-icons/bs';
import { MdGroups, MdOutlineOndemandVideo, MdStorefront } from 'react-icons/md';
import { BiSolidTimeFive } from 'react-icons/bi';
import authService from '../../services/authService';
import user1Img from '../../assets/user1.png';

const menuItems = [
  {
    icon: <FaUserFriends className="w-7 h-7 text-black" />,
    text: 'Bạn bè',
  },
  {
    icon: <MdGroups className="w-7 h-7 text-black" />,
    text: 'Nhóm',
  },
  {
    icon: <BiSolidTimeFive className="w-7 h-7 text-black" />,
    text: 'Kỷ niệm',
  },
  {
    icon: <BsBookmark className="w-7 h-7 text-black" />,
    text: 'Đã lưu',
  },
  {
    icon: <MdOutlineOndemandVideo className="w-7 h-7 text-black" />,
    text: 'Thước phim',
  },
  {
    icon: <MdStorefront className="w-7 h-7 text-black" />,
    text: 'Marketplace',
  },
];

export default function LeftSideBarHome() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const userInfo = await authService.getCurrentUserID();
      setUser(userInfo);
    }
    fetchUser();
  }, []);

  const handleUserClick = () => {
    const currentUserId = localStorage.getItem('userID');
    navigate(`/profile/${currentUserId}`);
  }

  return (
    <aside className="w-full max-w-xs p-4 bg-white fixed top-[56px] left-0 h-[calc(100vh-56px)] overflow-y-auto z-40 border-none shadow-md">
      {/* User info */}
      <div onClick={handleUserClick}
          className="flex items-center gap-4 px-2 py-3 rounded-lg cursor-pointer hover:bg-gray-50 mb-6">
        <img
          src={user?.avatarUrl || user1Img}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
        <span className="font-semibold text-base text-black">{user?.userName || 'Username'}</span>
      </div>
      {/* Menu items */}
      <div className="flex flex-col gap-3">
        {menuItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 px-2 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
            {item.icon}
            <span className="font-medium text-black text-base">{item.text}</span>
          </div>
        ))}
      </div>
    </aside>
  );
} 