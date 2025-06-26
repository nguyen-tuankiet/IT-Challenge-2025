import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FriendRequestsPage from './pages/friend/FriendsAppLayout';
import BlueTechLogin from './pages/auth/auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<BlueTechLogin />} />
        <Route
          path="/friends" element ={<FriendRequestsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
