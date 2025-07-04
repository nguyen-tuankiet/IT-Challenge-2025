import React, { useState, useEffect, useRef, useCallback } from 'react';
import Post from '../components/post/Post';
import Header from "../components/Layout/Header.jsx";
import Sidebar from "../components/Layout/SideBarFriend.jsx";
import CreatePostModal from "../components/post/CreatePostModal.jsx";
import RightSidebar from "../components/Layout/RightSideBar.jsx";
import PostService from '../services/PostService'; // Adjust path as needed
import authService from '../services/authService'; // Import authService
import LeftSideBarHome from "../components/Layout/LeftSideBarHome";

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [userInfo, setUserInfo] = useState(null); // Add userInfo state
    const loaderRef = useRef(null);

    // Fetch user info on mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await authService.getCurrentUserID();
                setUserInfo(user);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);

    // Function to fetch posts
    const fetchPosts = async (pageNum = 0, reset = false) => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userID');
            const response = await PostService.getFeed(pageNum, 10, 'createdAt', 'DESC', userId);
            
            if (response.code === 200) {
                const newPosts = response.data.map(post => ({
                    id: post.id,
                    authorId: post.owner.id,
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
    }, []);

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
                <Header />
                <div className="flex flex-1 overflow-hidden mt-[56px]">
                    <Sidebar />
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
                    <RightSidebar />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen font-sans bg-[#f0f2f5]">
            <Header />
            <div className="flex flex-1 overflow-hidden mt-[56px] w-full justify-center">
                {/* Sidebar trái */}
                <div className="w-[320px] flex-shrink-0">
                    <LeftSideBarHome />
                </div>
                {/* Feed ở giữa */}
                <div className="flex-1 flex justify-center min-w-0">
                    <div className="w-full max-w-[600px] px-4 py-4 mb-4">
                        <div className="mb-4 bg-white rounded-lg ">
                            <CreatePostModal 
                                onPostCreated={handlePostCreated} 
                                avatar={userInfo?.avatarUrl} 
                                name={userInfo?.userName} 
                            />
                        </div>
                        {loading && posts.length === 0 ? (
                            <div className="text-center">
                                <p>Đang tải bài viết...</p>
                            </div>
                        ) : (
                            <>
                                {posts.map((post) => (
                                    <div key={post.id} className="mb-4 bg-white rounded-lg">
                                        <Post data={post} />
                                    </div>
                                ))}
                                {/* Infinite scroll loader */}
                                <div ref={loaderRef} />
                                {posts.length === 0 && !loading && (
                                    <div className="text-center">
                                        <p className="text-gray-500">Chưa có bài viết nào</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {/* Sidebar phải */}
                <div className="w-[320px] flex-shrink-0 ">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default HomePage;