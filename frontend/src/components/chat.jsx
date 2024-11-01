import { useEffect, useState } from 'react';
import socket from '../utils/socket';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chatroomId, setChatroomId] = useState('');
  const [userId, setUserId] = useState('');
  const [senderType, setSenderType] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isChatEnabled = chatroomId && userId && senderType;

  useEffect(() => {

    setCurrentDate(formatDate(new Date()));

    if (isChatEnabled) {
      socket.emit('joinChannel', { chatroomId, userId, senderType });
      socket.on('message', (message) => {

        const messageDate = formatDate(new Date(message.timestamp));
        
        // Update the currentDate only if the message is from a new day
        if (messageDate !== currentDate) {
          setCurrentDate(messageDate);
        }

        setMessages((prevMessages) => [...prevMessages, message]);
      });
      return () => {
        socket.off('message');
      };
    }
  }, [chatroomId, userId, senderType, isChatEnabled]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && isChatEnabled) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newMessage = {
        senderId: userId,
        senderType,
        messageText: inputValue,
        timestamp,
      };

      socket.emit('event:message', { chatroomId, message: newMessage });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputValue('');



      // Check if the date has changed before updating currentDate
      const messageDate = formatDate(now);
      if (messageDate !== currentDate) {
        setCurrentDate(messageDate);
      }
    }
  };

  return (
    
    <div className="flex flex-col h-screen bg-gray-100 p-4">
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

      <div className="text-center mb-2 text-gray-600 font-semibold">
        {currentDate}
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative max-w-xs min-w-[120px] p-3 rounded-lg flex justify-between items-end ${
                msg.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
            >
              <p className="text-sm break-words flex-1 pr-4">
                {msg.messageText}
              </p>
              <span className="text-xs text-gray-300 whitespace-nowrap">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex items-center bg-white p-2 rounded-lg shadow">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 p-2 text-gray-700 rounded-full focus:outline-none"
          placeholder="Send message"
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
