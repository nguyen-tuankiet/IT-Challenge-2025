import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ThumbsUp, MoreHorizontal, X, Image, Smile, Camera } from 'lucide-react';
import CommentItem from "./CommentItem.jsx";
import PostImages from "./PostImages.jsx";

export default function PostDetail({ data, onClose }) {
    const {
        authorName,
        avatar,
        isFollowing,
        timestamp,
        content,
        image,
        comments: initialComments,
        shares,
    } = data;

    const [userReactionTypeState, setUserReactionTypeState] = useState(data?.userReactionType || null);
    const [reactionCountsState, setReactionCountsState] = useState(data?.reactionCounts || {});
    const reactionMap = {
        'LIKE': '👍',
        'LOVE': '❤️',
        'HAHA': '😂',
        'WOW': '😮',
        'SAD': '😢',
        'ANGRY': '😡'
    };
    const reactionLabelMap = {
        'LIKE': 'Thích',
        'LOVE': 'Yêu thích',
        'HAHA': 'Haha',
        'WOW': 'Wow',
        'SAD': 'Buồn',
        'ANGRY': 'Phẫn nộ'
    };
    const [liked, setLiked] = useState(!!data?.isReacted);
    const [reactionCount, setReactionCount] = useState(data?.likes || 0);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(initialComments || []);
    const [showReactionPopup, setShowReactionPopup] = useState(false);
    const [reactionPopupTimeout, setReactionPopupTimeout] = useState(null);
    const [isHoveringPopup, setIsHoveringPopup] = useState(false);

    const getReactionEmojis = () => {
        const reactions = [];
        if (reactionCountsState && Object.keys(reactionCountsState).length > 0) {
            Object.keys(reactionCountsState).forEach(type => {
                if (reactionCountsState[type] > 0 && reactionMap[type]) {
                    reactions.push(
                        <div key={type} className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                            {reactionMap[type]}
                        </div>
                    );
                }
            });
        }
        if (reactions.length === 0 && reactionCount > 0) {
            reactions.push(
                <div key="like" className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs">👍</div>
            );
        }
        return reactions;
    };

    const handleLike = () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setReactionCount(prev => newLiked ? prev + 1 : prev - 1);
        if (newLiked) {
            setReactionCountsState(prev => {
                const prevType = userReactionTypeState;
                const next = { ...prev };
                if (prevType && next[prevType]) next[prevType]--;
                next['LIKE'] = (next['LIKE'] || 0) + 1;
                return next;
            });
            setUserReactionTypeState('LIKE');
        } else {
            setReactionCountsState(prev => {
                const prevType = userReactionTypeState;
                const next = { ...prev };
                if (prevType && next[prevType]) next[prevType]--;
                return next;
            });
            setUserReactionTypeState(null);
        }
    };

    const handleSelectReaction = (type) => {
        if (!liked) {
            setLiked(true);
            setReactionCount(prev => prev + 1);
            setReactionCountsState(prev => {
                const next = { ...prev };
                next[type] = (next[type] || 0) + 1;
                return next;
            });
        } else {
            setReactionCountsState(prev => {
                const prevType = userReactionTypeState;
                const next = { ...prev };
                if (prevType && next[prevType]) next[prevType]--;
                next[type] = (next[type] || 0) + 1;
                return next;
            });
        }
        setUserReactionTypeState(type);
    };

    const reactionOptions = [
        { type: 'LIKE', emoji: '👍' },
        { type: 'LOVE', emoji: '❤️' },
        { type: 'HAHA', emoji: '😂' },
        { type: 'WOW', emoji: '😮' },
        { type: 'SAD', emoji: '😢' },
        { type: 'ANGRY', emoji: '😡' },
    ];

    const handleComment = () => {
        if (commentText.trim()) {
            const newComment = {
                id: comments.length + 1,
                author: 'Bạn',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                content: commentText,
                timestamp: 'Vừa xong',
                likes: "",
                replies: []
            };
            setComments([...comments, newComment]);
            setCommentText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleComment();
        }
    };

    // Xử lý giữ chuột để hiện popup reaction
    const handleMouseDown = () => {
        const timeout = setTimeout(() => setShowReactionPopup(true), 400);
        setReactionPopupTimeout(timeout);
    };
    const handleMouseUp = () => {
        if (reactionPopupTimeout) {
            clearTimeout(reactionPopupTimeout);
            setReactionPopupTimeout(null);
            if (!showReactionPopup) {
                handleLike();
            }
        }
    };
    const handleMouseLeave = () => {
        if (reactionPopupTimeout) {
            clearTimeout(reactionPopupTimeout);
            setReactionPopupTimeout(null);
        }
        setTimeout(() => {
            if (!isHoveringPopup) setShowReactionPopup(false);
        }, 100);
    };

    return (
        <div className=" rounded-lg">
            <div className="bg-white shadow-sm border-b flex-shrink-0 rounded-t-2xl">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between ">
                    <h1 className="flex-1 text-xl font-semibold text-gray-900 text-center align-middle">Bài viết của {authorName}</h1>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 max-h-[70vh]">
                <div className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4 pb-3">
                        <div className="flex items-center space-x-3">
                            <img src={avatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{authorName}</span>
                                    {!isFollowing && <span className="text-blue-500 cursor-pointer hover:underline">· Theo dõi</span>}
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <span>{timestamp}</span>
                                    <span>·</span>
                                    <span className="text-sm align-middle">🌍</span>
                                </div>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="px-4 pb-3">
                        <p className="text-gray-900 leading-relaxed">{content}</p>
                    </div>

                    {image && <PostImages image={image} />}

                    <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <div className="flex -space-x-1">
                                    {getReactionEmojis()}
                                </div>
                                <span>{reactionCount}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span>{comments.length} bình luận</span>
                                {shares > 0 && <span>{shares} lượt chia sẻ</span>}
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-2 border-b border-gray-200">
                        <div className="relative flex items-center justify-around">
                            <button
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center ${liked ? 'text-blue-500' : 'text-gray-600'}`}
                            >
                                {liked && userReactionTypeState && reactionMap[userReactionTypeState] ? (
                                    <span className="text-xl">{reactionMap[userReactionTypeState]}</span>
                                ) : (
                                    <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                                )}
                                <span className="font-medium">{liked && userReactionTypeState && reactionLabelMap[userReactionTypeState] ? reactionLabelMap[userReactionTypeState] : 'Thích'}</span>
                                {showReactionPopup && (
                                    <div
                                        className="absolute bottom-full left-0 mb-2 flex items-center bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 z-[9999] gap-2"
                                        style={{ minWidth: 260 }}
                                        onMouseEnter={() => setIsHoveringPopup(true)}
                                        onMouseLeave={() => {
                                            setIsHoveringPopup(false);
                                            setShowReactionPopup(false);
                                        }}
                                    >
                                        {reactionOptions.map(opt => (
                                            <span
                                                key={opt.type}
                                                className="text-2xl cursor-pointer hover:scale-125 transition-transform"
                                                onClick={() => handleSelectReaction(opt.type)}
                                            >
                                                {opt.emoji}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 flex-1 justify-center">
                                <MessageCircle className="w-5 h-5" />
                                <span className="font-medium">Bình luận</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 flex-1 justify-center">
                                <Share2 className="w-5 h-5" />
                                <span className="font-medium">Chia sẻ</span>
                            </button>
                        </div>
                    </div>

                    <div className="px-4 py-4">
                        <div className="mb-4">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                                <span className="text-sm font-medium">Phù hợp nhất</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <CommentItem key={comment.id} comment={comment} />
                            ))}
                        </div>

                        <div className="mt-4 flex space-x-3">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                                alt="Your avatar"
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Viết bình luận..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    />
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                                        <button className="p-1 hover:bg-gray-200 rounded-full">
                                            <Smile className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-200 rounded-full">
                                            <Camera className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-200 rounded-full">
                                            <Image className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
