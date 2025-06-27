import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FriendRequestsPage from './pages/friend/FriendsAppLayout';
import BlueTechLogin from './pages/auth/auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<BlueTechLogin />} />
        <Route path="/register" element={<BlueTechLogin />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route
          path="/friends" element={<FriendRequestsPage/>}
        />
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;