import React, { useState } from 'react';
import SuggestedFriendsCard from './SuggestedFriendsCard';

const mockSuggestedFriends = [
  { name: 'Hồng Thắm', mutuals: 14, image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'Lê Đình Hưng', mutuals: 7, image: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { name: 'Thanh Phan', mutuals: 2, image: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { name: 'Bách Bách Phan', mutuals: 3, image: 'https://randomuser.me/api/portraits/men/12.jpg' },
  { name: 'Phạm Thành', mutuals: 2, image: 'https://randomuser.me/api/portraits/men/15.jpg' },
  { name: 'Thu Hà', mutuals: 5, image: 'https://randomuser.me/api/portraits/women/20.jpg' },
  { name: 'Minh Quân', mutuals: 8, image: 'https://randomuser.me/api/portraits/men/25.jpg' },
  { name: 'Linh Chi', mutuals: 12, image: 'https://randomuser.me/api/portraits/women/30.jpg' },
  { name: 'Tuấn Anh', mutuals: 6, image: 'https://randomuser.me/api/portraits/men/40.jpg' },
  { name: 'Mai Lan', mutuals: 9, image: 'https://randomuser.me/api/portraits/women/35.jpg' },
  { name: 'Đức Minh', mutuals: 4, image: 'https://randomuser.me/api/portraits/men/50.jpg' },
  { name: 'Thảo Nguyên', mutuals: 11, image: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { name: 'Hoàng Long', mutuals: 7, image: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { name: 'Như Quỳnh', mutuals: 15, image: 'https://randomuser.me/api/portraits/women/50.jpg' },
  { name: 'Văn Nam', mutuals: 3, image: 'https://randomuser.me/api/portraits/men/60.jpg' },
];

const SuggestedFriendsSection = ({ suggestedFriends = mockSuggestedFriends }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedSuggestions = showAll ? suggestedFriends : suggestedFriends.slice(0, 10);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 ml-4 mt-4">Những người bạn có thể biết</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-4 mr-4">
        {displayedSuggestions.map((friend, index) => (
          <SuggestedFriendsCard 
            key={index} 
            avatar={friend.image} 
            name={friend.name} 
            mutualFriends={friend.mutuals} 
          />
        ))}
      </div>

      {!showAll && suggestedFriends.length > 10 && (
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

export default SuggestedFriendsSection;