import React, {useEffect, useState} from "react";
import { MapPin, Home, Calendar } from "lucide-react";

const LeftSideBarProfile = ({userId, userInfo ,friendCount, friends, mutualFriend, onViewAllFriends}) => {
    const currentUserId = localStorage.getItem('userID');
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        setIsCurrentUser(userId === currentUserId);
    }, [userId, currentUserId]);
    return (
        <div className="space-y-4 px-2">
            {/* Thông tin cá nhân */}
            <div className="bg-white rounded-lg p-4 shadow-sm text-sm ">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Giới thiệu</h3>

                <div className="space-y-3 text-gray-700">
                    <div className="flex items-center space-x-3">
                        <Home size={18} />
                        <span>
                            Sống tại <span className="font-medium text-gray-900">Hoài Nhơn, Bình Định, Vietnam</span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <MapPin size={18} />
                        <span>
                            Đến từ <span className="font-medium text-gray-900">Hoài Nhơn, Bình Định, Vietnam</span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Calendar size={18} />
                        <span>
                            Tham gia vào <span className="font-medium text-gray-900">tháng 1 năm 2010</span>
                        </span>
                    </div>
                </div>

                {/*<button className="w-full mt-4 bg-gray-100 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-200">*/}
                {/*    Chỉnh sửa chi tiết*/}
                {/*</button>*/}
            </div>

            {/* Bạn bè */}
            <div className="bg-white rounded-lg p-4 shadow-sm text-sm ">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-800">Bạn bè</h3>
                    <button
                        onClick={onViewAllFriends}
                        className="text-blue-600 text-sm hover:underline">
                        Xem tất cả bạn bè
                    </button>
                </div>

                {isCurrentUser ? (
                    <p className="text-gray-600 text-sm mb-3">{friendCount} người bạn</p>
                ) : (
                    <div className="text-gray-300 sm:text-gray-600 mb-3">
                        <span className="me-1">{friendCount} người bạn</span>
                        <span>({mutualFriend} bạn chung)</span>
                    </div>
                )}


                <div className="grid grid-cols-3 gap-2">
                    {friends.slice(0, 9).map((friend) => (
                        <div key={friend.id} className="text-center">
                            <div className="w-full aspect-square bg-gray-200 rounded-md mb-1 overflow-hidden">
                                <img
                                    src={friend.avatarUrl || "https://th.bing.com/th/id/R.22dbc0f5e5f5648613f0d1de3ea7ae0a?rik=k6HQ45uVGe81rw&pid=ImgRaw&r=0"}
                                    alt={friend.userName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs text-gray-800 truncate">{friend.userName}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default LeftSideBarProfile;