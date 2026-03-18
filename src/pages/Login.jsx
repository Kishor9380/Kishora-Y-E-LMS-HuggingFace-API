import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simulate login wrapper
    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo" style={{ flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary), #818CF8)', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={32} color="white" />
              </div>
              <span style={{ fontSize: '2.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #111827, #4F46E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>KodHub</span>
            </div>
            <span style={{fontSize: '0.85rem', color: '#6B7280', fontWeight: '500', letterSpacing: '0.02em', marginTop: '0.25rem' }}>Created by Kishora Y E</span>
          </div>
          <p style={{color: '#4B5563', marginTop: '1.25rem', fontSize: '1.05rem'}}>Welcome back! Log in to your account.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
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
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password" style={{display: 'flex', justifyContent: 'space-between'}}>
              Password
              <Link to="/forgot-password" className="auth-link" style={{fontSize: '0.8rem', fontWeight: 600}}>Forgot password?</Link>
            </label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-auth" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem'}}>
            <LogIn size={20} />
            Sign In
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
