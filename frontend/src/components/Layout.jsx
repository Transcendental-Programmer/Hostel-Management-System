import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ChatBubble from './ChatBubble';

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