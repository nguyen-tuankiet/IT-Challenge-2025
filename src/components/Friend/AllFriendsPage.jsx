import React, { useState } from 'react';
import AllFriendsCard from './AllFriendsCard';

const mockAllFriends = [
  { name: 'Nguyễn Văn Minh', mutuals: 25, image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { name: 'Trần Thị Lan', mutuals: 18, image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { name: 'Lê Hoàng Nam', mutuals: 32, image: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { name: 'Phạm Thu Hà', mutuals: 16, image: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { name: 'Vương Minh Tuấn', mutuals: 22, image: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { name: 'Đỗ Thị Mai', mutuals: 28, image: 'https://randomuser.me/api/portraits/women/9.jpg' },
  { name: 'Bùi Văn Đức', mutuals: 19, image: 'https://randomuser.me/api/portraits/men/10.jpg' },
  { name: 'Ngô Thị Hương', mutuals: 24, image: 'https://randomuser.me/api/portraits/women/11.jpg' },
  { name: 'Đinh Hoàng Long', mutuals: 17, image: 'https://randomuser.me/api/portraits/men/13.jpg' },
  { name: 'Hoàng Thị Linh', mutuals: 21, image: 'https://randomuser.me/api/portraits/women/14.jpg' },
  { name: 'Trịnh Văn Hùng', mutuals: 26, image: 'https://randomuser.me/api/portraits/men/16.jpg' },
  { name: 'Phan Thị Ngọc', mutuals: 15, image: 'https://randomuser.me/api/portraits/women/17.jpg' },
  { name: 'Lý Minh Khôi', mutuals: 30, image: 'https://randomuser.me/api/portraits/men/18.jpg' },
  { name: 'Võ Thị Trang', mutuals: 23, image: 'https://randomuser.me/api/portraits/women/19.jpg' },
  { name: 'Đặng Văn Quân', mutuals: 27, image: 'https://randomuser.me/api/portraits/men/21.jpg' },
  { name: 'Dương Thị Yến', mutuals: 20, image: 'https://randomuser.me/api/portraits/women/22.jpg' },
  { name: 'Tạ Hoàng Phúc', mutuals: 29, image: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { name: 'Chu Thị Bích', mutuals: 14, image: 'https://randomuser.me/api/portraits/women/24.jpg' },
  { name: 'Mạc Văn Thịnh', mutuals: 31, image: 'https://randomuser.me/api/portraits/men/26.jpg' },
  { name: 'Ông Thị Kim', mutuals: 13, image: 'https://randomuser.me/api/portraits/women/27.jpg' },
];

const AllFriendsPage = ({ allFriends = mockAllFriends }) => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFriends = allFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedFriends = showAll ? filteredFriends : filteredFriends.slice(0, 10);

  return (
    <div>
      <div className="flex justify-between items-center mb-4 ml-4 mr-4 mt-4">
        <h2 className="text-xl font-semibold">Tất cả bạn bè</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-500 text-sm">{filteredFriends.length} bạn bè</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-4 mr-4">
        {displayedFriends.map((friend, index) => (
          <AllFriendsCard 
            key={index} 
            avatar={friend.image} 
            name={friend.name} 
            mutualFriends={friend.mutuals} 
          />
        ))}
      </div>

      {!showAll && filteredFriends.length > 10 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 font-medium hover:underline"
          >
            Xem thêm
          </button>
        </div>
      )}

      {filteredFriends.length === 0 && searchTerm && (
        <div className="text-center mt-8">
          <p className="text-gray-500">Không tìm thấy bạn bè nào với từ khóa "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default AllFriendsPage;