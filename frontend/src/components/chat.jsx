// src/components/Chat.jsx
import { useEffect, useState } from 'react';
import socket from '../utils/socket';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Replace with your dynamic values
  const chatroomId = '671e9b0d89d7878af4b07adf'; // Chatroom ID
  const userId = 'cceb3554-b731-4bc7-b9e1-643c57c86c2b'; // Actual User ID
  const senderType = 'student'; // or 'staff' based on user type

  useEffect(() => {
    // Join the chatroom on mount
    socket.emit('joinChannel', { chatroomId, userId, senderType });

    // Listen for messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up on unmount
    return () => {
      socket.off('message');
    };
  }, [chatroomId, userId, senderType]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
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
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2">
            <div className="bg-blue-200 p-2 rounded-lg">
              {msg.messageText}
            </div>
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
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-lg">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
