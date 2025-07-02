import React, { useState, useEffect } from 'react';
import CommentService from '../../services/CommentService';
import authService from '../../services/authService';

const reactionMap = {
    LIKE: '👍',
    LOVE: '❤️',
    HAHA: '😂',
    WOW: '😮',
    SAD: '😢',
    ANGRY: '😡'
};
const reactionLabelMap = {
    LIKE: 'Thích',
    LOVE: 'Yêu thích',
    HAHA: 'Haha',
    WOW: 'Wow',
    SAD: 'Buồn',
    ANGRY: 'Phẫn nộ'
};
const reactionOptions = [
    { type: 'LIKE', emoji: '👍' },
    { type: 'LOVE', emoji: '❤️' },
    { type: 'HAHA', emoji: '😂' },
    { type: 'WOW', emoji: '😮' },
    { type: 'SAD', emoji: '😢' },
    { type: 'ANGRY', emoji: '😡' },
];

function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
}

// Helper: lấy tối đa 3 loại reaction có count lớn nhất
function getTopReactions(reactionCounts) {
    const entries = Object.entries(reactionCounts)
        .filter(([type, count]) => count > 0 && reactionMap[type])
        .sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 3).map(([type]) => type);
}

function ReplyItem({ reply, currentUser }) {
    const [reactionCounts, setReactionCounts] = useState({});
    const [userReaction, setUserReaction] = useState(null);
    const [showReactionPopup, setShowReactionPopup] = useState(false);
    const [reactionPopupTimeout, setReactionPopupTimeout] = useState(null);
    const [isHoveringPopup, setIsHoveringPopup] = useState(false);

    useEffect(() => {
        async function fetchReactions() {
            if (!reply.id) return;
            const [countsRes, userRes] = await Promise.all([
                CommentService.getCommentReactionCounts(reply.id),
                currentUser ? CommentService.getUserCommentReaction(reply.id, currentUser.id) : Promise.resolve({ data: null })
            ]);
            setReactionCounts(countsRes.data || {});
            setUserReaction(userRes.data || null);
        }
        fetchReactions();
    }, [reply.id, currentUser]);

    const handleReact = async (type) => {
        if (!currentUser) return;
        await CommentService.reactToComment(reply.id, type, currentUser.id);
        const [countsRes, userRes] = await Promise.all([
            CommentService.getCommentReactionCounts(reply.id),
            CommentService.getUserCommentReaction(reply.id, currentUser.id)
        ]);
        setReactionCounts(countsRes.data || {});
        setUserReaction(userRes.data || null);
        setShowReactionPopup(false);
    };
    const handleLikeClick = async () => {
        if (!currentUser) return;
        if (userReaction) {
            await CommentService.reactToComment(reply.id, userReaction, currentUser.id);
        } else {
            await CommentService.reactToComment(reply.id, 'LIKE', currentUser.id);
        }
        const [countsRes, userRes] = await Promise.all([
            CommentService.getCommentReactionCounts(reply.id),
            CommentService.getUserCommentReaction(reply.id, currentUser.id)
        ]);
        setReactionCounts(countsRes.data || {});
        setUserReaction(userRes.data || null);
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
        <div className="flex space-x-3">
            <img
                src={reply.owner?.avatarUrl || 'https://via.placeholder.com/40'}
                alt={reply.owner?.userName || 'avatar'}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                    <p className="font-semibold text-sm text-gray-900">{reply.owner?.userName || 'Người dùng'}</p>
                    <p className="text-gray-900 text-sm">{reply.textContent}</p>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{formatTime(reply.createdAt)}</span>
                    <div className="relative inline-block">
                        <button
                            className={`hover:underline font-medium flex items-center space-x-1 ${userReaction ? 'text-blue-500' : ''} cursor-pointer`}
                            onMouseDown={handleShowPopup}
                            onMouseUp={handleHidePopup}
                            onMouseLeave={handleHidePopup}
                            onClick={handleLikeClick}
                        >
                            {userReaction && reactionMap[userReaction] ? (
                                <span>{reactionMap[userReaction]}</span>
                            ) : null}
                            <span>{userReaction && reactionLabelMap[userReaction] ? reactionLabelMap[userReaction] : 'Thích'}</span>
                        </button>
                        {showReactionPopup && (
                            <div
                                className="absolute bottom-full left-0 mb-2 flex bg-white rounded-full shadow-lg px-3 py-2 z-50 border min-w-max overflow-visible"
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
                                        onClick={() => handleReact(opt.type)}
                                    >
                                        {opt.emoji}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="hover:underline font-medium">Trả lời</button>
                    {/* Tổng số reaction kiểu Facebook - nằm ngang hàng action */}
                    {Object.values(reactionCounts).reduce((a, b) => a + b, 0) > 0 && (
                        <div className="flex items-center space-x-1 ml-auto select-none cursor-pointer group">
                            <div className="flex -space-x-2">
                                {getTopReactions(reactionCounts).map((type, idx) => (
                                    <span
                                        key={type}
                                        title={reactionLabelMap[type]}
                                        className={`inline-block w-5 h-5 rounded-full bg-white border border-white shadow text-xs flex items-center justify-center z-${10-idx} group-hover:cursor-pointer`}
                                        style={{ marginLeft: idx === 0 ? 0 : -8 }}
                                    >
                                        {reactionMap[type]}
                                    </span>
                                ))}
                            </div>
                            <span className="ml-1 text-xs text-gray-600 font-medium group-hover:cursor-pointer">
                                {Object.values(reactionCounts).reduce((a, b) => a + b, 0)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CommentItem({ comment }) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);
    const [replies, setReplies] = useState(comment.replies || []);
    const [currentUser, setCurrentUser] = useState(null);
    const [reactionCounts, setReactionCounts] = useState({});
    const [userReaction, setUserReaction] = useState(null);
    const [showReactionPopup, setShowReactionPopup] = useState(false);
    const [reactionPopupTimeout, setReactionPopupTimeout] = useState(null);
    const [isHoveringPopup, setIsHoveringPopup] = useState(false);

    React.useEffect(() => {
        async function fetchUser() {
            const user = await authService.getCurrentUserID();
            setCurrentUser(user);
        }
        fetchUser();
    }, []);

    React.useEffect(() => {
        async function fetchReactions() {
            if (!comment.id) return;
            const [countsRes, userRes] = await Promise.all([
                CommentService.getCommentReactionCounts(comment.id),
                currentUser ? CommentService.getUserCommentReaction(comment.id, currentUser.id) : Promise.resolve({ data: null })
            ]);
            setReactionCounts(countsRes.data || {});
            setUserReaction(userRes.data || null);
        }
        fetchReactions();
    }, [comment.id, currentUser]);

    const handleReply = async () => {
        if (!replyText.trim() || !currentUser) return;
        setReplyLoading(true);
        try {
            const replyPayload = {
                textContent: replyText,
                owner: { id: currentUser.id },
                ownerType: 'PERSON',
                postId: comment.postId,
                parentId: comment.id
            };
            await CommentService.addReply(replyPayload);
            setReplyText('');
            setShowReplyInput(false);
            setReplies([...replies, {
                ...replyPayload,
                owner: { ...currentUser },
                createdAt: Date.now(),
                id: Math.random().toString(36).slice(2) // fake id
            }]);
        } catch {
            alert('Không thể gửi trả lời');
        } finally {
            setReplyLoading(false);
        }
    };

    const handleReact = async (type) => {
        if (!currentUser) return;
        await CommentService.reactToComment(comment.id, type, currentUser.id);
        const [countsRes, userRes] = await Promise.all([
            CommentService.getCommentReactionCounts(comment.id),
            CommentService.getUserCommentReaction(comment.id, currentUser.id)
        ]);
        setReactionCounts(countsRes.data || {});
        setUserReaction(userRes.data || null);
        setShowReactionPopup(false);
    };

    const handleLikeClick = async () => {
        if (!currentUser) return;
        if (userReaction) {
            await CommentService.reactToComment(comment.id, userReaction, currentUser.id);
        } else {
            await CommentService.reactToComment(comment.id, 'LIKE', currentUser.id);
        }
        const [countsRes, userRes] = await Promise.all([
            CommentService.getCommentReactionCounts(comment.id),
            CommentService.getUserCommentReaction(comment.id, currentUser.id)
        ]);
        setReactionCounts(countsRes.data || {});
        setUserReaction(userRes.data || null);
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
        <div className="space-y-2">
            {/* Main comment */}
            <div className="flex space-x-3">
                <img
                    src={comment.owner?.avatarUrl || 'https://via.placeholder.com/40'}
                    alt={comment.owner?.userName || 'avatar'}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                        <p className="font-semibold text-sm text-gray-900">{comment.owner?.userName || 'Người dùng'}</p>
                        <p className="text-gray-900 text-sm">{comment.textContent}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{formatTime(comment.createdAt)}</span>
                        <div className="relative inline-block">
                            <button
                                className={`hover:underline font-medium flex items-center space-x-1 ${userReaction ? 'text-blue-500' : ''} cursor-pointer`}
                                onMouseDown={handleShowPopup}
                                onMouseUp={handleHidePopup}
                                onMouseLeave={handleHidePopup}
                                onClick={handleLikeClick}
                            >
                                {userReaction && reactionMap[userReaction] ? (
                                    <span>{reactionMap[userReaction]}</span>
                                ) : null}
                                <span>{userReaction && reactionLabelMap[userReaction] ? reactionLabelMap[userReaction] : 'Thích'}</span>
                            </button>
                            {showReactionPopup && (
                                <div
                                    className="absolute bottom-full left-0 mb-2 flex bg-white rounded-full shadow-lg px-3 py-2 z-50 border min-w-max overflow-visible"
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
                                            onClick={() => handleReact(opt.type)}
                                        >
                                            {opt.emoji}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="hover:underline font-medium" onClick={() => setShowReplyInput(!showReplyInput)}>Trả lời</button>
                        {/* Tổng số reaction kiểu Facebook - nằm ngang hàng action */}
                        {Object.values(reactionCounts).reduce((a, b) => a + b, 0) > 0 && (
                            <div className="flex items-center space-x-1 ml-auto select-none cursor-pointer group">
                                <div className="flex -space-x-2">
                                    {getTopReactions(reactionCounts).map((type, idx) => (
                                        <span
                                            key={type}
                                            title={reactionLabelMap[type]}
                                            className={`inline-block w-5 h-5 rounded-full bg-white border border-white shadow text-xs flex items-center justify-center z-${10-idx} group-hover:cursor-pointer`}
                                            style={{ marginLeft: idx === 0 ? 0 : -8 }}
                                        >
                                            {reactionMap[type]}
                                        </span>
                                    ))}
                                </div>
                                <span className="ml-1 text-xs text-gray-600 font-medium group-hover:cursor-pointer">
                                    {Object.values(reactionCounts).reduce((a, b) => a + b, 0)}
                                </span>
                            </div>
                        )}
                    </div>

                    {showReplyInput && (
                        <div className="flex items-center space-x-2 mt-2">
                            <img
                                src={currentUser?.avatarUrl || 'https://via.placeholder.com/40'}
                                alt="Your avatar"
                                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                            />
                            <input
                                type="text"
                                className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-sm focus:outline-none"
                                placeholder="Viết trả lời..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleReply(); }}
                                disabled={replyLoading}
                            />
                            <button
                                className="text-blue-500 font-medium px-2"
                                onClick={handleReply}
                                disabled={replyLoading}
                            >Gửi</button>
                        </div>
                    )}

                    {/* Replies */}
                    {(replies && replies.length > 0) && (
                        <div className="mt-3 space-y-2 pl-8 border-l border-gray-200">
                            {replies.map((reply) => (
                                <ReplyItem key={reply.id} reply={reply} currentUser={currentUser} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
