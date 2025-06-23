import React from 'react';

const FriendButton = ({ onConfirm, onDelete }) => (
  <div className="flex flex-col gap-1 mt-2">
    <button className="bg-blue-600 text-white py-1 rounded" onClick={onConfirm}>Xác nhận</button>
    <button className="bg-gray-200 text-black py-1 rounded" onClick={onDelete}>Xóa</button>
  </div>
);

export default FriendButton;
