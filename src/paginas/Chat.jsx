import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  const socketRef = useRef();
  const lastTypingTime = useRef();
  const messagesEndRef = useRef();
  
  const authData = JSON.parse(localStorage.getItem('auth')) || {};
  const username = authData.usuario || 'Anonymous';
  const userProfileImg = authData.fotoPerfil || '/images/defaultprofile.jpg';

  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      transports: ['websocket']
    });
    
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current.emit('add user', username);
    });

    socketRef.current.on('login', (data) => {
      setIsConnected(true);
      addSystemMessage(`Welcome to Chat – there are ${data.numUsers} participants`);
    });

    socketRef.current.on('new message', (data) => {
      setMessages(prev => [...prev, { type: 'chat', ...data }]);
    });

    socketRef.current.on('user joined', (data) => {
      addSystemMessage(`${data.username} joined (${data.numUsers} participants)`);
    });

    socketRef.current.on('user left', (data) => {
      addSystemMessage(`${data.username} left (${data.numUsers} participants)`);
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.username);
        return newSet;
      });
    });

    socketRef.current.on('typing', (data) => {
      setTypingUsers(prev => new Set([...prev, data.username]));
    });

    socketRef.current.on('stop typing', (data) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.username);
        return newSet;
      });
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      addSystemMessage('You have been disconnected');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, { type: 'system', text }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message && isConnected) {
      socketRef.current.emit('new message', message);
      setMessages(prev => [...prev, { 
        type: 'chat', 
        username: username, 
        message: message 
      }]);
      setMessage('');
      socketRef.current.emit('stop typing');
      setTyping(false);
    }
  };

  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      socketRef.current.emit('typing');
    }
    lastTypingTime.current = new Date().getTime();

    setTimeout(() => {
      const typingTimer = new Date().getTime();
      const timeDiff = typingTimer - lastTypingTime.current;
      if (timeDiff >= 400 && typing) {
        socketRef.current.emit('stop typing');
        setTyping(false);
      }
    }, 400);
  };

  return (
    <div className="flex flex-col justify-evenly h-screen">
      <div className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        {messages.map((msg, i) => {
          if (msg.type === 'system') {
            return (
              <div key={i} className="text-center">
                <span className="text-xs text-gray-500 italic">{msg.text}</span>
              </div>
            );
          }

          const isOwnMessage = msg.username === username;
          
          return (
            <div key={i} className="chat-message">
              <div className={`flex items-end ${isOwnMessage ? 'justify-end' : ''}`}>
                <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${isOwnMessage ? 'order-1 items-end' : 'order-2 items-start'}`}>
                  <span className={`text-xs text-gray-500 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {msg.username}
                  </span>
                  <div>
                    <span className={`px-4 py-2 rounded-lg inline-block ${isOwnMessage ? 'rounded-br-none bg-gray-700 text-white' : 'rounded-bl-none bg-gray-300 text-gray-600'}`}>
                      {msg.message}
                    </span>
                  </div>
                </div>
                <div className={`flex flex-col items-center ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  <img 
                    src={isOwnMessage ? userProfileImg : '/images/defaultprofile.jpg'} 
                    alt="Profile" 
                    className="w-14 h-14 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/defaultprofile.jpg';
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {typingUsers.size > 0 && (
          <div className="text-center">
            <span className="text-xs text-gray-500 italic">
              {Array.from(typingUsers).join(', ')} is typing...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <form onSubmit={handleSendMessage} className="relative flex">
          <input
            type="text"
            placeholder="Escribe tu mensaje!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-2 bg-gray-200 rounded-md py-3"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-green-800 hover:bg-green-600 focus:outline-none"
            >
              <span className="font-bold">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;