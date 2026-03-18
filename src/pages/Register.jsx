import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = signup(name, email, password);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={36} color="var(--primary)" />
              <span style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.05em' }}>KodHub</span>
            </div>
            <span style={{fontSize: '0.85rem', color: '#6B7280', fontWeight: '500', letterSpacing: '0.02em', marginTop: '-0.2rem' }}>Created by Kishora Y E</span>
          </div>
          <p style={{color: 'var(--text-muted)', marginTop: '1rem'}}>Create your account and start learning.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="form-control" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
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
            <label className="form-label" htmlFor="password">Password</label>
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

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
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
            <UserPlus size={20} />
            Sign Up
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
}
