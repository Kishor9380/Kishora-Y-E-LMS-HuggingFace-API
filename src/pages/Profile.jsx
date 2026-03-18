import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useNotification } from '../context/NotificationContext';
import { courses } from '../data/mockData';
import { Mail, User, Shield, BookOpen, Clock, Award, Save, X } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { isCoursePurchased, getCourseProgress, enrolledCourseIds } = useProgress();
  const { addNotification } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  
  const enclosedEnrolledCount = enrolledCourseIds.length;
  
  // Calculate completed courses for certificates count
  const completedCoursesCount = courses.filter(c => isCoursePurchased(c.id) && getCourseProgress(c.id, c.lessons) === 100).length;
  
  // Estimate time learning (stub for now, but could be dynamic)
  const estimatedHours = enclosedEnrolledCount * 4; 

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    updateProfile(editName);
    addNotification('Profile updated successfully', 'success');
    setIsEditing(false);
  };

  return (
    <div className="profile-page fade-in">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal information and view your stats</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Left Column - User Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #818CF8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '3rem', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)', marginBottom: '1.5rem'
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{user?.name}</h2>
            <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '1.5rem' }}>Student</p>

            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
              <Mail size={18} />
              <span style={{ fontSize: '0.95rem' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', color: 'var(--text-muted)' }}>
              <Shield size={18} />
              <span style={{ fontSize: '0.95rem' }}>Active Account</span>
            </div>
          </div>
        </div>

        {/* Right Column - Stats and Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <User size={20} color="var(--primary)" />
              Personal Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                {isEditing ? (
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="form-control" autoFocus />
                ) : (
                  <div style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--text-main)', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>{user?.name}</div>
                )}
              </div>
              <div>
                <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                <div style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--text-main)', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>{user?.email}</div>
              </div>
              <div>
                <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
                <div style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--text-main)', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>Student</div>
              </div>
              <div>
                <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                <div style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--secondary)', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>Verified</div>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              {isEditing ? (
                <>
                  <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }} onClick={() => {setIsEditing(false); setEditName(user?.name || '');}}>
                    <X size={18} /> Cancel
                  </button>
                  <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }} onClick={handleSaveProfile}>
                    <Save size={18} /> Save Changes
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <BookOpen size={24} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{enclosedEnrolledCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Enrolled Courses</div>
            </div>
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                <Clock size={24} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{estimatedHours}h</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Time Learning</div>
            </div>
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%', color: '#F59E0B', marginBottom: '0.5rem' }}>
                <Award size={24} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{completedCoursesCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Certificates</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
