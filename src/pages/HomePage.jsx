import React from 'react';
import Post from '../components/Post/Post';
import Header from "../components/Layout/Header.jsx";
import Sidebar from "../components/Layout/SideBarFriend.jsx";
import CreatePostModal from "../components/Post/CreatePostModal.jsx";
import RightSidebar from "../components/Layout/RightSideBar.jsx";

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
        image: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
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
        image: 'https://file.hstatic.net/200000503583/file/tao-dang-chup-anh-hoang-hon__16__10333e3c0dfd420687e73b8e01e74342.jpg',
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
        image: 'https://statictuoitre.mediacdn.vn/thumb_w/640/2017/12-1512755474968.jpg',
        likes: 200,
        comments: 22,
        shares: 8,
    },
];


const HomePage = () => {
    return (
        <div className="flex flex-col h-screen font-sans">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-[1] min-w-0">
                    <Sidebar />
                </div>

                <div className="flex-[2] min-w-0 overflow-y-auto px-6 py-4">
                    <div className="mb-6">
                        <CreatePostModal
                            avatar='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7iTZzRb7Z_r3Qmfd4iD4PhVIDwbbaC0Aw&s'
                            name='Thanh Diệu'
                        />
                    </div>
                    {postsMock.map((post) => (
                        <div key={post.id} className="mb-6">
                            <Post data={post} />
                        </div>
                    ))}
                </div>

                <div className="flex-[1] min-w-0">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default HomePage;