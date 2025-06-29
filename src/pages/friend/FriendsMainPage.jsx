import React, { useState } from 'react';
import FriendRequestsSection from '../../components/Friend/FriendRequestsPage';
import SuggestedFriendsSection from '../../components/Friend/SuggestedFriendsCardPage';

const FriendsMainPage = () => {
  const [currentSection, setCurrentSection] = useState('requests'); // 'requests' or 'suggestions'

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem('userID');

  const renderCurrentSection = () => {
    switch(currentSection) {
      case 'requests':
        return <FriendRequestsSection />;
      case 'suggestions':
        return <SuggestedFriendsSection userId={currentUserId} />;
      default:
        return <FriendRequestsSection />;
    }
  };

  return (
    <div className="w-full">
      Navigation tabs - có thể ẩn đi nếu chỉ dùng sidebar navigation
      <div className="hidden border-b-2 mb-4">
        <div className="flex gap-4 ml-4">
          <button
            onClick={() => setCurrentSection('requests')}
            className={`py-2 px-4 border-b-2 font-medium ${
              currentSection === 'requests' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Lời mời kết bạn
          </button>
          <button
            onClick={() => setCurrentSection('suggestions')}
            className={`py-2 px-4 border-b-2 font-medium ${
              currentSection === 'suggestions' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Những người bạn có thể biết
          </button>
        </div>
      </div>

      {/* Content area */}
      {renderCurrentSection()}
    </div>
  );
};

export default FriendsMainPage;