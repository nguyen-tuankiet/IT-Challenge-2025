import React, { useState, useEffect } from 'react';
import FriendCard from './FriendCard';
import friendService from '../../services/FriendService';

const mockData = [
  { name: 'Nguyen Huyen', mutuals: 1, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Minh Anh', mutuals: 0, image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: 'Huyền Linh Trần', mutuals: 1, image: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { name: 'Trịnh Nhật Thanh', mutuals: 4, image: 'https://randomuser.me/api/portraits/men/38.jpg' },
  { name: 'Khánh Vy', mutuals: 43, image: 'https://randomuser.me/api/portraits/men/39.jpg'}
];

const FriendRequestsPage = ({ friendRequests = null }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Helper function to get current user ID from localStorage
  const getCurrentUserId = () => {
    return localStorage.getItem('userID');
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        // If friendRequests prop is provided, use it
        if (friendRequests) {
          setRequests(friendRequests);
          setLoading(false);
          return;
        }

        // Get user ID from localStorage
        const userId = getCurrentUserId();
        
        if (!userId) {
          console.warn('No user ID found in localStorage, using mock data');
          setRequests(mockData);
          setLoading(false);
          return;
        }

        // Fetch pending invites from API
        const response = await friendService.getPendingInvites(userId);
        
        if (response && response.data) {
          // Transform API response to match component expectations
          const transformedRequests = response.data.map(invite => ({
            id: invite.id,
            senderId: invite.inviter.id,
            name: invite.inviter.userName || 'Unknown User',
            mutuals: invite.mutualFriendsCount || 0,
            image: invite.inviter.avatarUrl || `https://th.bing.com/th/id/R.22dbc0f5e5f5648613f0d1de3ea7ae0a?rik=k6HQ45uVGe81rw&pid=ImgRaw&r=0`,
            createdAt: invite.updatedAt,
            status: invite.status
          }));
          
          setRequests(transformedRequests);
        } else {
          // If no data returned, use empty array
          setRequests([]);
        }
      } catch (err) {
        console.error('Error fetching friend requests:', err);
        setError('Không thể tải lời mời kết bạn. Đang sử dụng dữ liệu mẫu.');
        setRequests(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [friendRequests]);

  const handleAcceptRequest = async (requestId, senderId) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      await friendService.addFriend(senderId, userId);
      
      // Remove the accepted request from the list
      setRequests(prev => prev.filter(req => req.id !== requestId));
      
      // You might want to show a success message here
      console.log('Friend request accepted successfully');
    } catch (err) {
      console.error('Error accepting friend request:', err);
      setError('Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      // Remove the rejected request from the list
      // Note: You might need to implement a reject API endpoint
      setRequests(prev => prev.filter(req => req.id !== requestId));
      
      console.log('Friend request rejected');
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      setError('Không thể từ chối lời mời kết bạn. Vui lòng thử lại.');
    }
  };

  const displayedRequests = showAll ? requests : requests.slice(0, 10);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="text-gray-500">Đang tải lời mời kết bạn...</div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 ml-4 mt-4">Lời mời kết bạn</h2>

      {error && (
        <div className="mx-4 mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
          {error}
        </div>
      )}

      {requests.length === 0 && !loading && (
        <div className="text-center mt-8">
          <p className="text-gray-500">Không có lời mời kết bạn nào</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-4 mr-4">
        {displayedRequests.map((friend, index) => (
          <FriendCard 
            key={friend.id || index} 
            avatar={friend.image} 
            name={friend.name} 
            mutualFriends={friend.mutuals}
            onAccept={() => handleAcceptRequest(friend.id, friend.senderId)}
            onReject={() => handleRejectRequest(friend.id)}
            showActions={true}
          />
        ))}
      </div>

      {!showAll && requests.length > 10 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 font-medium hover:underline"
          >
            Xem thêm 
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendRequestsPage;