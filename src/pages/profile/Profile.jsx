import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import Header from "../../components/Layout/Header.jsx";
import ProfileHeader from "../../components/profile/ProfileHeader.jsx";
import CreatePostModal from "../../components/post/CreatePostModal.jsx";
import Post from "../../components/post/Post.jsx";
import LeftSideBarProfile from "../../components/profile/LeftSideBarProfile.jsx";
import FriendsLayout from "../../components/profile/FriendsLayout.jsx";
import PostService from "../../services/PostService.js";
import UserService from "../../services/UserService.js";
import friendService from "../../services/friendService.js";

const Profile = () => {
    const {userId} = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [userInfo, setUserInfo] = useState(null); // Add userInfo state
    const loaderRef = useRef(null);
    const [showFriendsPage, setShowFriendsPage] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friendCount, setFriendCount] = useState(0);
    const [mutualFriend, setMutualFriend] = useState(0);
    const currentUserId = localStorage.getItem('userID');

    // Mỗi khi userId thay đổi (sang profile mới), reset trạng thái showFriendsPage
    useEffect(() => {
        setShowFriendsPage(false);
    }, [userId]);

    // Fetch user info on mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await UserService.getUserById(userId);
                if (response.code === 200) {
                    setUserInfo(response.data); // Chỉ set phần "data"
                } else {
                    console.error('Failed to fetch user info:', response.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [userId]);


    useEffect(() => {
        const fetchFriends = async () => {
            try {

                if (!userId) {
                    console.warn('No user ID found');
                    setLoading(false);
                    return;
                }

                // Fetch friends from API
                const response = await friendService.getFriendsWithMutualInfo(userId);
                if (response.code === 200) {
                    setFriends(response.data.map(friend => ({
                        id: friend.id,
                        userName: friend.userName,
                        avatarUrl: friend.avatarUrl,
                        mutualFriendsCount: friend.mutualFriendsCount
                    })));
                    setFriendCount(response.data.length);
                } else {
                    setFriendCount(0);
                    console.error('Failed to fetch friends:', response.message || 'Unknown error');
                }

            } catch (err) {
                console.error('Error fetching friends:', err);
                setError('Không thể tải danh sách bạn bè. Đang sử dụng dữ liệu mẫu.');
            }
        };

        const fetchMutualFriends = async () => {
            try {
                if (userId === currentUserId) {
                    setMutualFriend(0);
                } else {

                    // Fetch friends from API
                    const response = await friendService.getMutualFriends(currentUserId, userId);
                    if (response.code === 200) {
                        setMutualFriend(response.data.length);
                    } else {
                        setMutualFriend(0);
                        console.error('Failed to fetch friends:', response.message || 'Unknown error');
                    }
                }

            } catch (err) {
                console.error('Error fetching friends:', err);
                setError('Không thể tải danh sách bạn bè. Đang sử dụng dữ liệu mẫu.');
            }
        };


        fetchFriends();
        fetchMutualFriends();
    }, [userId]);

    // Function to fetch posts
    const fetchPosts = async (pageNum = 0, reset = false) => {
        try {
            setLoading(true);
            const response = await PostService.getFeedByOwner(userId, pageNum, 10, 'createdAt', 'DESC');

            if (response.code === 200) {
                const newPosts = response.data.map(post => ({
                    id: post.id,
                    authorName: post.owner.userName,
                    avatar: post.owner.avatarUrl,
                    isFollowing: false, // You might want to add this logic based on your follow system
                    timestamp: new Date(post.createdAt).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    content: post.textContent,
                    image: post.image && post.image.length > 0 ? post.image.map(img => img.url) : null,
                    likes: post.noOfReactions,
                    comments: post.noOfComments,
                    shares: 0, // Add shares if available in your API
                    views: post.noOfViews,
                    isReacted: post.isReacted,
                    userReactionType: post.userReactionType,
                    reactionCounts: post.reactionCounts,
                    violationDetected: post.violationDetected,
                    originalPost: post // Keep original post data for any additional needs
                }));

                if (reset) {
                    setPosts(newPosts);
                    setPage(0); // Reset page counter
                } else {
                    setPosts(prev => [...prev, ...newPosts]);
                }

                // Check if there are more posts to load
                setHasMore(newPosts.length === 10);
            } else {
                setError('Failed to fetch posts');
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Error loading posts');
        } finally {
            setLoading(false);
        }
    };

    // Load initial posts
    useEffect(() => {
        fetchPosts(0, true);
    }, [userId]);

    // Infinite scroll: load more when reaching bottom
    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage, false);
        }
    }, [loading, hasMore, page]);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };
        const observer = new window.IntersectionObserver(handleObserver, option);
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [handleObserver]);

    // Function to refresh posts - enhanced version
    const refreshPosts = async () => {
        console.log('Refreshing posts...');
        setError(null); // Clear any existing errors
        setPage(0);
        setHasMore(true);

        try {
            await fetchPosts(0, true);
            console.log('Posts refreshed successfully');
        } catch (error) {
            console.error('Error refreshing posts:', error);
            setError('Không thể tải lại bài viết');
        }
    };

    // Handle post creation callback
    const handlePostCreated = async () => {
        console.log('New post created, refreshing feed...');
        // Small delay to ensure the post is saved on the backend
        setTimeout(() => {
            refreshPosts();
        }, 500);
    };

    if (error) {
        return (
            <div className="flex flex-col min-h-screen font-sans bg-[#f0f2f5]">
                <Header/>
                <div className="flex flex-1 overflow-hidden mt-[56px]">
                    <div className="flex-[1] min-w-0">
                        <div className="w-full max-w-2xl p-4">
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <p className="text-red-500 mb-4">{error}</p>
                                <button
                                    onClick={refreshPosts}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang tải...' : 'Thử lại'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-100">
            <Header/>
            {/*<ProfileHeader user={userInfo} friendCount={friendCount} />*/}
            <ProfileHeader userInfo={userInfo} userId={userId} friendCount={friendCount} mutualFriend={mutualFriend}/>
            {showFriendsPage ? (
                <div className="flex justify-center w-full">
                    <div className="w-full max-w-[1000px] p-4">
                        <FriendsLayout userId={userId} friends={friends} onBack={() => setShowFriendsPage(false)} />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center w-full">
                    <div className="flex w-full max-w-[1000px] gap-4 px-4 py-4">
                        {/* Sidebar trái */}
                        <div className="w-[320px] flex-shrink-0">
                            <div className="sticky top-[56px]">
                                <LeftSideBarProfile userId={userId} userInfo={userInfo} friendCount={friendCount} friends={friends}
                                                    mutualFriend={mutualFriend}
                                                    onViewAllFriends={() => setShowFriendsPage(true)}/>
                            </div>
                        </div>

                        {/* Feed ở giữa */}
                        <div className="flex-1 min-w-0">
                            <div className="w-full">
                                {/* Post form */}
                                {currentUserId === userId && (
                                    <div className="mb-4 bg-white rounded-lg">
                                        <CreatePostModal
                                            onPostCreated={handlePostCreated}
                                            avatar={userInfo?.avatarUrl || "https://th.bing.com/th/id/R.22dbc0f5e5f5648613f0d1de3ea7ae0a?rik=k6HQ45uVGe81rw&pid=ImgRaw&r=0"}
                                            name={userInfo?.userName}
                                        />
                                    </div>
                                )}

                                {/* Post list */}
                                {loading && posts.length === 0 ? (
                                    <div className="text-center">
                                        <p>Đang tải bài viết...</p>
                                    </div>
                                ) : (
                                    <>
                                        {posts.map((post) => (
                                            <div key={post.id} className="mb-4 bg-white rounded-lg">
                                                <Post data={post}/>
                                            </div>
                                        ))}
                                        <div ref={loaderRef}/>
                                        {posts.length === 0 && !loading && (
                                            <div className="text-center">
                                                <p className="text-gray-500">Chưa có bài viết nào</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )};
        </div>
    );
};
export default Profile