import { useNavigate } from 'react-router-dom';
import React from "react";

const FriendCardProfile = ({ friend }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/profile/${friend.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="relative">
                <img
                    src={friend.avatarUrl || "https://th.bing.com/th/id/R.22dbc0f5e5f5648613f0d1de3ea7ae0a?rik=k6HQ45uVGe81rw&pid=ImgRaw&r=0"}
                    alt={friend.userName}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            </div>
            <div className="p-4">
                <h3 className="text-gray-900 font-semibold text-lg mb-1">{friend.userName || "username"}</h3>
                <p className="text-gray-500 text-sm">{friend.mutualFriendsCount || 0} bạn chung</p>
            </div>
        </div>
    );
};
export default FriendCardProfile;