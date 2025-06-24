import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FriendRequestsPage from './pages/FriendRequestsPage';
import BlueTechLogin from './pages/auth/auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<BlueTechLogin />} />
        <Route
          path="/*"
          element={
            <div className="flex flex-col h-screen font-sans">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <FriendRequestsPage />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
