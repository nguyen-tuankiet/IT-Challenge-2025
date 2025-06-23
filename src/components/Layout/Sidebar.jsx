  import { FiUser, FiUsers, FiGift, FiChevronRight, FiSettings } from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const SidebarItem = ({ icon: Icon, text, active }) => (
  <div className={` flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
    ${active ? 'bg-blue-50' : 'hover:bg-gray-100'}`}>
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

export default function FriendSidebar() {
  return (
    <div className="w-full max-w-xs p-1 shadow-md bg-white rounded-x2">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold mt-4 ml-4">Bạn bè</h1>
        <div className="bg-gray-200 p-2 rounded-full cursor-pointer mt-4 mr-4">
          <FiSettings />
        </div>
      </div>

      <SidebarItem icon={FaUserFriends} text="Trang chủ" active  />
      <SidebarItem icon={FiUser} text="Lời mời kết bạn" />
      <SidebarItem icon={FiUsers} text="Gợi ý" />
      <SidebarItem icon={CgProfile} text="Tất cả bạn bè" />
      <SidebarItem icon={FiGift} text="Sinh nhật" />
      <SidebarItem icon={FiUsers} text="Danh sách tuỳ chỉnh" />
    </div>
  );
}
