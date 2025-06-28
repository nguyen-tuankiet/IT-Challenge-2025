import React, {useState} from 'react';
import {Phone, Video, Minus, X, Smile, Image, Mic, Send, Heart} from 'lucide-react';

export default function ChatWindow({avatar, name, onClose, offset}) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const bottomOffset = 25 + offset * 68;
    const [messages, setMessages] = useState([
        {id: 1, text: 'Sos', sender: 'other', time: '15:37', type: 'text'},
        {id: 2, text: 'Ngủ mới dậy', sender: 'other', time: '15:37', type: 'text'},
        {id: 3, text: '😘😘', sender: 'other', time: '15:37', type: 'emoji'},
        {id: 4, text: 'mas deo oonr deo oonr', sender: 'me', time: '15:40', type: 'text'},
        {id: 5, text: 'ohnooo', sender: 'other', time: '15:42', type: 'text'},
        {id: 6, text: 'cuutoi cu toi', sender: 'other', time: '15:43', type: 'text'},
        {id: 7, text: '4h rồi', sender: 'other', time: '15:45', type: 'text'}
    ]);

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, {
                id: messages.length + 1,
                text: message,
                sender: 'me',
                time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}),
                type: 'text'
            }]);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 group" style={{bottom: `${bottomOffset}px`}}>
                <div className="relative flex items-center">
                    <div
                        className="absolute right-full mr-3 hidden group-hover:flex flex-col items-start bg-black text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                        <div className="font-semibold">{name}</div>
                    </div>

                    <img
                        src={avatar}
                        alt={name}
                        className="w-12 h-12 rounded-full shadow-md cursor-pointer"
                        onClick={() => setIsMinimized(false)}
                    />
                    <button
                        onClick={onClose}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 text-gray-100 hidden group-hover:flex rounded-full flex items-center justify-center text-xs hover:bg-gray-700"
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed bottom-0 right-4 w-80 bg-white border border-gray-300 rounded-t-lg shadow-lg flex flex-col h-96">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <img
                            src={avatar}
                            alt={name}
                            className="w-8 h-8 rounded-full"
                        />
                        <div
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 text-sm">{name}</div>
                        <div className="text-green-500 text-xs">Đang hoạt động</div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Minus className="w-4 h-4 text-gray-600"/>
                    </button>
                    <button onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-4 h-4 text-gray-600"/>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                {/* Time indicator */}
                <div className="text-center text-xs text-gray-500 py-2">
                    15:37
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'other' && (
                            <img
                                src={avatar}
                                alt={name}
                                className="w-6 h-6 rounded-full mr-2 mt-1"
                            />
                        )}
                        <div className={`max-w-xs px-3 py-2 rounded-2xl ${
                            msg.sender === 'me'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                        }`}>
                            {msg.type === 'emoji' ? (
                                <span className="text-2xl">{msg.text}</span>
                            ) : (
                                <span className="text-sm">{msg.text}</span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Seen indicator */}
                <div className="flex justify-end">
                    <img
                        src={avatar}
                        alt="Seen"
                        className="w-4 h-4 rounded-full"
                    />
                </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Mic className="w-4 h-4 text-gray-600"/>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Image className="w-4 h-4 text-gray-600"/>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <span className="text-sm font-bold text-gray-600">GIF</span>
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Aa"
                            className="w-full bg-gray-100 text-gray-900 rounded-full px-4 py-2 text-sm border-none outline-none focus:bg-gray-200 transition-colors"
                        />
                        <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <Smile className="w-4 h-4 text-gray-600"/>
                        </button>
                    </div>

                    {message.trim() ? (
                        <button
                            onClick={sendMessage}
                            className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                        >
                            <Send className="w-4 h-4 text-blue-600"/>
                        </button>
                    ) : (
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Heart className="w-4 h-4 text-blue-600"/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}