import React, { useEffect, useState } from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FriendCardProfile from "./FriendCardProfile.jsx";

const FriendsLayout = ({ userId, friends, onBack }) => {
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userID');
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const handleClickFriendRequest = () => {
        navigate('/friends/requests');
    };


    useEffect(() => {
        setIsCurrentUser(userId === currentUserId);
    }, [userId, currentUserId]);

    return (
        <div className="bg-gray-100 min-h-screen text-gray-900">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <button
                        onClick={onBack}
                        className="text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-1"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="ml-1">Trở về</span>
                    </button>

                    <h1 className="text-2xl font-bold">Bạn bè</h1>

                    <div className="flex items-center space-x-4">
                        {isCurrentUser && (
                            <button
                                onClick={handleClickFriendRequest}
                                className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                                Lời mời kết bạn
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Friends Grid */}
            {friends.length === 0 ? (
                <div className="bg-white max-w-7xl mx-auto px-6 py-6">
                    Không có bạn nào
                </div>
            ):(
                <div className="bg-white max-w-7xl mx-auto px-6 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {friends.map((friend) => (
                            <FriendCardProfile key={friend.id} friend={friend} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default FriendsLayout;
