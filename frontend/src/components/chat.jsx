import { useEffect, useState, useRef } from 'react';
import socket from '../utils/socket';
import axios from 'axios';

const Chat = ({ chatroomId: initialChatroomId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chatroomId, setChatroomId] = useState('');
  const [userId, setUserId] = useState('');
  const [senderType, setSenderType] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (initialChatroomId) {
      setChatroomId(initialChatroomId);
    }
  }, [initialChatroomId]);

  useEffect(() => {
    // Retrieve user data from localStorage and set userId and senderType
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUserId(storedUser.user_id || '');
      const type = (localStorage.getItem('user_role'))?.toLowerCase(); // Ensure lowercase
      if (type === 'staff' || type === 'student') {
        setSenderType(type);
      } else {
        console.error("Invalid sender type: Only 'staff' or 'student' are allowed");
      }
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  const languageMap = {
    'english': 'en',
    'hindi': 'hi',
    'bengali': 'bn',
    'telugu': 'te',
    'tamil': 'ta',
    'marathi': 'mr',
    'gujarati': 'gu',
    'kannada': 'kn',
    'malayalam': 'ml',
    'punjabi': 'pa'
  };

  const getLanguageCode = (language) => {
    const normalizedLanguage = language.toLowerCase(); // Convert to lowercase for case insensitivity
    const code = Object.keys(languageMap).find(key => key.toLowerCase() === normalizedLanguage);
    return code ? languageMap[code] : null;
  };

  const translateMessage = async (messageText, language) => {
    try {
      const languageCode = getLanguageCode(language);
      if (!languageCode) {
        console.error(`Language "${language}" not supported.`);
        return null;
      }

      const response = await axios.post('https://archcoder-hostel-management-and-greivance-redres-2eeefad.hf.space/api/translate', {
        user_message: messageText,
        target_language: languageCode,
      });
      console.log('Translated message:', response.data);
      
      return response.data.translated_message;
    } catch (error) {
      console.log('Error translating message:', error);
      console.error('Error translating message:', error);
      return null;
    }
  };





  const fetchPreviousMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://hostelmate-backend-5zcj.onrender.com/chat/${chatroomId}/messages`);
      const previousMessages = response.data.map(msg => ({
        ...msg,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        messageDate: msg.createdAt || new Date().toISOString(),
      }));
      setMessages(previousMessages);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const isChatEnabled = chatroomId && userId && senderType;

  useEffect(() => {
    if (isChatEnabled) {
      fetchPreviousMessages();

      socket.emit('joinChannel', { chatroomId, userId, senderType });
      socket.on('message', (message) => {
        // console.log('New message received:', message);
        // Only add messages from other users
        if (message && message.sender_type !== senderType) {
          setMessages((prevMessages) => [...prevMessages, {
            ...message,
            timestamp: new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            messageDate: message.createdAt,
          }]);
        }
      });
      return () => {
        socket.off('message');
      };
    }
  }, [chatroomId, userId, senderType, isChatEnabled]);

  useEffect(() => {
    // Scroll to the latest message when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && isChatEnabled) {
      const messageDate = new Date().toISOString();
      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newMessage = {
        sender_type: senderType, // Match API response format
        message_content: inputValue, // Match API response format
        timestamp,
        createdAt: messageDate,
      };

      socket.emit('event:message', { chatroomId, message: newMessage });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputValue('');
    }
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex items-center justify-center h-[90%]">
          <p className="text-gray-500 text-lg">No messages yet</p>
        </div>
      );
    }

    let lastDate = '';
    console.log("messages", messages);

    return messages.map((msg, index) => {
      const messageDate = formatDate(msg.createdAt || msg.messageDate);
      const shouldRenderDate = messageDate !== lastDate && messageDate !== '';
      const isCurrentUser = msg.sender_type === senderType;

      if (shouldRenderDate) {
        lastDate = messageDate;
      }

      const handleTranslateClick = async (msg) => {
        if (msg.translated_content) {
          // If the message is already translated, toggle back to original
          setMessages((prevMessages) =>
            prevMessages.map((m) =>
              m._id === msg._id ? { ...m, showOriginal: !m.showOriginal } : m
            )
          );
        } else {
          // Otherwise, fetch the translation
          // pick language from localstorage from user object
          const language = JSON.parse(localStorage.getItem('user'))?.language_preference || 'english';
          const translatedText = await translateMessage(msg.message_content, language);
          if (translatedText) {
            setMessages((prevMessages) =>
              prevMessages.map((m) =>
                m._id === msg._id ? { ...m, translated_content: translatedText, showOriginal: false } : m
              )
            );
          }
        }
      };



      return (
        <div key={index}>
          {shouldRenderDate && (
            <div className="text-center mb-2 text-gray-600 font-semibold">
              {messageDate}
            </div>
          )}
          <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`relative max-w-xs min-w-[120px] p-3 rounded-lg flex justify-between items-end ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
            >
              <p className="text-sm break-words flex-1 pr-4">
                {msg.showOriginal ? msg.message_content : msg.translated_content || msg.message_content}
              </p>
              <span className={`text-xs ${isCurrentUser ? 'text-gray-200' : 'text-gray-400'} whitespace-nowrap`}>{msg.timestamp}</span>
              {!isCurrentUser && (<button
                onClick={() => handleTranslateClick(msg)}
                className="ml-2 text-xs text-blue-500 hover:underline"
              >
                {msg.translated_content && !msg.showOriginal ? 'Original' : 'Translate'}
              </button>)}
            </div>
          </div>

        </div>
      );
    });
  };


  return (
    <div className="flex flex-col h-full bg-gray-100 p-4">
      {/* <div className="mb-4">
        {/* <input
          type="text"
          value={chatroomId}
          onChange={(e) => setChatroomId(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-2 w-full"
          placeholder="Enter Chatroom ID"
        /> */}
        {/* <input
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
        /> */}
      {/* </div> */}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 h-1/2">
        {loading ? (
          <div className="text-center">Loading previous messages...</div>
        ) : (
          <>
            {renderMessages()}
            {/* Reference to scroll into view */}
            <div ref={messagesEndRef} />
          </>
        )}
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