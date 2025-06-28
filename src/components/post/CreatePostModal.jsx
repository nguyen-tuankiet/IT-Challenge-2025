import React, { useState } from 'react';
import { X, ChevronDown, Image, Users, Smile, MapPin, MoreHorizontal } from 'lucide-react';

const audienceOptions = {
    public: { icon: '🌍', label: 'Công khai' },
    friends: { icon: '👥', label: 'Bạn bè' },
    private: { icon: '🔒', label: 'Chỉ mình tôi' },
};

const PostButton = ({ icon, color, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
        <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
            {icon}
        </div>
        <span className="text-gray-700 text-sm">{label}</span>
    </button>
);

export default function CreatePost({ avatar, name }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);
    const [selectedAudience, setSelectedAudience] = useState('public');

    const handleInputClick = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handlePost = () => {
        if (postContent.trim()) {
            console.log("Post submitted:", postContent);
            setPostContent('');
            setIsModalOpen(false);
        }
    };

    const handleAudienceSelect = (key) => {
        setSelectedAudience(key);
        setShowAudienceDropdown(false);
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Main Input Trigger */}
            <div className="bg-white shadow-lg rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button
                        onClick={handleInputClick}
                        className="flex-1 bg-gray-100 text-gray-600 rounded-3xl px-4 py-3 text-left hover:bg-gray-200 transition-colors"
                    >
                        {name} ơi, bạn đang nghĩ gì thế?
                    </button>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4">
                    {showAudienceDropdown && (
                        <div className="fixed inset-0 z-40" onClick={() => setShowAudienceDropdown(false)}></div>
                    )}

                    <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden relative z-50 shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-black text-lg font-semibold">Tạo bài viết</h2>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="p-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-black font-semibold">{name}</div>
                                    <div className="flex items-center space-x-1 relative">
                                        <button
                                            onClick={() => setShowAudienceDropdown(!showAudienceDropdown)}
                                            className="flex items-center space-x-1 bg-gray-100 rounded px-2 py-1 hover:bg-gray-200 transition-colors"
                                        >
                                            <span className="text-sm">{audienceOptions[selectedAudience].icon}</span>
                                            <span className="text-gray-700 text-sm">{audienceOptions[selectedAudience].label}</span>
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        </button>

                                        {showAudienceDropdown && (
                                            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[180px]">
                                                {Object.entries(audienceOptions).map(([key, option]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleAudienceSelect(key)}
                                                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                                            selectedAudience === key ? 'bg-gray-100' : ''
                                                        }`}
                                                    >
                                                        <span className="text-lg">{option.icon}</span>
                                                        <div>
                                                            <div className="text-black text-sm font-medium">{option.label}</div>
                                                            <div className="text-gray-500 text-xs">
                                                                {key === 'public' && 'Bất kỳ ai trên hoặc ngoài Facebook'}
                                                                {key === 'friends' && 'Bạn bè của bạn trên Facebook'}
                                                                {key === 'private' && 'Chỉ bạn'}
                                                            </div>
                                                        </div>
                                                        {selectedAudience === key && (
                                                            <div className="ml-auto w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="Bạn đang nghĩ gì thế?"
                                className="w-full bg-transparent text-black text-lg placeholder-gray-500 resize-none border-none outline-none min-h-[120px]"
                                autoFocus
                            />
                        </div>

                        <div className="px-4 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-black font-medium">Thêm vào bài viết của bạn</span>
                                <div className="flex items-center space-x-2">
                                    <PostButton icon={<Image className="w-4 h-4 text-white" />} color="bg-green-500" label="" onClick={() => {}} />
                                    {/*<PostButton icon={<Users className="w-4 h-4 text-white" />} color="bg-blue-500" label="" onClick={() => {}} />*/}
                                    <PostButton icon={<Smile className="w-4 h-4 text-white" />} color="bg-yellow-500" label="" onClick={() => {}} />
                                    {/*<PostButton icon={<MapPin className="w-4 h-4 text-white" />} color="bg-red-500" label="" onClick={() => {}} />*/}
                                    {/*<PostButton icon={<span className="text-white text-sm font-bold">GIF</span>} color="bg-purple-500" label="" onClick={() => {}} />*/}
                                    {/*<PostButton icon={<MoreHorizontal className="w-4 h-4 text-white" />} color="bg-gray-400" label="" onClick={() => {}} />*/}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={handlePost}
                                disabled={!postContent.trim()}
                                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                                    postContent.trim()
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Đăng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
