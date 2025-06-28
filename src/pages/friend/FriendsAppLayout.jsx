import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import FriendSidebar from '../../components/Layout/SideBarFriend';
import FriendRequestsSection from '../../components/Friend/FriendRequestsPage';
import SuggestedFriendsSection from '../../components/Friend/SuggestedFriendsCardPage';
import AllFriendsPage from '../../components/Friend/AllFriendsPage';

const FriendsAppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  // Map URL paths to section IDs
  const pathToSection = {
    '/friends': 'home',
    '/friends/requests': 'requests',
    '/friends/suggestions': 'suggestions',
    '/friends/list': 'all-friends'
  };

  // Map section IDs to URL paths
  const sectionToPath = {
    'home': '/friends',
    'requests': '/friends/requests',
    'suggestions': '/friends/suggestions',
    'all-friends': '/friends/list'
  };

  // Update active section based on current URL
  useEffect(() => {
    const currentPath = location.pathname;
    const section = pathToSection[currentPath];
    if (section) {
      setActiveSection(section);
    } else {
      // Default to home if path doesn't match
      setActiveSection('home');
    }
  }, [location.pathname]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    const path = sectionToPath[sectionId];
    if (path) {
      navigate(path);
    }
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'home':
        return (
          <div>
            <FriendRequestsSection />
            <div className="mt-8">
              <SuggestedFriendsSection />
            </div>
          </div>
        );
      case 'requests':
        return <FriendRequestsSection />;
      case 'suggestions':
        return <SuggestedFriendsSection />;
      case 'all-friends':
        return <AllFriendsPage />;
      case 'birthdays':
        return (
          <div className="ml-4 mt-4">
            <h2 className="text-xl font-semibold mb-4">Sinh nhật</h2>
            <p className="text-gray-500">Chức năng này sẽ được phát triển sau...</p>
          </div>
        );
      case 'custom-lists':
        return (
          <div className="ml-4 mt-4">
            <h2 className="text-xl font-semibold mb-4">Danh sách tuỳ chỉnh</h2>
            <p className="text-gray-500">Chức năng này sẽ được phát triển sau...</p>
          </div>
        );
      default:
        return <FriendRequestsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="flex gap-4 py-4 px-4">
        {/* Sidebar */}
        <div className="flex-shrink-0 w-[280px]">
          <FriendSidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange} 
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FriendsAppLayout;