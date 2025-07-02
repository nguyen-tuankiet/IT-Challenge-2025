import React from "react";
import { MapPin, Home, Calendar } from "lucide-react";

const LeftSideBarProfile = ({user}) => {
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
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-800">Bạn bè</h3>
                    <button className="text-blue-600 text-sm hover:underline">Xem tất cả bạn bè</button>
                </div>

                <p className="text-gray-600 text-sm mb-3">613 người bạn</p>

                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div key={i} className="text-center">
                            <div className="w-full aspect-square bg-gray-200 rounded-md mb-1"></div>
                            <p className="text-xs text-gray-800 truncate">Bạn {i}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeftSideBarProfile;