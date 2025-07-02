import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FriendRequestsPage from './pages/friend/FriendsAppLayout';
import BlueTechLogin from './pages/auth/auth';
import HomePage from './pages/HomePage';
import Profile from "./pages/profile/Profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<BlueTechLogin />} />
        <Route path="/register" element={<BlueTechLogin />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route path="/friends" element={<FriendRequestsPage />} />
        <Route path="/friends/requests" element={<FriendRequestsPage />} />
        <Route path="/friends/suggestions" element={<FriendRequestsPage />} />
        <Route path="/friends/list" element={<FriendRequestsPage />} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;