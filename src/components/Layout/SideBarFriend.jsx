import { FiUser, FiUsers, FiGift, FiChevronRight, FiSettings } from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const SidebarItem = ({ icon: Icon, text, active, onClick }) => (
  <div 
    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
      ${active ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full
        ${active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`font-medium ${active ? 'text-blue-600' : ''}`}>{text}</span>
    </div>
    <FiChevronRight className="text-gray-500" />
  </div>
);

export default function FriendSidebar({ activeSection, onSectionChange }) {
  const menuItems = [
    { id: 'home', icon: FaUserFriends, text: 'Trang chủ' },
    { id: 'requests', icon: FiUser, text: 'Lời mời kết bạn' },
    { id: 'suggestions', icon: FiUsers, text: 'Gợi ý' },
    { id: 'all-friends', icon: CgProfile, text: 'Tất cả bạn bè' },
    { id: 'birthdays', icon: FiGift, text: 'Sinh nhật' },
    { id: 'custom-lists', icon: FiUsers, text: 'Danh sách tuỳ chỉnh' },
  ];

  return (
    <div className="w-full max-w-xs p-1 shadow-md bg-white fixed top-[56px] left-0 h-[calc(100vh-56px)] overflow-y-auto z-40 border-none">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold mt-4 ml-4">Bạn bè</h1>
        <div className="bg-gray-200 p-2 rounded-full cursor-pointer mt-4 mr-4">
          <FiSettings />
        </div>
      </div>

      {menuItems.map((item) => (
        <SidebarItem 
          key={item.id}
          icon={item.icon} 
          text={item.text} 
          active={activeSection === item.id}
          onClick={() => onSectionChange && onSectionChange(item.id)}
        />
      ))}
    </div>
  );
}