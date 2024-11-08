import { useState } from 'react';
import Chat from './chat';
import { useAuth } from '../utils/Auth';

const ChatBubble = ({ chatroomId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { authToken } = useAuth();
  const userRole = localStorage.getItem('user_role');
  const allowedRoles = ['student', 'staff'];

  if (!authToken || !allowedRoles.includes(userRole)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[90vh]">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">
              Chat with {userRole === 'staff' ? 'Student' : 'Staff'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ✕
            </button>
          </div>
          <div className="h-[calc(90vh-64px)]">
            <Chat chatroomId={chatroomId} />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg relative group"
        >
          <span className="absolute bottom-full mb-2 hidden px-3 py-1 text-xs text-white bg-blue-600 rounded opacity-0 group-hover:block group-hover:opacity-100 transition-opacity whitespace-nowrap right-0">
            Chat with {userRole === 'staff' ? 'Student' : 'Staff'}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatBubble;