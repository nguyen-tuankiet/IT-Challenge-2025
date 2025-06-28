import React from 'react';

export default function CommentItem({ comment }) {
    return (
        <div className="space-y-2">
            {/* Main comment */}
            <div className="flex space-x-3">
                <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                        <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
                        <p className="text-gray-900 text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{comment.timestamp}</span>
                        <button className="hover:underline font-medium">Thích</button>
                        <button className="hover:underline font-medium">Trả lời</button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 space-y-2 pl-8 border-l border-gray-200">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex space-x-3">
                                    <img
                                        src={reply.avatar}
                                        alt={reply.author}
                                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="bg-gray-100 rounded-2xl px-3 py-2">
                                            <p className="font-semibold text-sm text-gray-900">{reply.author}</p>
                                            <p className="text-gray-900 text-sm">{reply.content}</p>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                            <span>{reply.timestamp}</span>
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
