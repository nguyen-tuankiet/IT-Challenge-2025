import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ThumbsUp, MoreHorizontal, X } from 'lucide-react';
import PostImages from "./PostImages.jsx";
import PostDetail from "./PostDetail.jsx";

export default function Post({data}) {
    if (!data) return null;
    const {
        authorName,
        avatar,
        isFollowing,
        timestamp,
        content,
        image,
        likes,
        comments,
        shares,
    } = data;

    const mockComments = [
        {
            id: 1,
            author: 'Hùng',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
            content: 'Bài viết rất hay!',
            timestamp: '2 giờ trước',
            likes: 5,
            replies: [
                {
                    id: 11,
                    author: 'Lan',
                    avatar: 'https://randomuser.me/api/portraits/women/20.jpg',
                    content: 'Đồng ý với bạn!',
                    timestamp: '1 giờ trước',
                    likes: 2,
                    replies: []
                }
            ]
        },
        {
            id: 2,
            author: 'Lan',
            avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
            content: 'Tuyệt vời 👏',
            timestamp: '1 giờ trước',
            likes: 3,
            replies: []
        },
        {
            id: 3,
            author: 'Minh',
            avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
            content: 'Cảm ơn bạn đã chia sẻ.',
            timestamp: '30 phút trước',
            likes: 1,
            replies: [
                {
                    id: 31,
                    author: 'Hương',
                    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
                    content: 'Chuẩn luôn nha!',
                    timestamp: '10 phút trước',
                    likes: 0,
                    replies: []
                }
            ]
        }
    ];

    const detailData = {
        ...data,
        comments: mockComments,
    };

    const [liked, setLiked] = useState(false);
    const [reactionCount, setReactionCount] = useState(likes || 0);
    const [showDetail, setShowDetail] = useState(false);

    if (!data || !authorName) return null;
    
    const handleLike = () => {
        setLiked(!liked);
        setReactionCount(prev => liked ? prev - 1 : prev + 1);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center space-x-3">
                    <img
                        src={avatar}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{authorName}</span>
                            {!isFollowing && <span className="text-blue-500">· Theo dõi</span>}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <span>{timestamp}</span>
                            <span>·</span>
                            <span className="text-sm align-middle">🌍</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-full p-1" />
                    <X className="w-5 h-5 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-full p-1" />
                </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
                <p className="text-gray-900 leading-relaxed">
                    {content}
                </p>
            </div>

            {/* Image */}
            {image && <PostImages image={image} />}

            {/* Reaction Summary */}
            <div className="px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <div className="flex -space-x-1">
                            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs">😂</div>
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">👍</div>
                        </div>
                        <span>{reactionCount}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span>{comments} bình luận</span>
                        <span>{shares} lượt chia sẻ</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-2">
                <div className="flex items-center justify-around">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${liked ? 'text-blue-500' : 'text-gray-600'}`}
                    >
                        <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                        <span className="font-medium">Thích</span>
                    </button>

                    <button
                        onClick={() => setShowDetail(true)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Bình luận</span>
                    </button>
                    {showDetail && (
                        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden">
                            <div className="bg-white rounded-2xl shadow-xl max-h-[90vh] w-full max-w-2xl p-2">
                                <PostDetail data={detailData} onClose={() => setShowDetail(false)} />
                            </div>
                        </div>
                    )}

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">Chia sẻ</span>
                    </button>
                </div>
            </div>
        </div>

    );
}