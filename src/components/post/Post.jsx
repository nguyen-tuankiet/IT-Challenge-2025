import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ThumbsUp, MoreHorizontal, X, Globe, Users, Lock } from 'lucide-react';
import PostImages from "./PostImages.jsx";
import PostDetail from "./PostDetail.jsx";
import PostService from '../../services/PostService'; // Adjust path as needed

// Also update CreatePostModal styling
const CreatePostModalStyle = `
/* Update CreatePostModal trigger styling */
.create-post-trigger {
    @apply bg-white border border-gray-200 rounded-lg p-4;
    box-shadow: none;
}
`;

export default function Post({data}) {
    if (!data) return null;
    
    const {
        id,
        authorName,
        avatar,
        isFollowing,
        timestamp,
        content,
        image,
        likes,
        comments,
        shares,
        views,
        isReacted,
        reactionCounts,
        originalPost,
        accessMode
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

    const [liked, setLiked] = useState(isReacted || false);
    const [reactionCount, setReactionCount] = useState(likes || 0);
    const [showDetail, setShowDetail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);
    const [showReactionPopup, setShowReactionPopup] = useState(false);
    const [reactionPopupTimeout, setReactionPopupTimeout] = useState(null);
    const [isHoveringPopup, setIsHoveringPopup] = useState(false);

    const reactionOptions = [
        { type: 'LIKE', emoji: '👍' },
        { type: 'LOVE', emoji: '❤️' },
        { type: 'HAHA', emoji: '😂' },
        { type: 'WOW', emoji: '😮' },
        { type: 'SAD', emoji: '😢' },
        { type: 'ANGRY', emoji: '😡' },
    ];

    if (!data || !authorName) return null;
    
    const handleLike = async () => {
        if (isLoading) return;
        
        try {
            setIsLoading(true);
            // Optimistic update
            const newLiked = !liked;
            setLiked(newLiked);
            setReactionCount(prev => newLiked ? prev + 1 : prev - 1);
            
            // Call API
            await PostService.reactToPost(id, newLiked ? 'LIKE' : 'UNLIKE');
        } catch (error) {
            // Revert on error
            setLiked(liked);
            setReactionCount(reactionCount);
            console.error('Error reacting to post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectReaction = async (type) => {
        setShowReactionPopup(false);
        setLiked(type === 'LIKE');
        setReactionCount(prev => prev + 1); // You may want to update this logic
        await PostService.reactToPost(id, type);
    };

    // Format content to handle line breaks and 'Xem thêm'
    const formatContent = (text) => {
        if (!text) return '';
        const lines = text.split('\n');
        const shouldTruncate = lines.length > 2 && !showFullContent;
        const displayLines = shouldTruncate ? lines.slice(0, 2) : lines;
        return <>
            {displayLines.map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    {index < displayLines.length - 1 && <br />}
                </React.Fragment>
            ))}
            {shouldTruncate && (
                <span className="text-blue-500 cursor-pointer ml-1 hover:underline" onClick={() => setShowFullContent(true)}>
                    ... Xem thêm
                </span>
            )}
        </>;
    };

    // Display reaction emojis based on reactionCounts
    const getReactionEmojis = () => {
        const reactions = [];
        if (reactionCounts && Object.keys(reactionCounts).length > 0) {
            // Map reaction types to emojis
            const reactionMap = {
                'LIKE': '👍',
                'LOVE': '❤️',
                'HAHA': '😂',
                'WOW': '😮',
                'SAD': '😢',
                'ANGRY': '😡'
            };
            
            Object.keys(reactionCounts).forEach(type => {
                if (reactionCounts[type] > 0 && reactionMap[type]) {
                    reactions.push(
                        <div key={type} className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                            {reactionMap[type]}
                        </div>
                    );
                }
            });
        }
        
        // Default reactions if none exist
        if (reactions.length === 0 && reactionCount > 0) {
            reactions.push(
                <div key="like" className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">👍</div>
            );
        }
        
        return reactions;
    };

    // Helper to get access icon
    const getAccessIcon = (mode) => {
        switch (mode) {
            case 'PUBLIC':
                return <Globe className="w-4 h-4 inline align-middle" />;
            case 'FRIENDS_ONLY':
            case 'FRIENDS':
                return <Users className="w-4 h-4 inline align-middle" />;
            case 'PRIVATE':
                return <Lock className="w-4 h-4 inline align-middle" />;
            default:
             return <Globe className="w-4 h-4 inline align-middle" />;
        }
    };

    const handleShowPopup = () => {
        const timeout = setTimeout(() => setShowReactionPopup(true), 400);
        setReactionPopupTimeout(timeout);
    };
    const handleHidePopup = () => {
        if (reactionPopupTimeout) clearTimeout(reactionPopupTimeout);
        setReactionPopupTimeout(null);
        setTimeout(() => {
            if (!isHoveringPopup) setShowReactionPopup(false);
        }, 100);
    };

    return (
        <div className="mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center space-x-3">
                    <img
                        src={avatar || 'https://via.placeholder.com/40'}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40';
                        }}
                    />
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{authorName}</span>
                            {!isFollowing && <span className="text-blue-500 cursor-pointer hover:underline">· Theo dõi</span>}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <span>{timestamp}</span>
                            <span>·</span>
                            <span className="text-sm align-middle">{getAccessIcon(accessMode)}</span>
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
                <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {formatContent(content)}
                </div>
            </div>

            {/* Image */}
            {image && <PostImages image={image} />}

            {/* Reaction Summary */}
            <div className="px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        {reactionCount > 0 && (
                            <>
                                <div className="flex -space-x-1">
                                    {getReactionEmojis()}
                                </div>
                                <span>{reactionCount}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        {comments > 0 && <span>{comments} bình luận</span>}
                        {shares > 0 && <span>{shares} lượt chia sẻ</span>}
                        {views > 0 && <span>{views} lượt xem</span>}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-2">
                <div className="flex items-center justify-around">
                    <div className="relative">
                        <button
                            onMouseDown={handleShowPopup}
                            onMouseUp={handleHidePopup}
                            onMouseLeave={handleHidePopup}
                            onClick={handleLike}
                            disabled={isLoading}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                                liked ? 'text-blue-500' : 'text-gray-600'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                            <span className="font-medium">Thích</span>
                        </button>
                        {showReactionPopup && (
                            <div
                                className="absolute bottom-full left-[1%] mb-2 flex bg-white rounded-full shadow-lg px-3 py-2 z-50 border min-w-max overflow-visible"
                                onMouseEnter={() => setIsHoveringPopup(true)}
                                onMouseLeave={() => {
                                    setIsHoveringPopup(false);
                                    setShowReactionPopup(false);
                                }}
                            >
                                {reactionOptions.map(opt => (
                                    <span
                                        key={opt.type}
                                        className="mx-1 text-2xl cursor-pointer hover:scale-125 transition-transform"
                                        onClick={() => handleSelectReaction(opt.type)}
                                    >
                                        {opt.emoji}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowDetail(true)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Bình luận</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">Chia sẻ</span>
                    </button>
                </div>
            </div>

            {/* Post Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden">
                    <div className="bg-white rounded-2xl shadow-xl max-h-[90vh] w-full max-w-2xl p-2">
                        <PostDetail data={detailData} onClose={() => setShowDetail(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}