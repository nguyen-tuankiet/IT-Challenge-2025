import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ThumbsUp, MoreHorizontal, X } from 'lucide-react';

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
    const [liked, setLiked] = useState(false);
    const [reactionCount, setReactionCount] = useState(likes || 0);

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
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
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
            <div className="relative">
                <img
                    src={image}
                    alt="post"
                    className="w-full h-64 object-cover"
                />
            </div>

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

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Bình luận</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">Chia sẻ</span>
                    </button>
                </div>
            </div>
        </div>
    );
}