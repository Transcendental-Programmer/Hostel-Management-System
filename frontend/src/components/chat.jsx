// src/components/Chat.jsx
import { useEffect, useState } from 'react';
import socket from '../utils/socket';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Input state for chatroomId, userId, and senderType
  const [chatroomId, setChatroomId] = useState('');
  const [userId, setUserId] = useState('');
  const [senderType, setSenderType] = useState('');


  //sample data 
  // const chatroomId = '671e9b0d89d7878af4b07adf'; // Chatroom ID
  // const userId = 'cceb3554-b731-4bc7-b9e1-643c57c86c2b'; // Actual User ID
  // const senderType = 'student'; // or 'staff' based on user type


  // Only enable messages if all required fields are filled
  const isChatEnabled = chatroomId && userId && senderType;

  useEffect(() => {
    if (isChatEnabled) {
      // Join the chatroom once all required fields are filled
      socket.emit('joinChannel', { chatroomId, userId, senderType });

      // Listen for messages
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Clean up on unmount
      return () => {
        socket.off('message');
      };
    }
  }, [chatroomId, userId, senderType, isChatEnabled]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && isChatEnabled) {
      // Send message to server
      socket.emit('event:message', {
        chatroomId,
        message: {
          messageText: inputValue,
        },
      });
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <input
          type="text"
          value={chatroomId}
          onChange={(e) => setChatroomId(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-2 w-full"
          placeholder="Enter Chatroom ID"
        />
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-2 w-full"
          placeholder="Enter User ID"
        />
        <input
          type="text"
          value={senderType}
          onChange={(e) => setSenderType(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-4 w-full"
          placeholder="Enter Sender Type (e.g., 'student' or 'staff')"
        />
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          console.log(msg),
          <div
            key={index}
            className={`p-2 mb-2 rounded-lg ${msg.senderType === 'student' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
              }`}
          >
            <strong>{msg.senderType === 'student' ? 'Student' : 'Staff'}:</strong> {msg.messageText}
          </div>
        ))}

      </div>

      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          placeholder="Type your message..."
          disabled={!isChatEnabled} // Disable input until required fields are filled
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg"
          disabled={!isChatEnabled} // Disable button until required fields are filled
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
