import React from 'react';
import FriendButton from '../Button/FriendButton';

const FriendCard = ({ avatar, name, mutualFriends }) => {
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
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 rounded-md">Xác nhận</button>
          <button className="bg-gray-200 hover:bg-gray-300 text-sm py-1 rounded-md">Xóa</button>
        </div>
      </div>
    </div>
  );
};


export default FriendCard;
