
import { FaFacebook } from 'react-icons/fa';
import { FiSearch, FiVideo, FiUsers, FiPlusCircle, FiBell } from 'react-icons/fi';
import { BsMessenger } from 'react-icons/bs';
import { HiOutlineHome } from 'react-icons/hi';
import { CgMenuGridR } from 'react-icons/cg';

export default function Header() {
  return (
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
    <HiOutlineHome className="text-gray-500 text-2xl cursor-pointer" />
    <FiVideo className="text-gray-500 text-2xl cursor-pointer" />
    <FiUsers className="text-gray-500 text-2xl cursor-pointer" />
    <FiPlusCircle className="text-gray-500 text-2xl cursor-pointer" />
  </div>

      {/* Right icons */}
      <div className="flex items-center space-x-3">
        <button className="bg-gray-100 p-2 rounded-full">
        <CgMenuGridR className="text-black" />
        </button>
        <button className="bg-gray-100 p-2 rounded-full">
          <BsMessenger className="text-black" />
        </button>
        <button className="bg-gray-100 p-2 rounded-full">
          <FiBell className="text-black" />
        </button>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="avatar"
          className="w-8 h-8 rounded-full border border-white"
        />
      </div>
    </header>
  );
}
