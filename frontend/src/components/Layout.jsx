import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ChatBubble from './ChatBubble';

const Layout = () => {
  return (
    <div className="">
      <Navbar />
      <div className="h-16 md:h-20"></div>
      <main className="relative min-h-min">
        <Outlet />
        <ChatBubble />
      </main>
    </div>
  );
};

export default Layout;