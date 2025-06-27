import React from 'react';
import Post from '../components/Post/Post';
import Header from "../components/Layout/Header.jsx";
import Sidebar from "../components/Layout/Sidebar.jsx";
import FriendRequestsPage from "../components/Friend/FriendRequestsPage.jsx";

const postsMock = [
    {
        id: 1,
        authorName: 'Thanh Diệu',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s',
        isFollowing: true,
        timestamp: '20 tháng 6 lúc 08:03',
        content: 'Sau cơn mưa trời lại sáng :))))))',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        likes: 56,
        comments: 4,
        shares: 1,
    },
    {
        id: 2,
        authorName: 'Nguyễn Minh',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s',
        isFollowing: false,
        timestamp: '19 tháng 6 lúc 21:15',
        content: 'Cà phê hôm nay hơi đắng, nhưng trời lại đẹp.',
        image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766',
        likes: 112,
        comments: 9,
        shares: 2,
    },
    {
        id: 3,
        authorName: 'Linh Trần',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s',
        isFollowing: true,
        timestamp: '18 tháng 6 lúc 17:45',
        content: 'Một ngày năng suất tại coworking space',
        image: 'https://images.unsplash.com/photo-1515169067865-5387ec356754',
        likes: 83,
        comments: 7,
        shares: 0,
    },
    {
        id: 4,
        authorName: 'Bảo Khánh',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s',
        isFollowing: false,
        timestamp: '17 tháng 6 lúc 13:20',
        content: 'Đi bộ dưới mưa, nghe playlist cũ, lòng nhẹ tênh...',
        image: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde',
        likes: 132,
        comments: 18,
        shares: 5,
    },
    {
        id: 5,
        authorName: 'Phương Thảo',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s',
        isFollowing: true,
        timestamp: '16 tháng 6 lúc 09:00',
        content: 'Mỗi ngày là một món quà',
        image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
        likes: 200,
        comments: 22,
        shares: 8,
    },
];


const HomePage = () => {
    return (
        <div className="flex flex-col h-screen font-sans">
            <Header/>
            <div>
                <div className="flex flex-1">
                    <Sidebar/>
                    <div className="max-w-xl mx-auto py-4">
                        {postsMock.map((post) => (
                            <div key={post.id} className="mb-6">
                                <Post/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;