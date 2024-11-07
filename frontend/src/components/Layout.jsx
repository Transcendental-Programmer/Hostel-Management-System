import { Outlet } from 'react-router-dom';
import Nav2 from './Nav2';
import ChatBubble from './ChatBubble';
import HomePage from './HomePage';
import Navbar from './Navbar';
const Layout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative">
        <Outlet />
        <ChatBubble />
        
      </main>
    </div>
  );
};

export default Layout;