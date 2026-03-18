import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = resetPassword(email, newPassword);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo" style={{ flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={36} color="var(--primary)" />
              <span style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.05em' }}>KodHub</span>
            </div>
          </div>
          <p style={{color: 'var(--text-muted)', marginTop: '1rem'}}>
            Create a new password for your account.
          </p>
        </div>
        
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#D1FAE5', color: '#065F46', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Password updated successfully! Redirecting to login...
            </div>
            <Link to="/login" className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                className="form-control" 
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                className="form-control" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{width: '100%', gap: '0.5rem', marginTop: '1rem'}}>
              <KeyRound size={20} />
              Reset Password
            </button>
          </form>
        )}
        
        {!success && (
          <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
            Remember your password? <Link to="/login" className="auth-link">Log in</Link>
          </div>
        )}
      </div>
    </div>
  );
}
