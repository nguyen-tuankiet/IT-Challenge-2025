import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FriendRequestsPage from './pages/FriendRequestsPage';

function App() {
  return (
    <div className="flex flex-col h-screen font-sans">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <FriendRequestsPage />
      </div>
    </div>
  );
}

export default App;
