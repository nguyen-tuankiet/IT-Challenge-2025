import React, { useState, useEffect } from 'react';
import { Search, Edit } from 'lucide-react';
import ContactItem from "../chat/ContactItem.jsx";
import ChatWindow from "../chat/ChatWindow.jsx";
import friendService from '../../services/friendService';

export default function RightSidebar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data fallback
    const mockContacts = [
        { id: 1, name: 'Ngọc Diễm', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s', isOnline: true, lastSeen: null },
        { id: 2, name: 'Dao Nguyen', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s', isOnline: true, lastSeen: null },
        { id: 3, name: 'Đan Đan', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s', isOnline: false, lastSeen: '5 phút' },
        { id: 4, name: 'Lê Na', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s', isOnline: true, lastSeen: null },
        { id: 5, name: 'Lâm Doanh', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s', isOnline: true, lastSeen: null },
        { id: 6, name: 'Ngọc Trân', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s', isOnline: true, lastSeen: null },
        { id: 7, name: 'Xuân Trung', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s', isOnline: false, lastSeen: '53 phút' }
    ];

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem('userID');
                if (!userId) {
                    setContacts(mockContacts);
                    setLoading(false);
                    return;
                }
                const response = await friendService.getFriendsWithMutualInfo(userId);
                if (response && response.data) {
                    // Map API data to contact format
                    const mappedContacts = response.data.map(friend => ({
                        id: friend.userId || friend.id,
                        name: friend.userName || friend.name || 'Unknown',
                        avatar: friend.avatarUrl || friend.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s',
                        isOnline: friend.isOnline ?? true, // fallback true if not provided
                        lastSeen: friend.lastSeen || null
                    }));
                    setContacts(mappedContacts);
                } else {
                    setContacts(mockContacts);
                }
            } catch {
                setContacts(mockContacts);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const handleContactClick = (contact) => {
        if (!selectedContacts.find(c => c.id === contact.id)) {
            setSelectedContacts(prev => [...prev, contact]);
        }
    };

    const handleClose = (id) => {
        setSelectedContacts(prev => prev.filter(c => c.id !== id));
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-xs p-1 shadow-md bg-white fixed top-[56px] right-0 h-[calc(100vh-56px)] overflow-y-auto z-40 border-none">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <h2 className="text-gray-800 text-lg font-semibold mb-4">Người liên hệ</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm người liên hệ"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 rounded-full pl-10 pr-4 py-2 text-sm border border-gray-300 focus:bg-white focus:outline-none"
                    />
                </div>
            </div>

            {/* Contacts List */}
            <div className="p-2">
                {loading ? (
                    <div className="text-center text-gray-500 py-8">
                        <p className="text-sm">Đang tải danh sách...</p>
                    </div>
                ) : filteredContacts.length > 0 ? (
                    <div className="space-y-1">
                        {filteredContacts.map((contact) => (
                            <ContactItem key={contact.id} contact={contact} onClick={() => handleContactClick(contact)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p className="text-sm">Không tìm thấy người liên hệ</p>
                    </div>
                )}
            </div>
            {/* ChatWindow hiện khi đã chọn */}
            <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50">
                {selectedContacts.map((contact, index) => (
                    <ChatWindow
                        key={contact.id}
                        avatar={contact.avatar}
                        name={contact.name}
                        onClose={() => handleClose(contact.id)}
                        offset={index}
                    />
                ))}
            </div>
        </div>
    );
}