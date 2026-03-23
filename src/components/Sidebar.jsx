import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, LayoutDashboard, MonitorPlay, MessageSquare, Award, Settings, LogOut, Search, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{background: 'var(--primary)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', display: 'flex'}}>
          <BookOpen size={24} color="white" />
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.05em' }}>KodHub</span>
          <span style={{fontSize: '0.65rem', color: '#818CF8', fontWeight: '600', letterSpacing: '0.02em', marginTop: '-0.1rem' }}>Created by Kishora Y E</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, padding: '0 1rem', marginBottom: '0.5rem'}}>Main Menu</div>
        
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/courses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Search size={20} />
          <span>Explore Categories</span>
        </NavLink>
        
        <NavLink to="/my-courses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MonitorPlay size={20} />
          <span>My Courses</span>
        </NavLink>
        
        <NavLink to="/messages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MessageSquare size={20} />
          <span>Messages</span>
        </NavLink>
        
        <NavLink to="/certificates" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Award size={20} />
          <span>Certificates</span>
        </NavLink>

        <NavLink to="/feedback" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart3 size={20} />
          <span>AI Feedback Analysis</span>
        </NavLink>

          <div style={{marginTop: 'auto'}}>
          <div style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, padding: '0 1rem', marginBottom: '0.5rem', marginTop: '2rem'}}>Account</div>
          
          <NavLink to="/settings" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
          
          <button onClick={logout} className="nav-item" style={{color: '#F87171', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit'}}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
