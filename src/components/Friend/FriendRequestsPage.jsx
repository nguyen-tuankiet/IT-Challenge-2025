import React, { useState } from 'react';
import FriendCard from './FriendCard';

const mockData = [
  { name: 'Nguyen Huyen', mutuals: 1, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Minh Anh', mutuals: 0, image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: 'Huyền Linh Trần', mutuals: 1, image: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { name: 'Trịnh Nhật Thanh', mutuals: 4, image: 'https://randomuser.me/api/portraits/men/38.jpg' },
  { name: 'Khánh Vy', mutuals: 43, image: 'https://randomuser.me/api/portraits/men/39.jpg'},
  { name: 'Nguyen Huyen', mutuals: 1, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Minh Anh', mutuals: 0, image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: 'Huyền Linh Trần', mutuals: 1, image: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { name: 'Trịnh Nhật Thanh', mutuals: 4, image: 'https://randomuser.me/api/portraits/men/38.jpg' },
  { name: 'Khánh Vy', mutuals: 43, image: 'https://randomuser.me/api/portraits/men/39.jpg'},
  { name: 'Nguyen Huyen', mutuals: 1, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Minh Anh', mutuals: 0, image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: 'Huyền Linh Trần', mutuals: 1, image: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { name: 'Trịnh Nhật Thanh', mutuals: 4, image: 'https://randomuser.me/api/portraits/men/38.jpg' },
  { name: 'Khánh Vy', mutuals: 43, image: 'https://randomuser.me/api/portraits/men/39.jpg'},

];

const FriendRequestsPage = ({ friendRequests =  mockData  }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedRequests = showAll ? friendRequests : friendRequests.slice(0, 10);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 ml-4 mt-4">Lời mời kết bạn</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-4 mr-4">
        {displayedRequests.map((friend, index) => (
          <FriendCard key={index} avatar={friend.image} name={friend.name} mutualFriends={friend.mutuals} />
        ))}
      </div>

      {!showAll && friendRequests.length > 10 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 font-medium hover:underline"
          >
            Xem thêm 
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendRequestsPage;
