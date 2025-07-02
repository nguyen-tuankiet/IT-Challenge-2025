import React, { useState, useEffect } from 'react';
import AllFriendsCard from './AllFriendsCard';
import friendService from '../../services/friendService';

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
];

const AllFriendsPage = ({ allFriends = null }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        setError(null);

        // If allFriends prop is provided, use it
        if (allFriends) {
          setFriends(allFriends);
          setLoading(false);
          return;
        }

        // Get user ID from localStorage
        const userId = localStorage.getItem('userID');
        
        if (!userId) {
          console.warn('No user ID found in localStorage, using mock data');
          setFriends(mockAllFriends);
          setLoading(false);
          return;
        }

        // Fetch friends from API
        const response = await friendService.getFriendsWithMutualInfo(userId);
        
        if (response && response.data) {
          // Transform API response to match component expectations
          const transformedFriends = response.data.map(friend => ({
            id: friend.userId || friend.id,
            name: friend.userName || friend.userName || 'Unknown User',
            mutuals: friend.mutualFriendsCount || friend.mutuals || 0,
            image: friend.avatarUrl || friend.image ||  'https://th.bing.com/th/id/R.22dbc0f5e5f5648613f0d1de3ea7ae0a?rik=k6HQ45uVGe81rw&pid=ImgRaw&r=0'
          }));
          
          setFriends(transformedFriends);
        } else {
          // If no data returned, use mock data
          setFriends(mockAllFriends);
        }
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError('Không thể tải danh sách bạn bè. Đang sử dụng dữ liệu mẫu.');
        setFriends(mockAllFriends);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [allFriends]);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedFriends = showAll ? filteredFriends : filteredFriends.slice(0, 10);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="text-gray-500">Đang tải danh sách bạn bè...</div>
  //     </div>
  //   );
  // }

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

      {error && (
        <div className="mx-4 mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-4 mr-4">
        {displayedFriends.map((friend, index) => (
          <AllFriendsCard 
            key={friend.id || index} 
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

      {friends.length === 0 && !loading && (
        <div className="text-center mt-8">
          <p className="text-gray-500">Bạn chưa có bạn bè nào</p>
        </div>
      )}
    </div>
  );
};

export default AllFriendsPage;