import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, BellRing } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const MOCK_USERS = [
  { id: 'inst_1', name: 'Dr. John Doe', role: 'Instructor', avatar: 'https://i.pravatar.cc/150?u=12', unread: 2 },
  { id: 'inst_2', name: 'Prof. Sarah Smith', role: 'Instructor', avatar: 'https://i.pravatar.cc/150?u=22', unread: 0 },
  { id: 'stu_1', name: 'Mike Johnson', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=32', unread: 1 },
];

const INITIAL_MESSAGES = [
  { id: 1, text: 'Hello! I had a quick question about the latest React lesson.', senderId: 'stu_1', receiverId: 'me', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, text: 'Of course, what is your question?', senderId: 'me', receiverId: 'stu_1', timestamp: new Date(Date.now() - 82800000).toISOString() },
  { id: 3, text: 'Why do we need useEffect?', senderId: 'stu_1', receiverId: 'me', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 4, text: 'Hi, I need help with my assignment.', senderId: 'me', receiverId: 'inst_1', timestamp: new Date().toISOString() },
];

export default function Messages() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const [users, setUsers] = useState(MOCK_USERS);
  const [activeChat, setActiveChat] = useState(MOCK_USERS[0].id);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const activeUser = users.find(u => u.id === activeChat);

  const getActiveMessages = () => {
    return messages.filter(m => 
      (m.senderId === activeChat && m.receiverId === 'me') || 
      (m.senderId === 'me' && m.receiverId === activeChat)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  useEffect(() => {
    if (user) {
      const allMessages = JSON.parse(localStorage.getItem('lms_messages') || '[]');
      const myMessages = allMessages.filter(m => m.userId === user.id);
      if (myMessages.length === 0) {
        const initial = INITIAL_MESSAGES.map(m => ({ ...m, userId: user.id }));
        localStorage.setItem('lms_messages', JSON.stringify([...allMessages, ...initial]));
        setMessages(initial);
      } else {
        setMessages(myMessages);
      }
    } else {
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Auto-clear unread when switching active chat
    if (activeUser?.unread > 0) {
      setUsers(prev => prev.map(u => u.id === activeChat ? { ...u, unread: 0 } : u));
    }
  }, [activeChat, messages, activeUser?.unread]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const newMsg = {
      id: Date.now(),
      text: inputText,
      senderId: 'me',
      receiverId: activeChat,
      timestamp: new Date().toISOString(),
      userId: user.id
    };

    const allMessages = JSON.parse(localStorage.getItem('lms_messages') || '[]');
    const updatedMessages = [...allMessages, newMsg];
    localStorage.setItem('lms_messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages.filter(m => m.userId === user.id));
    setInputText('');

    // Simulate real-time reply after a short delay
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: 'Thanks for reaching out! I will get back to you shortly.',
        senderId: activeChat,
        receiverId: 'me',
        timestamp: new Date().toISOString(),
        userId: user.id
      };
      
      const currentAll = JSON.parse(localStorage.getItem('lms_messages') || '[]');
      localStorage.setItem('lms_messages', JSON.stringify([...currentAll, reply]));
      setMessages(prev => [...prev, reply]);
      
      addNotification(`You received a new message.`, 'message');
    }, 2000);
  };

  const formatTime = (dateString) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(dateString));
  };

  return (
    <div className="page-container chat-page">
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1 className="page-title">Messages</h1>
        <p className="page-subtitle">Communicate with your instructors and peers</p>
      </div>



      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-search">
            <Search size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Search conversations..." />
          </div>
          
          <div className="chat-user-list">
            {users.map(user => (
              <div 
                key={user.id} 
                className={`chat-user-item ${activeChat === user.id ? 'active' : ''}`}
                onClick={() => setActiveChat(user.id)}
              >
                <img src={user.avatar} alt={user.name} className="chat-user-avatar" />
                <div className="chat-user-info">
                  <div className="chat-user-name">
                    <h4>{user.name}</h4>
                    {user.unread > 0 && <span className="unread-badge">{user.unread}</span>}
                  </div>
                  <span className="chat-user-role">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {activeUser ? (
            <>
              <div className="chat-header">
                <img src={activeUser.avatar} alt={activeUser.name} className="chat-header-avatar" />
                <div className="chat-header-info">
                  <h3>{activeUser.name}</h3>
                  <span>{activeUser.role}</span>
                </div>
              </div>

              <div className="chat-messages">
                {getActiveMessages().map(msg => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <div key={msg.id} className={`message-wrapper ${isMe ? 'sent' : 'received'}`}>
                      <div className="message-bubble">
                        <p>{msg.text}</p>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message here..." 
                  className="chat-input"
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', borderRadius: '50%' }}>
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
