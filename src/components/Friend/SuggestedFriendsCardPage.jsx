import React, { useState, useEffect } from 'react';
import SuggestedFriendsCard from './SuggestedFriendsCard';
import friendService from '../../services/friendService';

// Fallback mock data in case API fails
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

const SuggestedFriendsSection = ({ userId, suggestedFriends: propSuggestedFriends }) => {
  const [showAll, setShowAll] = useState(false);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to transform API response to component format
  const transformApiResponse = (apiData) => {
    if (!Array.isArray(apiData)) {
      console.warn('API response is not an array:', apiData);
      return [];
    }

    return apiData.map(item => ({
      id: item.id,
      name: item.userName || 'Unknown User',
      mutuals: item.mutualFriendsCount || 0,
      image: item.avatarUrl || 'https://th.bing.com/th/id/R.22dbc0f5e5f5648613f0d1de3ea7ae0a?rik=k6HQ45uVGe81rw&pid=ImgRaw&r=0',
      distance: item.distance,
      location: item.location,
      suggestionScore: item.suggestionScore,
      suggestionReason: item.suggestionReason
    }));
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      // If suggestedFriends are passed as props, use them
      if (propSuggestedFriends) {
        setSuggestedFriends(propSuggestedFriends);
        setLoading(false);
        return;
      }

      // Otherwise, fetch from API
      if (userId) {
        try {
          setLoading(true);
          setError(null);
          const response = await friendService.getFriendSuggestions(userId, 15, 50.0);
          
          // Handle different response structures
          let suggestions;
          if (response && response.data) {
            // If response has a data property
            suggestions = transformApiResponse(response.data);
          } else if (Array.isArray(response)) {
            // If response is directly an array
            suggestions = transformApiResponse(response);
          } else {
            console.warn('Unexpected API response structure:', response);
            suggestions = mockSuggestedFriends;
          }
          
          setSuggestedFriends(suggestions);
        } catch (err) {
          console.error('Failed to fetch friend suggestions:', err);
          setError('Không thể tải danh sách gợi ý bạn bè');
          // Fallback to mock data
          setSuggestedFriends(mockSuggestedFriends);
        } finally {
          setLoading(false);
        }
      } else {
        // No userId provided, use mock data
        setSuggestedFriends(mockSuggestedFriends);
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userId, propSuggestedFriends]);

  const displayedSuggestions = showAll ? suggestedFriends : suggestedFriends.slice(0, 10);

  if (loading) {
    return (
      <div className="ml-4 mr-4">
        <h2 className="text-xl font-semibold mb-4 mt-4">Những người bạn có thể biết</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-1"></div>
              <div className="bg-gray-200 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 ml-4 mt-4">Những người bạn có thể biết</h2>
      
      {error && (
        <div className="ml-4 mr-4 mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-4 mr-4">
        {displayedSuggestions.map((friend, index) => (
          <SuggestedFriendsCard 
            key={friend.id || index} 
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