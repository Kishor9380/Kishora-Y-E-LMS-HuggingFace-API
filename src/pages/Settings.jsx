import React, { useState } from 'react';
import { Bell, Lock, User, Eye, Globe, Shield, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { theme, toggleTheme, primaryColor, changePrimaryColor } = useTheme();
  const { user, changePassword, deleteAccount, updateProfile } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  // Profile fields
  const [editName, setEditName] = useState(user?.name || '');
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  
  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'All fields are required' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    const result = changePassword(currentPassword, newPassword);
    if (result.success) {
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: result.error });
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    if (!editName.trim()) {
      setProfileMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }
    const result = updateProfile(editName);
    if (result.success) {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully' });
      addNotification('Profile updated successfully', 'success');
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
    } else {
      setProfileMessage({ type: 'error', text: result.error });
    }
  };

  const handleConfirmDelete = () => {
    const result = deleteAccount();
    if (result.success) {
      navigate('/login');
    }
  };

  const [settings, setSettings] = useState({
    notifications: {
      emailUpdates: true,
      newCourses: false,
      messages: true
    },
    privacy: {
      publicProfile: true,
      showActivity: false
    }
  });

  const handleToggle = (category, field) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const tabs = [
    { id: 'account', label: 'Account Settings', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={18} /> },
    { id: 'display', label: 'Display Settings', icon: <Eye size={18} /> },
  ];

  return (
    <div className="settings-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and application settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Settings Sidebar */}
        <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', 
                  borderRadius: '0.5rem', transition: 'var(--transition)', width: '100%',
                  textAlign: 'left', fontWeight: 500, fontSize: '0.95rem',
                  backgroundColor: activeTab === tab.id ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.05)';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="card" style={{ padding: '2rem' }}>
          
          {activeTab === 'account' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Account Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                <form onSubmit={handleProfileSubmit} className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Profile Information</label>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Update your account's profile information.</p>
                  
                  {profileMessage.text && (
                    <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: profileMessage.type === 'error' ? '#fef2f2' : '#f0fdf4', color: profileMessage.type === 'error' ? '#dc2626' : '#16a34a', border: `1px solid ${profileMessage.type === 'error' ? '#fca5a5' : '#86efac'}`, fontSize: '0.875rem' }}>
                      {profileMessage.text}
                    </div>
                  )}

                  <input type="text" placeholder="Full Name" value={editName} onChange={(e) => setEditName(e.target.value)} className="form-control" style={{ marginBottom: '1rem' }} />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Save Profile</button>
                </form>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }}></div>

                <form onSubmit={handlePasswordSubmit} className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Change Password</label>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Ensure your account is using a long, random password to stay secure.</p>
                  
                  {passwordMessage.text && (
                    <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: passwordMessage.type === 'error' ? '#fef2f2' : '#f0fdf4', color: passwordMessage.type === 'error' ? '#dc2626' : '#16a34a', border: `1px solid ${passwordMessage.type === 'error' ? '#fca5a5' : '#86efac'}`, fontSize: '0.875rem' }}>
                      {passwordMessage.text}
                    </div>
                  )}

                  <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-control" style={{ marginBottom: '1rem' }} />
                  <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" style={{ marginBottom: '1rem' }} />
                  <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" style={{ marginBottom: '1rem' }} />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Save Password</button>
                </form>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }}></div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#dc2626' }}>Delete Account</label>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
                  <button type="button" onClick={() => setShowDeleteModal(true)} className="btn" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontWeight: 600 }}>Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Notification Preferences</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Toggle Item */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Email Updates</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Receive emails about system updates and changes.</div>
                  </div>
                  <div 
                    onClick={() => handleToggle('notifications', 'emailUpdates')}
                    style={{ 
                      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', transition: 'background-color 0.2s', position: 'relative',
                      backgroundColor: settings.notifications.emailUpdates ? 'var(--primary)' : '#cbd5e1'
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', transition: 'transform 0.2s',
                      transform: settings.notifications.emailUpdates ? 'translateX(22px)' : 'translateX(2px)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}></div>
                  </div>
                </div>

                {/* Toggle Item */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>New Courses</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Get notified when new courses matching your interests are added.</div>
                  </div>
                  <div 
                    onClick={() => handleToggle('notifications', 'newCourses')}
                    style={{ 
                      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', transition: 'background-color 0.2s', position: 'relative',
                      backgroundColor: settings.notifications.newCourses ? 'var(--primary)' : '#cbd5e1'
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', transition: 'transform 0.2s',
                      transform: settings.notifications.newCourses ? 'translateX(22px)' : 'translateX(2px)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}></div>
                  </div>
                </div>
                
                {/* Toggle Item */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Direct Messages</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Receive notifications when someone sends you a message.</div>
                  </div>
                  <div 
                    onClick={() => handleToggle('notifications', 'messages')}
                    style={{ 
                      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', transition: 'background-color 0.2s', position: 'relative',
                      backgroundColor: settings.notifications.messages ? 'var(--primary)' : '#cbd5e1'
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', transition: 'transform 0.2s',
                      transform: settings.notifications.messages ? 'translateX(22px)' : 'translateX(2px)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Privacy & Security</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Public Profile</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Allow other students to see your profile and enrolled courses.</div>
                  </div>
                  <div 
                    onClick={() => handleToggle('privacy', 'publicProfile')}
                    style={{ 
                      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', transition: 'background-color 0.2s', position: 'relative',
                      backgroundColor: settings.privacy.publicProfile ? 'var(--primary)' : '#cbd5e1'
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', transition: 'transform 0.2s',
                      transform: settings.privacy.publicProfile ? 'translateX(22px)' : 'translateX(2px)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}></div>
                  </div>
                </div>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Show Activity Status</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Allow connections to see when you are online.</div>
                  </div>
                  <div 
                    onClick={() => handleToggle('privacy', 'showActivity')}
                    style={{ 
                      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', transition: 'background-color 0.2s', position: 'relative',
                      backgroundColor: settings.privacy.showActivity ? 'var(--primary)' : '#cbd5e1'
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', transition: 'transform 0.2s',
                      transform: settings.privacy.showActivity ? 'translateX(22px)' : 'translateX(2px)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}></div>
                  </div>
                </div>
               </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Display Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Theme Mode</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => theme !== 'light' && toggleTheme()}
                      className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1 }}
                    >Light</button>
                    <button 
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1 }}
                    >Dark</button>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Primary Color</h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {[
                      { hex: '#4F46E5', name: 'Indigo' },
                      { hex: '#3B82F6', name: 'Blue' },
                      { hex: '#10B981', name: 'Emerald' },
                      { hex: '#8B5CF6', name: 'Violet' },
                      { hex: '#F43F5E', name: 'Rose' },
                      { hex: '#F59E0B', name: 'Amber' }
                    ].map(color => (
                      <button
                        key={color.hex}
                        onClick={() => changePrimaryColor(color.hex)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: color.hex,
                          border: primaryColor === color.hex ? '3px solid var(--text-main)' : '3px solid transparent',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          transform: primaryColor === color.hex ? 'scale(1.1)' : 'scale(1)'
                        }}
                        title={color.name}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card fade-in" style={{ padding: '2rem', maxWidth: '400px', width: '90%', margin: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#dc2626' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Delete Account</h3>
            </div>
            <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete your account? All of your data will be permanently removed. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn" style={{ backgroundColor: '#dc2626', color: 'white' }} onClick={handleConfirmDelete}>Yes, Delete My Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
