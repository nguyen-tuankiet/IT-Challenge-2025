import React from 'react';
import FriendButton from '../Button/FriendButton';
import friendService from '../../services/friendService';

const FriendCard = ({ avatar, name, mutualFriends, inviteId, onInviteAction }) => {
  const handleAcceptInvite = async () => {
    try {
      const userId = localStorage.getItem('userID');
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }
      await friendService.acceptInvite(userId, inviteId);
      if (onInviteAction) {
        onInviteAction('accepted', inviteId);
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
      // You can add toast notification here if needed
    }
  };

  const handleDeclineInvite = async () => {
    try {
      const userId = localStorage.getItem('userID');
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }
      await friendService.declineInvite(userId, inviteId);
      if (onInviteAction) {
        onInviteAction('declined', inviteId);
      }
    } catch (error) {
      console.error('Error declining invite:', error);
      // You can add toast notification here if needed
    }
  };

  return (
    <div className="w-[220px] bg-white rounded-md friendcard-shadow border border-gray-200 shadow-lg hover:shadow-xl transition-all">
      <img
        src={avatar}
        alt={name}
        className="w-full h-[220px] object-cover rounded-t-md"
      />
      <div className="p-3 text-center">
        <p className="font-medium text-sm text-black leading-tight">{name}</p>
        <p className="text-xs text-gray-500 mt-1">{mutualFriends} bạn chung</p>
        <div className="mt-2 flex flex-col gap-1">
          <button 
            onClick={handleAcceptInvite}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 rounded-md cursor-pointer"
          >
            Xác nhận
          </button>
          <button 
            onClick={handleDeclineInvite}
            className="bg-gray-200 hover:bg-gray-300 text-sm py-1 rounded-md cursor-pointer"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
