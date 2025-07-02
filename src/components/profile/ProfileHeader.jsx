import React from 'react';
import {Camera, Edit3, Plus, MoreHorizontal, ChevronDown} from 'lucide-react';

const ProfileHeader = ({user}) => {

    return (
        <div className="min-h-3/4 bg-gray-100">

            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        {/*<div className="text-2xl font-bold text-blue-600">facebook</div>*/}
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover Photo */}
            <div className="relative bg-white h-80 overflow-hidden px-28">
                <img
                    src="https://24hstore.vn/upload_images/images/anh-bia-facebook-dep/anh-bia-facebook-dep_(1).jpg"
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Profile Info */}
            <div className="bg-white px-28">
                <div className="relative -mt-20 pb-4 px-4">
                    <div className="flex items-center justify-between max-w-6xl mx-auto">
                        {/* Avatar */}
                        <div className="relative ms-4">
                            <div className="w-50 h-50 bg-gray-200 rounded-full border-4 border-white overflow-hidden">
                                <img
                                    src={user?.avatarUrl || "https://th.bing.com/th/id/R.22dbc0f5e5f5648613f0d1de3ea7ae0a?rik=k6HQ45uVGe81rw&pid=ImgRaw&r=0"}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Name + friend count + action */}
                        <div
                            className="flex-1 ml-6 flex flex-col sm:flex-row sm:items-center sm:justify-between mt-20 me-4">
                            {/* Name & Friends */}
                            <div>
                                <h1 className="text-3xl font-bold text-white sm:text-black">{user?.userName || "username"}</h1>
                                <p className="text-gray-300 sm:text-gray-600">613 người bạn</p>
                            </div>

                            {/* Action Button */}
                            <div className="mt-2 sm:mt-0">
                                <button
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 flex items-center space-x-2">
                                    <Edit3 size={16}/>
                                    <span>Chỉnh sửa trang cá nhân</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;