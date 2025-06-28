import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FriendRequestsPage from './pages/friend/FriendsAppLayout';
import BlueTechLogin from './pages/auth/auth';
import HomePage from './pages/HomePage.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<BlueTechLogin/>}/>
                    <Route path="/friends" element={<FriendRequestsPage/>}/>
                <Route path="/" element={<HomePage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
