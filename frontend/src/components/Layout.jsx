import { Outlet } from 'react-router-dom';
import ChatBubble from './ChatBubble';
import HomePage from './HomePage';
import Navbar from './Navbar';
const Layout = () => {
  return (
    <div className="">
      <Navbar />
      <div className="h-16 md:h-20"></div>
      <main className="relative min-h-min">
        <Outlet />
        
      </main>
    </div>
  );
};

export default Layout;