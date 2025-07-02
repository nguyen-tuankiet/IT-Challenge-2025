import React, { useState } from 'react';
import CommentService from '../../services/CommentService';
import authService from '../../services/authService';

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

export default function CommentItem({ comment }) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);
    const [replies, setReplies] = useState(comment.replies || []);
    const [currentUser, setCurrentUser] = useState(null);

    React.useEffect(() => {
        async function fetchUser() {
            const user = await authService.getCurrentUserID();
            setCurrentUser(user);
        }
        fetchUser();
    }, []);

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
                        <button className="hover:underline font-medium">Thích</button>
                        <button className="hover:underline font-medium" onClick={() => setShowReplyInput(!showReplyInput)}>Trả lời</button>
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
                                <div key={reply.id} className="flex space-x-3">
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
                                            <button className="hover:underline font-medium">Thích</button>
                                            <button className="hover:underline font-medium">Trả lời</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
