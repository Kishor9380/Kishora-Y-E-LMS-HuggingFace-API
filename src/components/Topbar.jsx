import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, ChevronDown, User, Settings, CheckCircle, FileText, MessageSquare } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function Topbar() {
  const [searchParams] = useSearchParams();
  const searchUrlParam = searchParams.get('search') || '';
  const [query, setQuery] = useState(searchUrlParam);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications, markAllAsRead, unreadCount } = useNotification();

  useEffect(() => {
    setQuery(searchUrlParam);
  }, [searchUrlParam]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    // Only redirect if they type something, or if they clear it while on the courses page
    if (val.trim()) {
      navigate(`/courses?search=${encodeURIComponent(val)}`);
    } else if (location.pathname === '/courses') {
      navigate(`/courses`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/courses?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search for courses, skills, or mentors..." 
          value={query}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      <div className="topbar-actions">
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            className="icon-btn" 
            style={{ color: 'var(--text-muted)', position: 'relative' }}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
            )}
          </button>
          
          {isNotifOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              right: 0,
              width: '320px',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              zIndex: 50,
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Notifications {unreadCount > 0 && `(${unreadCount})`}</div>
                <button 
                  onClick={markAllAsRead}
                  style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Mark all as read
                </button>
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', transition: 'background-color 0.2s', cursor: 'pointer', backgroundColor: notif.read ? 'transparent' : '#f0f9ff' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = notif.read ? '#f3f4f6' : '#e0f2fe'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : '#f0f9ff'}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: notif.type === 'course' ? 'rgba(16, 185, 129, 0.1)' : notif.type === 'cert' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: notif.type === 'course' ? '#10b981' : notif.type === 'cert' ? '#f59e0b' : '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {notif.type === 'course' && <CheckCircle size={18} />}
                        {notif.type === 'cert' && <FileText size={18} />}
                        {notif.type === 'message' && <MessageSquare size={18} />}
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: notif.read ? 500 : 600, marginBottom: '0.25rem' }}>{notif.text}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(notif.date).toLocaleDateString()} {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No notifications yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="user-profile-container" style={{ position: 'relative' }} ref={dropdownRef}>
          <div 
            className="user-profile" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.375rem', borderRadius: '2rem', transition: 'background-color 0.2s' }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #818CF8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 4px rgba(79, 70, 229, 0.3)'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={{fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)'}}>{user?.name || 'User'}</span>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Student</span>
            </div>
            <ChevronDown size={16} color="var(--text-muted)" style={{ marginLeft: '0.25rem', transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
          </div>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              right: 0,
              width: '240px',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              zIndex: 50,
              animation: 'fadeIn 0.2s ease-out'
            }}>
              {/* Dropdown Header */}
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#f9fafb' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.125rem' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{user?.email || 'user@example.com'}</div>
              </div>

              {/* Dropdown Options */}
              <div style={{ padding: '0.5rem' }}>
                <button 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s', textAlign: 'left', color: 'var(--text-main)', fontSize: '0.875rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/profile');
                  }}
                >
                  <User size={16} color="var(--text-muted)" />
                  My Profile
                </button>
                <button 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s', textAlign: 'left', color: 'var(--text-main)', fontSize: '0.875rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/settings');
                  }}
                >
                  <Settings size={16} color="var(--text-muted)" />
                  Settings
                </button>
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }}></div>
                <button 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s', textAlign: 'left', color: '#dc2626', fontSize: '0.875rem', fontWeight: 500 }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
