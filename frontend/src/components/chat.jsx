import { useEffect, useState } from 'react';
import socket from '../utils/socket';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Input state for chatroomId, userId, and senderType
  const [chatroomId, setChatroomId] = useState('');
  const [userId, setUserId] = useState('');
  const [senderType, setSenderType] = useState('');

  // Only enable messages if all required fields are filled
  const isChatEnabled = chatroomId && userId && senderType;

  useEffect(() => {
    if (isChatEnabled) {
      // Join the chatroom once all required fields are filled
      socket.emit('joinChannel', { chatroomId, userId, senderType });

      // Listen for messages from the server
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
      const currentDate = new Date();
      const timestamp = currentDate.toLocaleString(); // Get formatted date and time

      const newMessage = {
        senderType, // Assuming senderType is either 'student' or 'staff'
        messageText: inputValue,
        timestamp, // Add timestamp to message
      };

      // Send message to server
      socket.emit('event:message', {
        chatroomId,
        message: newMessage,
      });

      // Add the message to the local messages array immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear the input field
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Input Section for Chatroom ID, User ID, and Sender Type */}
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

      {/* Header */}
      <div className="flex items-center justify-between py-3 px-4 bg-white shadow rounded-lg mb-4">
        <button className="text-blue-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-800">USER_NAME</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index}>
            {/* Display the dynamic timestamp */}
            <p className="text-center text-sm text-gray-500 my-2">
              {msg.timestamp}
            </p>
            <div
              className={`flex ${msg.senderType === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.senderType !== 'student' && (
                <img
                  src="https://via.placeholder.com/40" // Placeholder avatar
                  alt="User avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.senderType === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">
                  <strong>{msg.senderType === 'student' ? 'Student' : 'USER_NAME'}:</strong> {msg.messageText}
                </p>
              </div>
              {msg.senderType === 'student' && (
                <img
                  src="https://via.placeholder.com/40" // Placeholder avatar
                  alt="User avatar"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="flex items-center bg-white p-2 rounded-lg shadow">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 p-2 text-gray-700 rounded-full focus:outline-none"
          placeholder="send message"
          disabled={!isChatEnabled}
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-full ml-2"
          disabled={!isChatEnabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;
